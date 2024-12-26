const Referral = require('../models/Referral');

class ReferralService {
  constructor(accountService) {
    this.accountService = accountService;
  }

  async processReferral(referrerId, newUserId, isPremium) {
    const referrerAccount = this.accountService.getAccount(referrerId);
    
    if (!referrerAccount) {
      throw new Error('Referrer account not found');
    }

    if (referrerAccount.referrals.length >= 10) {
      throw new Error('Referral limit reached');
    }

    const referral = new Referral(referrerId, newUserId, isPremium);
    referrerAccount.referrals.push(referral);
    referrerAccount.addValue(referral.reward);

    await this.accountService.updateStatus(referrerId, referral.reward);
    return referral;
  }
}

module.exports = ReferralService;