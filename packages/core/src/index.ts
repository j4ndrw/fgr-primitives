import { Runtime } from "./runtime";
import { Signal } from "./signal";
import { Primitives } from "./types";

/**
 * A function that provides Fine-Grained Reactivity primitives
 * inside the callback function it takes as an argument.
 */
export const encapsulate = <T>(
    cb: (primitives: Primitives, runtime: Runtime) => T,
): T => {
    const runtime = new Runtime();
    const primitives: Primitives = {
        signal: <TValue>(value: TValue): Signal<TValue> =>
            runtime.signal(value),
        effect: (effectFn: () => void): void => runtime.effect(effectFn),
        batch: (cb: () => void) => runtime.batch(cb),
        unmount: cleanupFn => runtime.unmount(cleanupFn),
    };

    return cb(primitives, runtime);
};

export default encapsulate;