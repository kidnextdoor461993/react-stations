export type TListener<T> = (arsg: T) => any;
/**
 * Parent station
 */
export declare class Station<TState extends {}> {
    private readonly _listeners;
    protected state: TState;
    /**
     * Subcribe station by listener(s)
     * @param args
     */
    subscribe(args: Required<{
        listeners: TListener<TState> | Array<TListener<TState>>;
    }>): void;
    /**
     * Unsubcribe station on specific listenter(s)
     * @param args
     */
    unsubscribe(args: Required<{
        listeners: TListener<TState> | Array<TListener<TState>>;
    }>): void;
    /**
     * Update state and emit new state changes to listening React component(s)
     * @param args
     */
    protected setState(args: TState): void;
    /**
     * State GETTER
     */
    get $state(): TState;
}
