const Voucher = require('../models/Voucher');
const VoucherGenerator = require('../utils/voucherGenerator');

class VoucherService {
  constructor() {
    this.userVouchers = new Map();
    this.cooldowns = new Map();
    this.welcomeVoucherRecipients = new Set();
  }

  generateWelcomeVoucher(userId) {
    if (this.welcomeVoucherRecipients.has(userId)) {
      throw new Error('Welcome voucher already received');
    }

    const voucher = new Voucher('welcome', 1, 24);
    voucher.code = VoucherGenerator.generateCode('welcome');
    this.userVouchers.set(userId, voucher);
    this.welcomeVoucherRecipients.add(userId);
    return voucher;
  }

  hasReceivedWelcomeVoucher(userId) {
    return this.welcomeVoucherRecipients.has(userId);
  }

  // ... rest of the VoucherService implementation remains the same ...
}

module.exports = VoucherService;