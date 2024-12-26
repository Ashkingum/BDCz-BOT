const crypto = require('crypto');

class LinkValidator {
  static isValidToken(token) {
    return /^[a-f0-9]{32}$/.test(token);
  }

  static isExpired(timestamp) {
    return Date.now() > timestamp;
  }

  static validateLink(token, activeLinks) {
    if (!this.isValidToken(token)) {
      return { valid: false, error: 'Invalid token format' };
    }

    const linkData = activeLinks.get(token);
    if (!linkData) {
      return { valid: false, error: 'Link not found' };
    }

    if (this.isExpired(linkData.expiresAt)) {
      return { valid: false, error: 'Link expired' };
    }

    return { valid: true, linkData };
  }
}

module.exports = LinkValidator;