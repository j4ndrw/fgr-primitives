import { Runtime } from "./runtime";
import { Signal } from "./signal";
import type { Runtime as IRuntime } from "./types";

export const encapsulate = <T>(
    cb: (
        primitives: {
            createSignal: IRuntime["createSignal"];
            createEffect: IRuntime["createEffect"];
            batch: IRuntime["batch"];
            unmount: IRuntime["unmount"];
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