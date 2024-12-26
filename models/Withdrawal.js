class Withdrawal {
  constructor(amount, userId) {
    this.amount = amount;
    this.userId = userId;
    this.requestDate = new Date();
    this.status = 'pending';
    this.stakeAmount = amount * 0.1; // 10% stake
    this.netAmount = amount - this.stakeAmount;
  }

  isExpired() {
    const now = new Date();
    return (now - this.requestDate) >= 24 * 60 * 60 * 1000;
  }
}

module.exports = Withdrawal;