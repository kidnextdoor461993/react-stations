"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station = void 0;
/**
 * Parent station
 */
class Station {
    _listeners = new Map();
    _eventListeners = Object();
    state = Object();
    /**
     * Subcribe station by listener(s)
     * @param args
     */
    subscribe(args) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;
        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (this._listeners.has(convertedListeners[i])) {
                    continue;
                }
                this._listeners.set(convertedListeners[i], convertedListeners[i]);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * Unsubcribe station on specific listenter(s)
     * @param args
     */
    unsubscribe(args) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;
        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (!this._listeners.has(convertedListeners[i])) {
                    continue;
                }
                this._listeners.delete(convertedListeners[i]);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     *
     * @param args
     */
    subscribeOnEvent(args) {
        const { eventName, listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;
        try {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = new Map();
                for (let i = 0; i < convertedListeners.length; i++) {
                    this._eventListeners[eventName]?.set(convertedListeners[i], undefined);
                }
            }
            else {
                for (let i = 0; i < convertedListeners.length; i++) {
                    if (!this._eventListeners[eventName]?.has(convertedListeners[i])) {
                        this._eventListeners[eventName]?.set(convertedListeners[i], undefined);
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * Subcribe on customize event
     * @param args
     */
    unsubscribeOnEvent(args) {
        const { eventName, listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;
        try {
            if (!this._eventListeners[eventName]) {
                return;
            }
            for (let i = 0; i < convertedListeners.length; i++) {
                if (!this._eventListeners[eventName]?.has(convertedListeners[i])) {
                    continue;
                }
                this._eventListeners[eventName]?.delete(convertedListeners[i]);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * Update state and emit new state changes to listening React component(s)
     * @param args
     */
    setState(args) {
        Object.assign(this.state, args);
        try {
            if (this._listeners.size < 1) {
                return;
            }
            const entries = this._listeners.entries();
            const keys = [];
            for (const [key] of entries) {
                keys.push(key);
            }
            Promise.allSettled(keys.map(key => key(this.$state)));
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     *
     * @param args
     * @returns
     */
    dispatch(args) {
        try {
            const { eventName, data } = args;
            const listeners = this._eventListeners[eventName];
            if (!listeners) {
                return;
            }
            const entries = listeners.entries();
            const keys = [];
            for (const [key] of entries) {
                keys.push(key);
            }
            Promise.allSettled(keys.map(key => key(data)));
        }
        catch (error) {
            console.error(error);
        }
    }
    /**
     * State GETTER
     */
    get $state() {
        return { ...this.state };
    }
}
exports.Station = Station;
