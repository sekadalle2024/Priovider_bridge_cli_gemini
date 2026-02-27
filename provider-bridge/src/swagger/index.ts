/**
 * Provider Bridge — Swagger/OpenAPI Specification
 */

export const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Provider Bridge Endpoint',
        version: '1.0.0',
        description: `
# Provider Bridge API

Centralized API gateway for **Gemini CLI**, **Gemini API Key Rotative**, and **Kiro CLI**.

## Providers

| Provider | Description | Auth |
|----------|-------------|------|
| \`gemini_cli\` | Google Gemini via CLI | Google OAuth |
| \`gemini_api_key_rotative\` | Gemini API with key rotation | API Keys in .env |
| \`kiro_cli\` | Amazon Kiro via CLI | CLI auth |

## OpenAI-Compatible

Use \`POST /v1/chat/completions\` and \`GET /v1/models\` for n8n/LangChain integration.
    `,
        contact: {
            name: 'AionUi',
            url: 'https://github.com/iOfficeAI/AionUi',
        },
    },
    servers: [
        { url: '/', description: 'Current server' },
    ],
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Admin', description: 'Admin dashboard endpoints' },
        { name: 'Gemini CLI', description: 'Gemini CLI provider' },
        { name: 'Gemini API Key', description: 'Gemini API Key Rotative' },
        { name: 'Kiro CLI', description: 'Kiro CLI provider' },
        { name: 'OpenAI Compatible', description: 'OpenAI-compatible endpoints' },
        { name: 'Common', description: 'Common endpoints' },
    ],
    paths: {
        '/api/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email and password',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'admin' },
                                    password: { type: 'string', example: 'admin123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Login successful, returns JWT token' },
                    '401': { description: 'Invalid credentials' },
                },
            },
        },
        '/api/auth/google': {
            get: {
                tags: ['Auth'],
                summary: 'Initiate Google OAuth login',
                description: 'Redirects to Google OAuth consent page',
                responses: { '302': { description: 'Redirect to Google' } },
            },
        },
        '/api/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get current user info',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'User info' } },
            },
        },
        '/api/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'List all users',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Users list with stats' } },
            },
        },
        '/api/admin/users/{id}': {
            delete: {
                tags: ['Admin'],
                summary: 'Delete a user',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'User deleted' } },
            },
        },
        '/api/admin/stats': {
            get: {
                tags: ['Admin'],
                summary: 'Aggregated usage statistics',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Stats overview' } },
            },
        },
        '/api/providers/gemini_cli/chat': {
            post: {
                tags: ['Gemini CLI'],
                summary: 'Chat with Gemini CLI',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChatRequest' },
                        },
                    },
                },
                responses: { '200': { description: 'Chat response' } },
            },
        },
        '/api/providers/gemini_api_key_rotative/chat': {
            post: {
                tags: ['Gemini API Key'],
                summary: 'Chat with Gemini (API Key Rotation)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChatRequest' },
                        },
                    },
                },
                responses: { '200': { description: 'Chat response with key info' } },
            },
        },
        '/api/providers/gemini_api_key_rotative/stats': {
            get: {
                tags: ['Gemini API Key'],
                summary: 'API key rotation statistics',
                responses: { '200': { description: 'Key usage stats' } },
            },
        },
        '/api/providers/kiro_cli/chat': {
            post: {
                tags: ['Kiro CLI'],
                summary: 'Chat with Kiro CLI',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChatRequest' },
                        },
                    },
                },
                responses: { '200': { description: 'Chat response' } },
            },
        },
        '/v1/chat/completions': {
            post: {
                tags: ['OpenAI Compatible'],
                summary: 'OpenAI-compatible chat completions',
                description: 'Use this endpoint with n8n, LangChain, or any OpenAI-compatible client',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/OpenAIChatRequest' },
                        },
                    },
                },
                responses: { '200': { description: 'OpenAI-format response' } },
            },
        },
        '/v1/models': {
            get: {
                tags: ['OpenAI Compatible'],
                summary: 'List available models (OpenAI format)',
                responses: { '200': { description: 'Models list' } },
            },
        },
        '/api/providers': {
            get: {
                tags: ['Common'],
                summary: 'List all providers and their status',
                responses: { '200': { description: 'Providers with availability' } },
            },
        },
        '/api/version': {
            get: {
                tags: ['Common'],
                summary: 'API version info',
                responses: { '200': { description: 'Version info' } },
            },
        },
        '/health': {
            get: {
                tags: ['Common'],
                summary: 'Health check',
                responses: { '200': { description: 'Server is healthy' } },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ChatRequest: {
                type: 'object',
                required: ['messages'],
                properties: {
                    messages: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                                content: { type: 'string' },
                            },
                        },
                        example: [{ role: 'user', content: 'Bonjour!' }],
                    },
                    model: { type: 'string', example: 'gemini-2.5-flash' },
                    options: {
                        type: 'object',
                        properties: {
                            temperature: { type: 'number', minimum: 0, maximum: 2 },
                            max_tokens: { type: 'number' },
                        },
                    },
                },
            },
            OpenAIChatRequest: {
                type: 'object',
                required: ['messages'],
                properties: {
                    messages: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                                content: { type: 'string' },
                            },
                        },
                    },
                    model: { type: 'string', default: 'gemini-2.5-flash' },
                    temperature: { type: 'number' },
                    max_tokens: { type: 'number' },
                },
            },
        },
    },
};

/**
 * Generate Swagger UI HTML page
 */
export function getSwaggerHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Provider Bridge — API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
  <style>
    body { margin: 0; background: #1a1a2e; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
    });
  </script>
</body>
</html>`;
}
