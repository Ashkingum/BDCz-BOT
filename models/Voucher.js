class Voucher {
  constructor(type, amount, validityHours) {
    this.code = null;
    this.type = type;
    this.amount = amount;
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + validityHours * 60 * 60 * 1000);
  }

  isValid() {
    return new Date() < this.expiresAt;
  }

  static getPrefix(type) {
    const prefixes = {
      welcome: 'BDCzWLCM',
      gift: 'BDCzGIFT',
      free: 'BDCzFREE'
    };
    return prefixes[type] || '';
  }
}

module.exports = Voucher;