import { Runtime, SignalId, Signal as ISignal } from "./types";

export class Signal<T> implements ISignal<T> {
    runtime: Runtime;
    id: SignalId;

    constructor({ runtime, id }: { runtime: Runtime; id: SignalId }) {
        this.runtime = runtime;
        this.id = id;
    }

    get(): T {
        const value = this.runtime.signalValues[this.id.value] as T;

        const mostRecentEffectId =
            this.runtime.effectIdStack[this.runtime.effectIdStack.length - 1] ??
            null;
        if (mostRecentEffectId === null) return value;

        if (!this.runtime.subscriptionMap.has(this.id)) {
            this.runtime.subscriptionMap.set(this.id, {
                delayedEffect: null,
                effects: new Set(),
            });
        }

        this.runtime.subscriptionMap
            .get(this.id)
            ?.effects.add(mostRecentEffectId);

        return value;
    }
    set(value: T) {
        this.runtime.signalValues[this.id.value] = value;

        const subscriber = this.runtime.subscriptionMap.get(this.id);

        if (!subscriber) return;

        const { effects } = subscriber;

        const lazyEffectRunner = () => {
            if (effects) {
                effects.forEach(effectId => {
                    this.runtime.runEffect(effectId);
                });
            }
        };

        if (this.runtime.batches.length === 0) return lazyEffectRunner();

        subscriber.delayedEffect = lazyEffectRunner;
    }
    update(cb: (value: T) => T) {
        this.set(cb(this.get()));
    }
}
