import { Runtime } from "./runtime";
import { Signal } from "./signal";

export const encapsulate = <T>(
    cb: (
        primitives: {
            signal: Runtime["signal"];
            effect: Runtime["effect"];
            batch: Runtime["batch"];
            unmount: Runtime["unmount"];
        },
        runtime: Runtime,
    ) => T,
): T => {
    const runtime = new Runtime();
    const signal: Runtime["signal"] = <TValue>(value: TValue): Signal<TValue> =>
        runtime.signal(value);
    const effect: Runtime["effect"] = (
        effectFn: () => void,
    ): void => runtime.effect(effectFn);
    const batch: Runtime["batch"] = (cb: () => void) => runtime.batch(cb);
    const unmount: Runtime["unmount"] = cleanupFn => runtime.unmount(cleanupFn);

    return cb({ signal, effect, batch, unmount }, runtime);
};