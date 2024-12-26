const { formatDateTime } = require('../utils/dateFormatter');

class SubscriberService {
  constructor() {
    this.subscribers = new Map();
    this.PAGE_SIZE = 10;
  }

  addSubscriber(userId, name, subscriptionDate = new Date()) {
    this.subscribers.set(userId, {
      userId,
      name,
      status: 'active',
      subscriptionDate,
      restrictions: new Set()
    });
  }

  getSubscribersByPage(page) {
    const sortedSubscribers = Array.from(this.subscribers.values())
      .sort((a, b) => b.subscriptionDate - a.subscriptionDate);
    
    const start = (page - 1) * this.PAGE_SIZE;
    return {
      subscribers: sortedSubscribers.slice(start, start + this.PAGE_SIZE),
      totalPages: Math.ceil(sortedSubscribers.length / this.PAGE_SIZE),
      currentPage: page
    };
  }

  getSubscriberByUsername(username) {
    return Array.from(this.subscribers.values())
      .find(s => s.name.toLowerCase() === username.toLowerCase());
  }

  banSubscriber(userId) {
    const subscriber = this.subscribers.get(userId);
    if (subscriber) {
      subscriber.status = 'banned';
      return true;
    }
    return false;
  }

  addRestriction(userId, restriction) {
    const subscriber = this.subscribers.get(userId);
    if (subscriber) {
      subscriber.restrictions.add(restriction);
      return true;
    }
    return false;
  }

  removeRestriction(userId, restriction) {
    const subscriber = this.subscribers.get(userId);
    if (subscriber) {
      subscriber.restrictions.delete(restriction);
      return true;
    }
    return false;
  }
}

module.exports = SubscriberService;