class Account {
  constructor(username) {
    this.accountNumber = generateAccountNumber();
    this.username = username;
    this.streak = 0;
    this.balance = 0;
    this.totalGenerated = 0;
    this.totalWithdrawn = 0;
    this.stakedAmount = 0;
    this.manualStakes = [];
    this.referrals = [];
    this.lastUpdate = new Date();
    this.lastStreakCheck = null;
    this.inviteLink = null;
    this.vaultBalance = 0; // Track vault balance
    this.menuEnabled = true; // Track menu state
  }

  // Add new methods for vault functionality
  addToVault(amount) {
    this.vaultBalance += amount;
    this.balance -= amount;
    this.lastUpdate = new Date();
  }

  getVaultBalance() {
    return this.vaultBalance;
  }

  // Add methods for menu control
  disableMenu() {
    this.menuEnabled = false;
  }

  enableMenu() {
    this.menuEnabled = true;
  }

  isMenuEnabled() {
    return this.menuEnabled;
  }

  // Add method to reset account
  resetToZero() {
    this.balance = 0;
    this.totalGenerated = 0;
    this.totalWithdrawn = 0;
    this.stakedAmount = 0;
    this.manualStakes = [];
    this.referrals = [];
    this.streak = 0;
    this.vaultBalance = 0;
    this.lastUpdate = new Date();
    this.lastStreakCheck = null;
  }

  // ... existing methods remain the same ...
}