/**
 * Netlify serverless function adapter
 * Wraps the Express app for Netlify Functions deployment
 */

const serverless = require('serverless-http');

// We need to build the server first for this to work
let handler;

try {
    const app = require('../../dist/server').default;
    handler = serverless(app);
} catch (err) {
    // Fallback: provide a basic response
    handler = async (event, context) => {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Server not built. Run: npm run build',
                details: err.message,
            }),
        };
    };
}

exports.handler = handler;
