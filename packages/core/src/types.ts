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
    signal: Runtime["signal"];
    effect: Runtime["effect"];
    batch: Runtime["batch"];
    unmount: Runtime["unmount"];
};

export type SignalId = number;
export type EffectId = number;
export type BatchId = number;

export type Effect = () => void;
