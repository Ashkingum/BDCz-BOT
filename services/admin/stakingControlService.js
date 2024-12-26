const { TimeConverter } = require('../../utils/timeUtils');

class StakingControlService {
  constructor() {
    this.stakingStopped = false;
    this.stopDuration = null;
    this.stopTimer = null;
  }

  isStakingStopped() {
    return this.stakingStopped;
  }

  async stopStaking(duration) {
    this.stakingStopped = true;
    this.stopDuration = duration;

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
    }

    // If duration is not infinite, set up auto-resume
    if (duration !== 'infinite') {
      const durationMs = this.parseDuration(duration);
      this.stopTimer = setTimeout(() => {
        this.resumeStaking();
      }, durationMs);
    }

    return true;
  }

  async resumeStaking() {
    this.stakingStopped = false;
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

module.exports = StakingControlService;