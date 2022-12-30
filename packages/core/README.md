# Fine-Grained Reactivity primitives

**Inspired by [SolidJS](https://github.com/solidjs/solid) and [Leptos](https://github.com/gbj/leptos).**

# Important

Please, don't use this library in production. For the moment, it is purely experimental and might not scale.

# Objective

The goal of this library is to inject fine grained reactivity to any non-reactive system, as well as existing reactive systems (i.e. React, Vue, etc...). It is a bit ambitious and it's not there yet when it comes to making the primitives work in existing reactive systems, but it would be super cool to learn about what obstacles need to be overcome to achieve this goal.

After looking through Solid and Leptos, I formed an opinion that fine-grained reactivity is the most elegant and efficient paradigm / concept when it comes to building UIs, games or any other state machine!

# Usage

The library provides only 1 function: `encapsulate`. You can think of this function as a glorified [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) (Immediately-Invoked Function Expression).

## Simple counter example

Here's an example of a counter using the `encapsulate` function:

```typescript
import { encapsulate } from "@j4ndrw/fgr-core";

encapsulate(({ signal, effect }) => {
    const count = signal(0);

    effect(() => {
        console.log(`Count is ${count.get()}`);
    });

    for (let i = 1; i <= 5; i++) {
        count.set(i);
    }
});
```

This will just iterate 5 times and increment the count signal by 1. In the console, you should see a bunch of "Count is {count}", thanks to the effect.

## Batch counter example

Here's the same counter example as before, but with 2 count signals, instead of one.

```typescript
import { encapsulate } from "@j4ndrw/fgr-core";

encapsulate(({ signal, effect, batch }) => {
    const count1 = signal(0);
    const count2 = signal(0);

    effect(() => {
        console.log(`Count1 is ${count1.get()}`);
        console.log(`Count2 is ${count2.get()}`);
    });

    for (let i = 1; i <= 5; i++) {
        batch(() => {
            count1.set(i);
            count2.set(i * 2);
        });
    }
});
```

Here we're using the `batch` primitive to tell the runtime to postpone running the effect until the callback function inside the batch finishes running.

As such, the effect will run 5 times, instead of 10 times without the batch.