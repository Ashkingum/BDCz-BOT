const AccountService = require('../accountService');
const VoucherService = require('../voucherService');
const StakingService = require('../stakingService');
const WithdrawalService = require('../withdrawalService');
const StreakService = require('../streakService');
const ReferralService = require('../referralService');

class ReinitService {
  constructor() {
    this.accountService = new AccountService();
    this.voucherService = new VoucherService();
    this.stakingService = new StakingService();
    this.withdrawalService = new WithdrawalService();
    this.streakService = new StreakService();
    this.referralService = new ReferralService();
  }

  async reinitialize() {
    try {
      // Clear all accounts and reset to initial state
      await this.clearAccounts();
      
      // Clear all services data
      await this.clearServices();
      
      return true;
    } catch (error) {
      console.error('Error during re-initialization:', error);
      throw new Error('Failed to complete re-initialization');
    }
  }

  private async clearAccounts() {
    // Get all accounts
    const accounts = Array.from(this.accountService.accounts.values());
    
    // Reset each account to initial state
    for (const account of accounts) {
      account.resetToZero();
      account.enableMenu();
    }
  }

  private async clearServices() {
    // Clear vouchers
    this.voucherService.userVouchers.clear();
    this.voucherService.cooldowns.clear();
    this.voucherService.welcomeVoucherRecipients.clear();

    // Clear stakes
    this.stakingService.stakes.clear();

    // Clear withdrawals
    this.withdrawalService.pendingWithdrawals.clear();

    // Clear streaks
    this.streakService.streaks.clear();

    // Clear referrals (handled by account reset)
  }
}

module.exports = ReinitService;