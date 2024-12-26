const { TIME_CONSTANTS, TIME_SYMBOLS } = require('./timeConstants');

class TimeConverter {
  static toMilliseconds(duration) {
    const value = parseInt(duration);
    const unit = duration.slice(-1);
    
    switch (unit) {
      case 'm': return value * 60 * 1000;           // minutes
      case 'h': return value * 60 * 60 * 1000;      // hours
      case 'd': return value * 24 * 60 * 60 * 1000; // days
      case 'M': return value * 30 * 24 * 60 * 60 * 1000; // months
      case 'y': return value * 360 * 24 * 60 * 60 * 1000; // years
      default: return value * 1000; // seconds by default
    }
  }

  static fromMilliseconds(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  }

  static getRemainingTime(endTime) {
    const remaining = endTime - Date.now();
    return this.fromMilliseconds(Math.max(0, remaining));
  }
}

class TimeFormatter {
  static formatDuration(value, unit) {
    return `${value}${TIME_SYMBOLS[unit]}`;
  }

  static formatCountdown(endTime) {
    return TimeConverter.getRemainingTime(endTime);
  }

  static formatFullDuration(ms) {
    const parts = [];
    let remaining = ms;

    const conversions = {
      y: 360 * 24 * 60 * 60 * 1000,
      M: 30 * 24 * 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      h: 60 * 60 * 1000,
      m: 60 * 1000,
      s: 1000
    };

    for (const [unit, value] of Object.entries(conversions)) {
      if (remaining >= value) {
        const count = Math.floor(remaining / value);
        parts.push(`${count}${unit}`);
        remaining %= value;
      }
    }

    return parts.join(' ');
  }
}

module.exports = {
  TimeConverter,
  TimeFormatter,
  TIME_CONSTANTS,
  TIME_SYMBOLS
};