class Referral {
  constructor(referrerId, newUserId, isPremium = false) {
    this.referrerId = referrerId;
    this.newUserId = newUserId;
    this.isPremium = isPremium;
    this.date = new Date();
    this.reward = isPremium ? 1.0 : 0.1;
  }
}

module.exports = Referral;