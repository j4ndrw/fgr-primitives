import type {
    Runtime as IRuntime,
    BatchId,
    Effect,
    EffectId,
    SignalId,
} from "./types";

import { Signal } from "./signal";

export class Runtime implements IRuntime {
    signalValues: any[];

    effects: Effect[];
    effectIdStack: (EffectId | null)[];

    batches: Effect[];

    subscriptionMap: Map<
        SignalId,
        { delayedEffect: Effect | null; effects: Set<EffectId> }
    >;

    constructor() {
        this.signalValues = [];

        this.effects = [];
        this.effectIdStack = [];

        this.batches = [];

        this.subscriptionMap = new Map();
    }

    signal<T>(value: T): Signal<T> {
        this.signalValues.push(value);

        return new Signal({
            runtime: this,
            id: this.signalValues.length - 1,
        });
    }

    effect(effectFn: () => void) {
        this.effects.push(effectFn);
        this.runEffect(this.effects.length - 1);
    }

    runEffect(effectId: EffectId) {
        this.effectIdStack.push(effectId);

        const effect = this.effects[effectId];
        effect?.();

        this.effectIdStack.pop();
    }

    batch(cb: () => void) {
        this.batches.push(cb);
        this.runBatch(this.batches.length - 1);
    }

    runBatch(batchId: BatchId) {
        const batchToRun = this.batches[batchId];

        batchToRun?.();

        for (const subscriber of this.subscriptionMap.values()) {
            subscriber.delayedEffect?.();
            subscriber.delayedEffect = null;
            break;
        }

        this.batches.splice(batchId);
    }

    unmount(cleanupFn: () => void) {
        this.signalValues = [];
        this.effects = [];
        this.subscriptionMap.clear();
        this.effectIdStack = [];
        this.batches = [];

        return cleanupFn();
    }
}
