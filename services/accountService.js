const Account = require('../models/Account');
const { formatAccountStatus } = require('../utils/statusFormatter');

class AccountService {
  constructor() {
    this.accounts = new Map();
  }

  createAccount(username) {
    const account = new Account(username);
    this.accounts.set(username, account);
    return account;
  }

  getAccount(username) {
    return this.accounts.get(username);
  }

  async updateStatus(bot, username, newValue = 0) {
    const account = this.getAccount(username);
    if (!account) return;

    const statusMessage = formatAccountStatus(account, newValue);
    await bot.sendMessage(username, statusMessage, { parse_mode: 'Markdown' });
  }

  addValue(username, amount) {
    const account = this.getAccount(username);
    if (!account) throw new Error('Account not found');
    
    account.addValue(amount);
    return account;
  }

  processWithdrawal(username, amount) {
    const account = this.getAccount(username);
    if (!account) throw new Error('Account not found');
    
    account.withdraw(amount);
    return account;
  }
}

module.exports = AccountService;