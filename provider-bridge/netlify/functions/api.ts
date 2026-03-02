/**
 * Netlify Function — Main API Handler
 * Wraps the Express app for serverless deployment
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import serverless from 'serverless-http';

// Import the Express app
// Note: This will be the compiled JS from dist/server.js
let app: any;

try {
    // Dynamic import to handle both local and deployed environments
    app = require('../../dist/server.js').default || require('../../dist/server.js');
} catch (error) {
    console.error('Failed to load Express app:', error);
    throw error;
}

// Create serverless handler
const serverlessHandler = serverless(app, {
    binary: ['image/*', 'application/pdf', 'application/octet-stream'],
});

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Ensure database is initialized on cold starts
    try {
        const response = await serverlessHandler(event, context);
        return response;
    } catch (error) {
        console.error('Serverless handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
