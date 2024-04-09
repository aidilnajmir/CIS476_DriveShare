// NotificationObserver.js
const Observer = require('./Observer');
const Notification = require('../../models/Notification');

// NotificationObserver class
class NotificationObserver extends Observer {
  // Constructor to set the subject and add itself as an observer
  constructor(subject) {
      super();
      this.subject = subject;
      this.subject.addObserver(this);
  }

  // Update method to send notifications
  async update(recipient, message) {
      try {
          await Notification.create({ recipient, message });
          console.log(`Notification sent to ${recipient}: ${message}`);
      } catch (error) {
          console.error('Error sending notification:', error);
      }
  }
}

module.exports = NotificationObserver;
