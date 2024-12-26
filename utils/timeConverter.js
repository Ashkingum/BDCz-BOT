const { TIME_CONSTANTS } = require('./timeConstants');

class TimeConverter {
  static millisecondsToSeconds(ms) {
    return Math.floor(ms / TIME_CONSTANTS.MILLISECONDS_PER_SECOND);
  }

  static secondsToMinutes(seconds) {
    return Math.floor(seconds / TIME_CONSTANTS.SECONDS_PER_MINUTE);
  }

  static minutesToHours(minutes) {
    return Math.floor(minutes / TIME_CONSTANTS.MINUTES_PER_HOUR);
  }

  static hoursToDays(hours) {
    return Math.floor(hours / TIME_CONSTANTS.HOURS_PER_DAY);
  }

  static daysToMonths(days) {
    return Math.floor(days / TIME_CONSTANTS.DAYS_PER_MONTH);
  }

  static daysToYears(days) {
    return Math.floor(days / TIME_CONSTANTS.DAYS_PER_YEAR);
  }
}

module.exports = TimeConverter;