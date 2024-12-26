class InactivityService {
  constructor(accountService) {
    this.accountService = accountService;
    this.checkInterval = null;
  }

  startInactivityChecks() {
    this.checkInterval = setInterval(() => {
      this.processInactivity();
    }, 60 * 60 * 1000); // Check every hour
  }

  stopInactivityChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  processInactivity() {
    const now = new Date();
    
    for (const [userId, account] of this.accountService.accounts) {
      const hoursSinceUpdate = (now - account.lastUpdate) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate > 48) {
        // Deduct 0.5% per hour after 48 hours
        const deduction = account.balance * 0.005;
        account.balance -= deduction;
      }
    }
  }
}

module.exports = InactivityService;