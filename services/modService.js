const { adminUsers } = require('../config/channels');

class ModService {
  constructor() {
    this.pendingInvites = new Map();
  }

  async addModerator(username) {
    if (this.isModerator(username)) {
      throw new Error('User is already a moderator');
    }
    
    // Create pending invite
    const invite = {
      username,
      status: 'pending',
      timestamp: new Date()
    };
    
    this.pendingInvites.set(username, invite);
    return invite;
  }

  async removeModerator(username) {
    if (!this.isModerator(username)) {
      throw new Error('User is not a moderator');
    }
    
    const index = adminUsers.findIndex(admin => admin === username);
    if (index !== -1) {
      adminUsers.splice(index, 1);
      return true;
    }
    return false;
  }

  isModerator(username) {
    return adminUsers.includes(username);
  }

  async acceptInvite(username) {
    const invite = this.pendingInvites.get(username);
    if (!invite) {
      throw new Error('No pending invite found');
    }

    adminUsers.push(username);
    this.pendingInvites.delete(username);
    return true;
  }

  async declineInvite(username) {
    const invite = this.pendingInvites.get(username);
    if (!invite) {
      throw new Error('No pending invite found');
    }

    this.pendingInvites.delete(username);
    return true;
  }

  getModeratorList() {
    return adminUsers;
  }
}

module.exports = ModService;