// Add to existing adminUtils.js
const ModRightsService = require('../services/modRightsService');
const modRightsService = new ModRightsService();

function hasModPermission(username, command) {
  return modRightsService.hasPermission(username, command);
}

module.exports = {
  // ... existing exports
  hasModPermission
};