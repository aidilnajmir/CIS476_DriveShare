// AbstractSubject.js
class AbstractSubject {
    constructor() {
        if (this.constructor === AbstractSubject) {
            throw new TypeError('Abstract class "AbstractSubject" cannot be instantiated directly.');
        }
    }

    // Abstract methods to be implemented by subclasses
    addObserver(observer) {
        throw new Error('Method addObserver must be implemented');
    }

    removeObserver(observer) {
        throw new Error('Method removeObserver must be implemented');
    }

    notifyObservers(recipient, message) {
        throw new Error('Method notifyObservers must be implemented');
    }
}

module.exports = AbstractSubject;