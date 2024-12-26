const { TimeConverter } = require('../../utils/timeUtils');

class VoucherControlService {
  constructor() {
    this.vouchersStopped = false;
    this.stopDuration = null;
    this.stopTimer = null;
  }

  isVouchersStopped() {
    return this.vouchersStopped;
  }

  async stopVouchers(duration) {
    this.vouchersStopped = true;
    this.stopDuration = duration;

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
    }

    // If duration is not infinite, set up auto-resume
    if (duration !== 'infinite') {
      const durationMs = this.parseDuration(duration);
      this.stopTimer = setTimeout(() => {
        this.resumeVouchers();
      }, durationMs);
    }

    return true;
  }

  async resumeVouchers() {
    this.vouchersStopped = false;
    this.stopDuration = null;
    
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    return true;
  }

  private parseDuration(duration) {
    const units = {
      'm': 60 * 1000,
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000,
      'M': 30 * 24 * 60 * 60 * 1000,
      'y': 365 * 24 * 60 * 60 * 1000
    };

    const value = parseInt(duration);
    const unit = duration.slice(-1);

    return value * (units[unit] || 0);
  }
}

module.exports = VoucherControlService;