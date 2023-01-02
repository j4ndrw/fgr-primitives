# Fine-Grained Reactivity primitives

**Inspired by [SolidJS](https://github.com/solidjs/solid) and [Leptos](https://github.com/gbj/leptos).**

# Important

Please, don't use this library in production. For the moment, it is purely experimental and might not scale.

# Objective

The goal of this library is to inject fine grained reactivity to any non-reactive system, as well as existing reactive systems (i.e. React, Vue, etc...). It is a bit ambitious and it's not there yet when it comes to making the primitives work in existing reactive systems, but it would be super cool to learn about what obstacles need to be overcome to achieve this goal.

After looking through Solid and Leptos, I formed an opinion that fine-grained reactivity is the most elegant and efficient paradigm / concept when it comes to building UIs, games or any other state machine!

# Overview

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

Here we're using the `batch` primitive to postpone running the effect until the callback function inside the batch finishes running.

As such, the effect will run 5 times, instead of 10 times without the batch.

# Docs

## Encapsulate

### Definition

A function that provides Fine-Grained Reactivity primitives inside the callback function it takes as an argument.

### Example

```ts
import { encapsulate } from "@j4ndrw/fgr-core";

encapsulate(({ signal, effect, batch, unmount }, runtime) => {
    // Your business logic goes here
});
```

## Signal

### Definition

A primitive that holds a mutable value.

### Example

```ts
const count = signal(0);
count.get(); // is 0

count.set(1);
count.get(); // is 1

count.update(prev => prev + 3);
count.get(); //is 4
```

## Effect

### Definition

A primitive that runs a given callback function on mount
and whenever a dependency gets updated.

### Example - Effect running once

```ts
effect(() => console.log("hello"));
```

### Example - Effect running when dependency is updated

```ts
const dependency = signal(0);

// Outputs `hello ${dependency}` 6 times:
//     - 1 time on mount
//     - 5 times since the dependency is set 5 times
//       in the for loop below
effect(() => {
    console.log(`hello ${dependency.get()}`);
});

for (let i = 1; i <= 5; i++) dependency.set(i);
```

## Batch

### Definition

A primitive that postpones running any
effects for a set of dependencies until they
have finished running a particular routine.

### Example - Without `batch`

```ts
const s1 = signal(0);
const s2 = signal(0);

// Runs 11 times:
//     - once, on mount
//     - 10 times, since `s1` is set 5 times and `s2`
//       is set 5 other times
effect(() => {
    s1.get();
    s2.get();
});

for (let i = 1; i <= 5; i++) {
    s1.set(i);
    s2.set(i);
}
```

### Example - With `batch`

```ts
const s1 = signal(0);
const s2 = signal(0);

// Runs 6 times:
//     - once, on mount
//     - 5 times, from the batched update
effect(() => {
    s1.get();
    s2.get();
});

for (let i = 1; i <= 5; i++) {
    batch(() => {
        s1.set(i);
        s2.set(i);
    });
}
```

## Unmount

### Definition

A primitive that runs a cleanup function and re-initializes all primitive values from the Fine-Grained Reactivity Runtime (signals, effects, etc...).

### Example

```ts
unmount(() => {
    // Cleanup logic goes here
});
```
