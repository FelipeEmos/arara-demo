Arara 🐦️

> _A large, brightly colored parrot from Central and South America_

# Arara

The highly reactive Animation Library for SolidJS

- Signal Based Animations
- Compose signals to create new exciting animations and emergent behaviors
- Use it to power any Javascript code...
  - DOM maniplations / renders
  - Three JS scenes
- Under the hood it
  - Uses the best animation API for performance in this use case: RAF (_request animation frame_)
  - Uses `gl-matrix` for vector math

## Arara Demo

This repo is a first draft / demonstration of the Arara Lib and I really would like your feedback!

### About _SolidHack_

This project is a submission for the Solid Hack Animation Library Challenge from 2024.

https://hack.solidjs.com/categories-challenges

To please the regulation, let's make it clear:

> Author: Felipe Emos

## 💻️ How to Run

Install bun

```bash
# install deps
bun install

# run dev server
bun dev
```

## 🏗️ Project Structure

This is a SolidStart project for convenience of the Hackathon. A better project structre, with proper package publishing and documentation, is needed in the future.

Here you will find

- The proper **library** code inside the `src/lib` folder!
- Some routes with demos.

## 🧠 Why does this lib exist ?

SolidJS has an incredibly simple, powerful and performant state management model that is perfect for certain kinds of animation, specially those that react to user interactions very often.

These fluid and impredictable animations can't always be bound by a script with clear _START, MIDDLE, END_ states. They are better described with certain rules being applied when certain conditions are met.

That looks a lot like a good and old "derived signal"

> Given certain conditions, that's what I'd like to see!
>
> If confitions change, I see something **different**.

**Arara** is a way of animating that keeps you thinking with this declarative mindset.

You can use it's primitives as they are or customize args.

```tsx
const [point] = createSineWave({
  phase: Math.PI / 2,
  frequency: 1,
});

const [particle] = create2DSineWave(() => ({
  amplitude: mouseDistance() / 40,
  frequency: 1,
}));
```

The idea of the lib is to have a very simple toolbox to create these animations and many more. You can write your own animation loop or combine passes to make something trully unique.

```tsx
const [circle] = create2DSineWave(() => ({
  // This will follow the mouse in ta circular path
  offset: [mouse.x, mouse.y],
  amplitude: 20,
  frequency: 0.5,
}));

// Transitions is too fast though... maybe the bird isn't that fast
// So you can combine a spring with the sine wave
const [bird] = create2DSpring(() => ({
  target: circle.position,
}));
```

# TODO

- Section on primitives `createAnimation`, `createBodyAnimation`

```tsx
const [fourrierPoint] = createBodyAnimation(() => [
  sineWavePass({
    frequency: 1,
    amplitude: 90,
  }),
  additivePass(
    sineWavePass(() => ({
      frequency: 2,
      amplitude: 45,
      phase: Math.PI / 2,
    })),
  ),
]);
```

- Section about ThreeJS
  - Signals are render agnostic
