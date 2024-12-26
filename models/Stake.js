class Stake {
  constructor(amount) {
    this.amount = amount;
    this.startDate = new Date();
    this.accumulatedBonus = 0;
  }

  getDaysStaked() {
    const now = new Date();
    const diffTime = Math.abs(now - this.startDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  isMatured() {
    return this.getDaysStaked() >= 30;
  }
}

module.exports = Stake;