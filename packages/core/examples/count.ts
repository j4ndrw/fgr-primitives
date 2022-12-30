import { encapsulate } from "../src";

encapsulate(({ createSignal, createEffect, batch }) => {
    const count = createSignal(0);
    const count2 = createSignal(0);

    createEffect(() => {
        count.get();
    });

    createEffect(() => {
        console.debug({ count: count.get(), count2: count2.get() });
    });

    setInterval(() => {
        batch(() => {
            count.update(prev => prev + 1);
            count2.update(prev => prev + 3);
        });
    }, 1000);

    setInterval(() => {
        batch(() => {
            count.update(prev => prev * 2);
            count2.update(prev => prev * 4);
        });
    }, 5000);

    setInterval(() => {
        batch(() => console.log("batch ran!"));
    }, 100);
});
