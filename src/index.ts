export type TListener<T> = (arsg: T) => any;


/**
 * Parent station
 */
export class Station<TState extends {}> {

    private readonly _listeners = new Map<
        TListener<TState>,
        TListener<TState>
    >();

    protected state: TState = Object();

    /**
     * Subcribe station by listener(s) 
     * @param args
     */
    public subscribe(
        args: Required<{
            listeners: TListener<TState> | Array<
                TListener<TState>
            >;
        }>
    ) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;

        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (this._listeners.has(convertedListeners[i])) {
                    continue;
                }

                this._listeners.set(convertedListeners[i], convertedListeners[i]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Unsubcribe station on specific listenter(s)
     * @param args
     */
    public unsubscribe(
        args: Required<{
            listeners: TListener<TState> | Array<
                TListener<TState>
            >;
        }>
    ) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners) ? [listeners] : listeners;

        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (!this._listeners.has(convertedListeners[i])) {
                    continue;
                }

                this._listeners.delete(convertedListeners[i]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Update state and emit new state changes to listening React component(s)
     * @param args
     */
    protected setState(
        args: TState
    ) {
        Object.assign(this.state, args);

        try {
            if (this._listeners.size < 1) {
                return;
            }

            const entries = this._listeners.entries();
            const keys: TListener<TState>[] = [];

            for (const [key] of entries) {
                keys.push(key);
            }

            Promise.allSettled(keys.map(key => key(this.$state)));
        } catch (error) {
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
