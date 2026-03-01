/**
 * Netlify Function - Assistants List Endpoint
 * Liste tous les assistants disponibles
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

// Liste des assistants (hardcodée pour Netlify)
const ASSISTANTS = [
  {
    id: 'beautiful-mermaid',
    name: 'Beautiful Mermaid',
    description: 'Génération de diagrammes Mermaid',
  },
  {
    id: 'cowork',
    name: 'Cowork',
    description: 'Assistant de collaboration',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyse de données',
  },
  {
    id: 'game-3d',
    name: 'Game 3D',
    description: 'Développement de jeux 3D',
  },
  {
    id: 'human-3-coach',
    name: 'Human 3 Coach',
    description: 'Coaching personnel',
  },
  {
    id: 'moltbook',
    name: 'Moltbook',
    description: 'Gestion de livres',
  },
  {
    id: 'openclaw-setup',
    name: 'OpenClaw Setup',
    description: 'Configuration OpenClaw',
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PPT',
    description: 'Conversion PDF vers PowerPoint',
  },
  {
    id: 'planning-with-files',
    name: 'Planning with Files',
    description: 'Planification avec fichiers',
  },
  {
    id: 'pptx-generator',
    name: 'PPTX Generator',
    description: 'Génération de présentations',
  },
  {
    id: 'social-job-publisher',
    name: 'Social Job Publisher',
    description: "Publication d'offres d'emploi",
  },
  {
    id: 'story-roleplay',
    name: 'Story Roleplay',
    description: 'Jeu de rôle narratif',
  },
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    description: 'Design UI/UX professionnel',
  },
];

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      object: 'list',
      data: ASSISTANTS,
    }),
  };
};
