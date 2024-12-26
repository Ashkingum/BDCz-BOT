/**
 * Service to keep the bot active by periodic self-pinging
 */
class PingService {
  constructor(bot) {
    this.bot = bot;
    this.interval = null;
  }

  start() {
    // Ping every 10 minutes
    this.interval = setInterval(() => {
      this.ping();
    }, 10 * 60 * 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async ping() {
    try {
      await this.bot.getMe();
    } catch (error) {
      console.error('Ping failed:', error.message);
    }
  }
}

module.exports = PingService;