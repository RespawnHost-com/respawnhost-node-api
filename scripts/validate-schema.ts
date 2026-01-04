#!/usr/bin/env bun

/**
 * Schema Validation Script
 * 
 * This script validates API responses against the OpenAPI schema (spec.json)
 * to detect differences between actual responses and the documented schema.
 * 
 * Usage:
 *   bun scripts/validate-schema.ts [options]
 *
 * Options:
 *   --endpoint PATH       Test a specific endpoint (e.g., "/api/v1/payments")
 *   --method METHOD       Test a specific HTTP method (e.g., "GET", "POST")
 *   --fail-fast           Stop on first validation error
 *   --verbose             Show detailed validation output including actual values of failed fields
 *   --include-destructive Include DELETE and modification operations (may modify server data)
 *
 * Environment variables:
 *   RESPAWNHOST_API_KEY  Required: Your RespawnHost API key
 *   RESPAWNHOST_BASE_URL Optional: Base URL (default: https://respawnhost.com)
 *   TEST_SERVER_UUID     Required for endpoints with path parameters (e.g., /{uuid}, /{id}, etc.)
 */

import $RefParser from '@apidevtools/swagger-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { RespawnHostClient } from '../src/client.js';

interface ValidationResult {
  endpoint: string;
  method: string;
  path: string;
  valid: boolean;
  errors?: Array<{
    instancePath: string;
    schemaPath: string;
    message: string;
    params?: any;
  }>;
  response?: any;
}

interface ValidationSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  results: ValidationResult[];
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  endpoint: '',
  method: '',
  failFast: false,
  verbose: false,
  includeDestructive: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--endpoint' && args[i + 1]) {
    options.endpoint = args[++i];
  } else if (args[i] === '--method' && args[i + 1]) {
    options.method = args[++i].toUpperCase();
  } else if (args[i] === '--fail-fast') {
    options.failFast = true;
  } else if (args[i] === '--verbose') {
    options.verbose = true;
  } else if (args[i] === '--include-destructive') {
    options.includeDestructive = true;
  }
}

// Validate environment
const apiKey = process.env.RESPAWNHOST_API_KEY;
if (!apiKey) {
  console.error('❌ RESPAWNHOST_API_KEY environment variable is required');
  console.error('Example: RESPAWNHOST_API_KEY=your-key bun scripts/validate-schema.ts');
  process.exit(1);
}

const baseURL = process.env.RESPAWNHOST_BASE_URL || 'https://respawnhost.com';
const testServerUuid = process.env.TEST_SERVER_UUID || '';

console.log('🔍 OpenAPI Schema Validation');
console.log('================================');
console.log(`Base URL: ${baseURL}`);
if (testServerUuid) {
  console.log(`Test Server UUID: ${testServerUuid}`);
} else {
  console.log('⚠️  Warning: TEST_SERVER_UUID not set. Endpoints with path parameters will be skipped.');
}
console.log(`Options: ${JSON.stringify(options, null, 2)}`);
console.log('');

// Helper function to get value from object using JSON Pointer (instancePath)
function getValueByPath(obj: any, path: string): any {
  if (!path || path === '') return obj;
  
  // Remove leading slash and split by slash
  const parts = path.substring(1).split('/');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // Handle array indices (parts that are numbers)
    if (/^\d+$/.test(part)) {
      current = current[parseInt(part, 10)];
    } else {
      current = current[part];
    }
  }
  
  return current;
}

// Helper function to replace path parameters with actual values
function resolvePathParams(path: string): string {
  let missingParams: string[] = [];

  const resolved = path.replace(/\{(\w+)\}/g, (match, paramName) => {
    // Use fetched resource IDs
    if (paramName === 'uuid' && testServerUuid) {
      return testServerUuid;
    }
    if (paramName === 'backupId' && resourceIds.backupId) {
      return resourceIds.backupId;
    }
    if (paramName === 'databaseId' && resourceIds.databaseId) {
      return resourceIds.databaseId;
    }
    if (paramName === 'scheduleId' && resourceIds.scheduleId) {
      return resourceIds.scheduleId;
    }
    if (paramName === 'taskId' && resourceIds.taskId) {
      return resourceIds.taskId;
    }
    if (paramName === 'lang') {
      return 'en'; // Default to English for language parameter
    }

    // Handle other parameters
    if (paramName === 'userId' || paramName === 'id') {
      // These require additional setup, skip for now
    }

    missingParams.push(paramName);
    return match;
  });

  if (missingParams.length > 0) {
    const message = `No value for path parameter(s): {${missingParams.join('}, {')}}. Make sure the server has backups, databases, or schedules created.`;
    console.log(`  ⚠️  Skipping: ${message}`);
    throw new Error(message);
  }

  return resolved;
}

// Helper function to generate sample data from JSON Schema
function generateSampleData(schema: any, depth: number = 0): any {
  if (depth > 10) {
    return '...';
  }

  if (!schema) {
    return null;
  }

  // Handle simple types
  if (schema.type === 'string') {
    if (schema.enum) {
      return schema.enum[0];
    }
    if (schema.format === 'email') {
      return 'test@example.com';
    }
    if (schema.format === 'date-time') {
      return new Date().toISOString();
    }
    if (schema.format === 'uri') {
      return 'https://example.com';
    }
    if (schema.format === 'uuid') {
      return '00000000-0000-0000-0000-000000000000';
    }
    if (schema.default !== undefined) {
      return schema.default;
    }
    if (schema.minLength) {
      return 'a'.repeat(schema.minLength);
    }
    return 'test';
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    if (schema.default !== undefined) return schema.default;
    if (schema.minimum !== undefined) return schema.minimum;
    return 1;
  }

  if (schema.type === 'boolean') {
    if (schema.default !== undefined) return schema.default;
    return true;
  }

  if (schema.type === 'array') {
    if (schema.items) {
      return [generateSampleData(schema.items, depth + 1)];
    }
    return [];
  }

  if (schema.type === 'object') {
    const result: any = {};
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties as Record<string, any>)) {
        result[key] = generateSampleData(propSchema, depth + 1);
      }
    }
    return result;
  }

  // Handle $ref (should be dereferenced by swagger-parser, but just in case)
  if (schema.$ref) {
    return generateSampleData(schema.$ref, depth + 1);
  }

  return null;
}

// Initialize client and AJV validator
const client = new RespawnHostClient({ apiKey, baseURL });
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Store fetched resource IDs
const resourceIds: {
  backupId?: string;
  databaseId?: string;
  scheduleId?: string;
  taskId?: string;
} = {};

// Fetch resource IDs if test server UUID is provided
async function fetchResourceIds() {
  if (!testServerUuid) {
    return;
  }

  console.log('🔗 Fetching resource IDs from API...');
  console.log('  ℹ️  If resources (backups, databases, schedules) don\'t exist on the test server, those endpoints will be skipped.');

  try {
    // Fetch backups
    try {
      const response = await fetch(`${baseURL}/api/v1/servers/${testServerUuid}/backups`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const backups = await response.json();
        if (backups.length > 0) {
          resourceIds.backupId = String(backups[0].id);
          console.log(`  ✅ Found backup ID: ${resourceIds.backupId}`);
        } else {
          console.log(`  ⚠️  No backups found for test server`);
        }
      } else {
        console.log(`  ⚠️  Could not fetch backups: HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.log(`  ⚠️  Could not fetch backups: ${error.message}`);
    }

    // Fetch databases
    try {
      const response = await fetch(`${baseURL}/api/v1/servers/${testServerUuid}/databases`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const databases = await response.json();
        if (databases.data.length > 0) {
          resourceIds.databaseId = String(databases.data[0].attributes.id);
          console.log(`  ✅ Found database ID: ${resourceIds.databaseId}`);
        } else {
          console.log(`  ⚠️  No databases found for test server`);
        }
      } else {
        console.log(`  ⚠️  Could not fetch databases: HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.log(`  ⚠️  Could not fetch databases: ${error.message}`);
    }

    // Fetch schedules
    try {
      const response = await fetch(`${baseURL}/api/v1/servers/${testServerUuid}/schedules`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const schedules = await response.json();
        if (schedules.length > 0) {
          resourceIds.scheduleId = String(schedules[0].id);
          console.log(`  ✅ Found schedule ID: ${resourceIds.scheduleId}`);
          
          // Fetch tasks for first schedule
          try {
            const tasksResponse = await fetch(`${baseURL}/api/v1/servers/${testServerUuid}/schedules/${resourceIds.scheduleId}`, {
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            });
            if (tasksResponse.ok) {
              const schedule = await tasksResponse.json();
              if (schedule.tasks && schedule.tasks.length > 0) {
                resourceIds.taskId = String(schedule.tasks[0].id);
                console.log(`  ✅ Found task ID: ${resourceIds.taskId}`);
              } else {
                console.log(`  ⚠️  No tasks found for schedule`);
              }
            } else {
              console.log(`  ⚠️  Could not fetch tasks: HTTP ${tasksResponse.status}`);
            }
          } catch (error: any) {
            console.log(`  ⚠️  Could not fetch tasks: ${error.message}`);
          }
        } else {
          console.log(`  ⚠️  No schedules found for test server`);
        }
      } else {
        console.log(`  ⚠️  Could not fetch schedules: HTTP ${response.status}`);
      }
    } catch (error: any) {
      console.log(`  ⚠️  Could not fetch schedules: ${error.message}`);
    }

    console.log('');
  } catch (error: any) {
    console.log(`  ❌ Error fetching resource IDs: ${error.message}`);
    console.log('');
  }
}

// Fetch IDs before starting validation
await fetchResourceIds();

// Log destructive mode warning
if (!options.includeDestructive) {
  console.log('🛡️  Running in safe mode (GET requests only)');
  console.log('   Use --include-destructive flag to test POST/PUT/DELETE operations');
  console.log('');
} else {
  console.log('⚠️  Running with destructive operations enabled');
  console.log('   POST/PUT/DELETE operations will modify server data!');
  console.log('');
}

// Load and parse OpenAPI spec
console.log('📄 Loading OpenAPI specification...');
const api = await $RefParser.dereference('./spec.json');
console.log(`✅ Loaded spec: ${api.info?.title} v${api.info?.version}`);
console.log('');

// Filter endpoints based on command line options
let endpointsToTest: Array<{ path: string; method: string; schema: any }> = [];

for (const [path, pathItem] of Object.entries(api.paths as Record<string, any>)) {
  if (options.endpoint && !path.includes(options.endpoint)) continue;

  for (const [method, operation] of Object.entries(pathItem)) {
    if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;
    if (options.method && method !== options.method.toLowerCase()) continue;

    // Skip destructive operations unless explicitly enabled
    const isDestructive = ['post', 'put', 'delete', 'patch'].includes(method);
    if (isDestructive && !options.includeDestructive) {
      continue;
    }

    endpointsToTest.push({
      path,
      method: method.toUpperCase(),
      schema: operation,
    });
  }
}

console.log(`📍 Found ${endpointsToTest.length} endpoints to test`);
console.log('');

// Validation results
const summary: ValidationSummary = {
  total: endpointsToTest.length,
  passed: 0,
  failed: 0,
  skipped: 0,
  results: [],
};

// Test each endpoint
for (const endpoint of endpointsToTest) {
  const { path, method, schema } = endpoint;
  console.log(`\n${method} ${path}`);

  try {
    // Extract schema for the response
    const responseCode = schema.responses?.['200'] || schema.responses?.['201'] || schema.responses?.['default'];
    if (!responseCode || !responseCode.content) {
      console.log('  ⚠️  Skipping: No response schema found');
      summary.skipped++;
      summary.results.push({
        endpoint: path,
        method,
        path,
        valid: false,
      });
      continue;
    }

    const responseSchema = responseCode.content['application/json']?.schema;
    if (!responseSchema) {
      console.log('  ⚠️  Skipping: No JSON schema found');
      summary.skipped++;
      continue;
    }

    // Make the API call
    let response: any;
    const queryParams: any = {};
    const pathParams: any = {};

    // Add query parameters if defined in the schema
    if (schema.parameters) {
      for (const param of schema.parameters) {
        if (param.in === 'query') {
          queryParams[param.name] = param.schema?.default || generateSampleData(param.schema);
        } else if (param.in === 'path') {
          if (param.name === 'uuid' && testServerUuid) {
            pathParams[param.name] = testServerUuid;
          } else {
            pathParams[param.name] = generateSampleData(param.schema);
          }
        }
      }
    }

    // Resolve path parameters
    let resolvedPath = path;
    try {
      resolvedPath = resolvePathParams(path);
    } catch (error: any) {
      console.log(`  ⚠️  ${error.message}`);
      summary.skipped++;
      continue;
    }

    // Generate request body for methods that need it
    let requestBody: any = undefined;
    if (schema.requestBody) {
      const requestBodyContent = schema.requestBody.content?.['application/json'];
      if (requestBodyContent?.schema) {
        requestBody = generateSampleData(requestBodyContent.schema);
        if (options.verbose) {
          console.log('  📝 Request body:', JSON.stringify(requestBody, null, 2).substring(0, 200) + '...');
        }
      }
    }

    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${baseURL}${resolvedPath}${queryString ? '?' + queryString : ''}`;

    // Make the API call
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    if (requestBody !== undefined) {
      fetchOptions.method = method;
      fetchOptions.body = JSON.stringify(requestBody);
    } else {
      fetchOptions.method = method;
    }

    response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.log(`  ⚠️  Skipping: HTTP ${response.status} ${response.statusText}`);
      summary.skipped++;
      continue;
    }

    const data = await response.json();
    if (options.verbose) {
      console.log('  📦 Response:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
    }

    // Validate response against schema
    const validate = ajv.compile(responseSchema.content?.['application/json']?.schema || responseSchema);
    const valid = validate(data);

    const result: ValidationResult = {
      endpoint: path,
      method,
      path,
      valid,
      response: options.verbose ? data : undefined,
    };

    if (!valid) {
      result.errors = validate.errors?.map((error: any) => ({
        instancePath: error.instancePath,
        schemaPath: error.schemaPath,
        message: error.message,
        params: error.params,
      }));

      console.log('  ❌ Validation failed');
      if (result.errors && options.verbose) {
        for (const error of result.errors) {
          const actualValue = getValueByPath(data, error.instancePath);
          console.log(`     - ${error.instancePath || 'root'}: ${error.message}`);
          console.log(`       Schema: ${error.schemaPath}`);
          console.log(`       Actual value: ${JSON.stringify(actualValue)}`);
        }
      } else if (result.errors) {
        console.log(`     - ${result.errors.length} error(s) found`);
      }

      summary.failed++;
    } else {
      console.log('  ✅ Validation passed');
      summary.passed++;
    }

    summary.results.push(result);

    if (!valid && options.failFast) {
      console.log('\n⛔ Stopping due to validation error (--fail-fast)');
      break;
    }
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
    summary.failed++;
    summary.results.push({
      endpoint: path,
      method,
      path,
      valid: false,
      errors: [{ instancePath: '', schemaPath: '', message: error.message }],
    });

    if (options.failFast) {
      console.log('\n⛔ Stopping due to error (--fail-fast)');
      break;
    }
  }
}

// Print summary
console.log('\n================================');
console.log('📊 Validation Summary');
console.log('================================');
console.log(`Total:    ${summary.total}`);
console.log(`Passed:   ${summary.passed} ✅`);
console.log(`Failed:   ${summary.failed} ❌`);
console.log(`Skipped:  ${summary.skipped} ⚠️ `);

if (summary.failed > 0) {
  console.log('\n❌ Validation failed!');
  process.exit(1);
} else {
  console.log('\n✅ All validations passed!');
  process.exit(0);
}
