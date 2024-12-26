const { TIME_SYMBOLS } = require('./timeConstants');

class TimeFormatter {
  static formatDuration(value, unit) {
    return `${value}${TIME_SYMBOLS[unit]}`;
  }

  static formatFullDuration(milliseconds) {
    // Implementation for formatting full duration with all units
    // Example: "1Y 2M 3D 4h 5m 6s"
    // This would be implemented based on specific formatting needs
  }
}

module.exports = TimeFormatter;