const crypto = require('crypto');

class VoucherGenerator {
  static generateRandomLetters(length = 4) {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(crypto.randomBytes(length))
      .map(byte => letters[byte % letters.length])
      .join('');
  }

  static generateRandomNumbers(length = 4) {
    return Array.from(crypto.randomBytes(length))
      .map(byte => byte % 10)
      .join('');
  }

  static generateRandomSymbols(length = 4) {
    const symbols = '*#@$!&%^';
    return Array.from(crypto.randomBytes(length))
      .map(byte => symbols[byte % symbols.length])
      .join('');
  }

  static generateCode(type) {
    const prefix = Voucher.getPrefix(type);
    const letters = this.generateRandomLetters();
    const numbers = this.generateRandomNumbers();
    const symbols = this.generateRandomSymbols();
    
    return `${prefix}-${letters}-${numbers}-${symbols}`;
  }
}

module.exports = VoucherGenerator;