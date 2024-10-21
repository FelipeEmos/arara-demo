import { H2Typography, H3Typography } from "~/components/typography";
import { createMousePosition } from "@solid-primitives/mouse";
import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { createSineWave, makeSineWavePass } from "~/lib/wave/sine";
import { createContainer } from "~/utils/create-container";
import { createElementSize } from "@solid-primitives/resize-observer";
import { createBodyAnimation } from "~/lib/body-animation";

export default function Home() {
  return (
    <div class="flex flex-col gap-8 p-8 pb-20">
      <H2Typography>Arara</H2Typography>
      <H3Typography class="border-l-4 border-blue-600 pl-4 text-blue-600">
        Sine Wave Demo
      </H3Typography>
      <SineDemo />

      <H3Typography class="border-l-4 border-blue-600 pl-4 text-blue-600">
        Custom Sine Wave Demo
      </H3Typography>
      <CustomSineCombinedDemo />
    </div>
  );
}

function CustomSineCombinedDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [body] = createBodyAnimation(() => [
    makeSineWavePass({
      offset: 0,
      frequency: 1,
      amplitude: 90,
      phase: Math.PI / 2,
    }),
    // TODO: This is not working, it is ignoring the previous pass
    makeSineWavePass(() => ({
      offset: 0,
      frequency: 1,
      amplitude: 45,
      phase: Math.PI / 2,
    })),
    // The way to make it work will be to use combinators
    // like:
    // additivePass(
    //   makeSineWavePass({
    //     offset: 0,
    //     frequency: 1,
    //     amplitude: 45,
    //     phase: Math.PI / 2,
    //   }),
    // ),
  ]);

  const xOffset = () => {
    return (
      body.position +
      -(ballSize.width ?? 0) / 2 +
      (containerSize.width ?? 0) / 2
    );
  };

  return (
    <div
      class="h-32 w-full overflow-hidden rounded-lg bg-slate-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="size-10 rounded-full bg-cyan-500 shadow-xl"
        style={{
          transform: `translate(${xOffset()}px`,
        }}
        ref={setBall}
      />
    </div>
  );
}

function SineDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [body] = createSineWave(() => ({
    offset: 0,
    amplitude: 90,
    phase: Math.PI / 2,
    frequency: 1,
  }));

  const xOffset = () => {
    return (
      body.position +
      -(ballSize.width ?? 0) / 2 +
      (containerSize.width ?? 0) / 2
    );
  };

  return (
    <div
      class="h-32 w-full overflow-hidden rounded-lg bg-slate-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="size-10 rounded-full bg-cyan-500 shadow-xl"
        style={{
          transform: `translate(${xOffset()}px`,
        }}
        ref={setBall}
      />
    </div>
  );
}
