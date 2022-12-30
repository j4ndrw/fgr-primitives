import { encapsulate } from "../src";

describe("General behaviour for primitives", () => {
    // Might look like a redundant test, but I've noticed
    // behaviours of a class object being undefined if you
    // try to access a member when the function goes out of scope
    it("should have a defined runtime", () => {
        const runtime = encapsulate(({}, runtime) => runtime);
        expect(runtime).toBeDefined();
    });

    it("should create a mutable signal", () => {
        const mutatedSignalValue = encapsulate(({ signal }) => {
            const value = signal(0);
            value.set(1);

            return value.get();
        });

        expect(mutatedSignalValue).toBe(1);
    });

    it("should run an effect immediately after creation", () => {
        const flag: "ran" | "not ran" = encapsulate(({ effect }) => {
            let flag: "ran" | "not ran" = "not ran";

            effect(() => {
                flag = "ran";
            });

            return flag;
        });

        expect(flag).toBe("ran");
    });

    it("should create a derived signal", () => {
        const signedNumber = encapsulate(({ signal }) => {
            const num = signal(155);
            const sign = signal(1);
            const signedNumber = () => num.get() * sign.get();

            sign.set(-1);
            sign.set(1);
            sign.set(-1);
            sign.set(1);
            sign.set(-1);

            return signedNumber();
        });

        expect(signedNumber).toBe(-155);
    });

    it("should run the effect N times if N signals are set and not batched together", () => {
        const effectCycleCount = encapsulate(({ signal, effect }) => {
            let effectCycleCount = 0;

            const signal1 = signal(0);
            const signal2 = signal(0);

            effect(() => {
                effectCycleCount += 1;
                signal1.get();
                signal2.get();
            });

            for (let i = 0; i < 5; i++) {
                signal1.set(i + 1);
                signal2.set(i + 1);
            }

            return effectCycleCount;
        });

        const totalCount = 10;
        const onMountCount = 1;

        expect(effectCycleCount).toBe(totalCount + onMountCount);
    });

    it("should run the effect N times if N signals are set and batched together", () => {
        const effectCycleCount = encapsulate(({ signal, effect, batch }) => {
            let effectCycleCount = 0;

            const signal1 = signal(0);
            const signal2 = signal(0);

            effect(() => {
                effectCycleCount += 1;
                signal1.get();
                signal2.get();
            });

            for (let i = 0; i < 5; i++) {
                batch(() => {
                    signal1.set(i + 1);
                    signal2.set(i + 1);
                });
            }

            return effectCycleCount;
        });

        const totalCount = 5;
        const onMountCount = 1;

        expect(effectCycleCount).toBe(totalCount + onMountCount);
    });

    it("should reset all primitive values on runtime unmount", () => {
        const runtime = encapsulate(({ signal, effect, unmount }, runtime) => {
            const signal1 = signal(0);

            effect(() => {
                signal1.get();
            });

            unmount(() => {});

            return runtime;
        });

        expect(runtime.signalValues).toStrictEqual([]);
        expect(runtime.effects).toStrictEqual([]);
        expect(runtime.batches).toStrictEqual([]);
        expect(runtime.effectIdStack).toStrictEqual([]);
        expect(runtime.subscriptionMap).toStrictEqual(new Map());
    });
});
