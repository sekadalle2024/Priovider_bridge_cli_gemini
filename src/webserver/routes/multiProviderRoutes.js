/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Version JavaScript (non-bundlée) pour éviter les problèmes de dépendances
 */

const express = require('express');

// Placeholder - les routes seront chargées dynamiquement
function registerMultiProviderRoutes(app) {
  console.log('[MultiProvider] Routes registration skipped - using TypeScript compilation');
  console.log('[MultiProvider] Please use: npm run package to build the full application');
}

module.exports = { registerMultiProviderRoutes };
module.exports.default = registerMultiProviderRoutes;
