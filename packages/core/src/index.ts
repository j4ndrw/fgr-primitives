import { Runtime } from "./runtime";
import { Signal } from "./signal";

export const encapsulate = <T>(
    cb: (
        primitives: {
            createSignal: Runtime["createSignal"];
            createEffect: Runtime["createEffect"];
            batch: Runtime["batch"];
            unmount: Runtime["unmount"];
        },
        runtime: Runtime,
    ) => T,
): T => {
    const runtime = new Runtime();
    const createSignal: Runtime["createSignal"] = <TValue>(value: TValue): Signal<TValue> =>
        runtime.createSignal(value);
    const createEffect: Runtime["createEffect"] = (
        effectFn: () => void,
    ): void => runtime.createEffect(effectFn);
    const batch: Runtime["batch"] = (cb: () => void) => runtime.batch(cb);
    const unmount: Runtime["unmount"] = cleanupFn => runtime.unmount(cleanupFn);

    return cb({ createSignal, createEffect, batch, unmount }, runtime);
};