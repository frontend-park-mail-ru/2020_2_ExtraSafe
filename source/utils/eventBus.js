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
     * @param {string} object
     */
    on(event, callback, object) {
        if (!this.listeners.hasOwnProperty(event)) {
            this.listeners[event] = {};
        }
        if (!this.listeners[event].hasOwnProperty(object)) {
            this.listeners[event][object] = [];
        }
        this.listeners[event][object].push(callback);
    }

    /**
     * unsubscribe off event
     * @param {string} event
     * @param {function} callback
     * @param {string} object
     */
    off(event, callback, object) {
        if (!this.listeners.hasOwnProperty(event) || !this.listeners[event].hasOwnProperty(object)) {
            return;
        }
        this.listeners[event][object] = this.listeners[event][object].filter(function(listener) {
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
        // eslint-disable-next-line no-unused-vars
        for (const [objects, listeners] of Object.entries(this.listeners[event])) {
            listeners.forEach((listener) => {
                listener(data);
            });
        }
    }

    /**
     * unsubscribe an object from event
     * @param {string} object
     */
    offObject(object) {
        // eslint-disable-next-line no-unused-vars
        for (const [events, objects] of Object.entries(this.listeners)) {
            if (objects.hasOwnProperty(object)) {
                delete objects[object];
            }
        }
    }
}

export default new EventBus();
