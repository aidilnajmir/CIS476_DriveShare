// Subject.js
const AbstractSubject = require('./AbstractSubject');

class Subject extends AbstractSubject {
    constructor() {
        super();
        this.observers = [];
    }

    // Implementing abstract methods from AbstractSubject
    // method to add observers
    addObserver(observer) {
        this.observers.push(observer);
    }

    // method to remove observers
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // method to notify observers with the messages
    notifyObservers(recipient, message) {
        this.observers.forEach(observer => {
            observer.update(recipient, message);
        });
    }
}

module.exports = Subject;
