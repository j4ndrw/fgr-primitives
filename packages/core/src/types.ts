/**
 * # Definition
 * A primitive that holds a mutable value.
 */
export interface Signal<T> {
    get: () => T;
    set: (value: T) => void;
    update: (cb: (value: T) => T) => void;
}

export interface Runtime {
    signalValues: any[];

    effects: Effect[];
    effectIdStack: (EffectId | null)[];

    batches: Effect[];

    subscriptionMap: Map<
        SignalId,
        {
            delayedEffect: Effect | null;
            effects: Set<EffectId>;
        }
    >;

    signal: <T>(value: T) => Signal<T>;

    effect: (effectFn: () => void) => void;
    runEffect: (effectId: EffectId) => void;

    batch: (cb: () => void) => void;
    runBatch: (batchId: BatchId) => void;

    unmount: (cleanupFn: () => void) => void;
}

export type Primitives = {
    /**
     * # Definition
     * A primitive that holds a mutable value.
     *
     * # Example
     * ```ts
     * const count = signal(0);
     * count.get(); // is 0
     *
     * count.set(1);
     * count.get(); // is 1
     *
     * count.update(prev => prev + 3);
     * count.get(); //is 4
     * ```
     */
    signal: Runtime["signal"];

    /**
     * # Definition
     * A primitive that runs a given callback function on mount
     * and whenever a dependency gets updated.
     *
     * # Example
     * ## Effect running once
     * ```
     * effect(() => console.log("hello"))
     * ```
     *
     * ## Effect running when dependency is updated
     * ```
     * const dependency = signal(0);
     *
     * // Outputs `hello ${dependency}` 6 times:
     * //     - 1 time on mount
     * //     - 5 times since the dependency is set 5 times
     * //       in the for loop below
     * effect(() => {
     *   console.log(`hello ${dependency.get()}`);
     * })
     *
     * for (let i = 1; i <= 5; i++) dependency.set(i);
     * ```
     */
    effect: Runtime["effect"];

    /**
     * # Definition
     * A primitive that postpones running any
     * effects for a set of dependencies until they
     * have finished running a particular routine.
     *
     * # Example
     * ## Without `batch`
     * ```
     * const s1 = signal(0);
     * const s2 = signal(0);
     *
     * // Runs 11 times:
     * //     - once, on mount
     * //     - 10 times, since `s1` is set 5 times and `s2`
     * //       is set 5 other times
     * effect(() => {
     *   s1.get();
     *   s2.get();
     * });
     *
     * for (let i = 1; i <= 5; i++) {
     *   s1.set(i);
     *   s2.set(i);
     * }
     * ```
     *
     * ## With `batch`
     * ```
     * const s1 = signal(0);
     * const s2 = signal(0);
     *
     * // Runs 6 times:
     * //     - once, on mount
     * //     - 5 times, from the batched update
     * effect(() => {
     *   s1.get();
     *   s2.get();
     * });
     *
     * for (let i = 1; i <= 5; i++) {
     *   batch(() => {
     *     s1.set(i);
     *     s2.set(i);
     *   });
     * }
     * ```
     */
    batch: Runtime["batch"];

    /**
     * # Definition
     * A primitive that runs a cleanup function and re-initializes all primitive values
     * from the Fine-Grained Reactivity Runtime (signals, effects, etc...).
     *
     * # Example
     * ```
     * unmount(() => {
     *   // Cleanup logic goes here...
     * });
     * ```
     */
    unmount: Runtime["unmount"];
};

export type SignalId = number;
export type EffectId = number;
export type BatchId = number;

/**
 * # Definition
 * A primitive that runs a given callback function on mount
 * and whenever a dependency gets updated.
 */
export type Effect = () => void;
