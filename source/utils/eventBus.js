/**
 * Event bus
 */
class EventBus {
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
        this.listeners[event].push(callback);
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

export default new EventBus();
