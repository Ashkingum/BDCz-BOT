const { MENU_OPTIONS } = require('../constants/menuOptions');

class ModRightsService {
  constructor() {
    this.modPermissions = new Map(); // username -> Set of permitted commands
    this.defaultCommands = new Set([
      MENU_OPTIONS.ACCOUNT_STATUS.callback,
      MENU_OPTIONS.STATS.callback
    ]);
  }

  getModPermissions(username) {
    return this.modPermissions.get(username) || new Set(this.defaultCommands);
  }

  hasPermission(username, command) {
    const permissions = this.getModPermissions(username);
    return permissions.has(command);
  }

  togglePermission(username, command) {
    let permissions = this.modPermissions.get(username);
    if (!permissions) {
      permissions = new Set(this.defaultCommands);
      this.modPermissions.set(username, permissions);
    }

    const hasPermission = permissions.has(command);
    if (hasPermission) {
      permissions.delete(command);
    } else {
      permissions.add(command);
    }

    return !hasPermission; // Return new state
  }

  getAllCommands() {
    return Object.entries(MENU_OPTIONS).map(([key, value]) => ({
      text: value.text,
      callback: value.callback
    }));
  }
}

module.exports = ModRightsService;