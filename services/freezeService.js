class FreezeService {
  constructor() {
    this.frozenAccounts = new Set();
    this.languageSelections = new Map(); // Track language selections for frozen accounts
  }

  async isAccountFrozen(userId) {
    return this.frozenAccounts.has(userId);
  }

  async freezeAccount(userId) {
    this.frozenAccounts.add(userId);
    // Reset account values and disable menu
    await this.resetAccountValues(userId);
  }

  async unfreezeAccount(userId) {
    this.frozenAccounts.delete(userId);
    this.languageSelections.delete(userId);
  }

  setLanguageSelection(userId, language) {
    if (this.frozenAccounts.has(userId)) {
      this.languageSelections.set(userId, language);
    }
  }

  getLanguageSelection(userId) {
    return this.languageSelections.get(userId);
  }

  private async resetAccountValues(userId) {
    const account = await accountService.getAccount(userId);
    if (account) {
      account.resetToZero();
      account.disableMenu();
    }
  }

  checkFrozenStatus(userId) {
    if (this.frozenAccounts.has(userId)) {
      throw new Error('Account is frozen. Please unfreeze to continue.');
    }
  }
}

module.exports = FreezeService;