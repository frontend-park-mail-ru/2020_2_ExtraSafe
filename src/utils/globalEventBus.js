import EventBus from './eventBus.js';

/**
 * GlobalEventBus class
 */
class GlobalEventBus extends EventBus {
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
}

export default new GlobalEventBus();
