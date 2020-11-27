/**
 * Event bus
 */
export default class EventBus {
    /**
     * event bus constructor
     */
    constructor() {
        this.listeners = {};
    }

    /**
     * subscribe on event
     * @param {string} event
     * @param {function} callback
     */
    on(event, callback) {
        if (!this.listeners.hasOwnProperty(event)) {
            this.listeners[event] = [];
        }
        const callbackExists = this.listeners[event].some((element) => {
            return element === callback;
        });
        if (!callbackExists) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * unsubscribe off event
     * @param {string} event
     * @param {function} callback
     */
    off(event, callback) {
        this.listeners[event] = this.listeners[event].filter(function(listener) {
            return listener !== callback;
        });
    }

    /**
     * Unsubscribe from all events
     */
    offAll() {
        this.listeners = {};
    }

    /**
     * emit the event
     * @param {string} event
     * @param {*} data
     */
    emit(event, data) {
        if (!this.listeners.hasOwnProperty(event)) {
            return;
        }
        this.listeners[event].forEach(function(listener) {
            listener(data);
        });
    }
}
