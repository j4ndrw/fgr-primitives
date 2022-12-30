import { encapsulate } from "../src";

encapsulate(({ signal, effect, batch }) => {
    const count = signal(0);
    const count2 = signal(0);

    effect(() => {
        count.get();
    });

    effect(() => {
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
