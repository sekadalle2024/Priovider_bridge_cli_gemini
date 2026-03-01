#!/usr/bin/env node

/**
 * Provider Bridge — Simple Endpoint Tests
 */

const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:25809';
const TIMEOUT = 5000;

let passed = 0;
let failed = 0;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 25809,
      path: url.pathname + url.search,
      method: method,
      timeout: TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: null });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test(name, method, path, body = null, expectedStatus = 200) {
  try {
    const res = await makeRequest(method, path, body);
    if (res.status === expectedStatus) {
      console.log(`✓ ${name}`);
      passed++;
    } else {
      console.log(`✗ ${name} (got ${res.status}, expected ${expectedStatus})`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ ${name} (${error.message})`);
    failed++;
  }
}

async function runTests() {
  console.log('\n🧪 Testing Provider Bridge Endpoints\n');
  console.log(`Target: ${BASE_URL}\n`);

  await test('Health check', 'GET', '/health', null, 200);
  await test('List providers', 'GET', '/api/providers', null, 200);
  await test('List models', 'GET', '/api/providers/models', null, 200);
  await test('API Key stats', 'GET', '/api/providers/gemini_api_key_rotative/stats', null, 200);
  await test('OpenAI models', 'GET', '/v1/models', null, 200);

  await test('Chat (Gemini Rotative)', 'POST', '/api/providers/gemini_api_key_rotative/chat', {
    messages: [{ role: 'user', content: 'Hello' }],
    model: 'gemini-2.5-flash',
  }, 200);

  await test('Chat (OpenAI compatible)', 'POST', '/v1/chat/completions', {
    model: 'gemini-2.5-flash',
    messages: [{ role: 'user', content: 'Test' }],
  }, 200);

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(console.error);
