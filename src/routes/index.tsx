import { H2Typography, H3Typography } from "~/components/typography";
import { createSignal } from "solid-js";
import { createSineWave, sineWavePass } from "~/lib/wave/sine";
import { createElementSize } from "@solid-primitives/resize-observer";
import { createBodyAnimation } from "~/lib/body-animation";
import { additivePass } from "~/lib/composers/additive-pass";
import { createSine2DWave } from "~/lib/wave/sine2d";

export default function Home() {
  return (
    <div class="flex flex-col pb-20 md:flex-row">
      <div class="flex flex-1 flex-col gap-8 p-8">
        <H2Typography>Arara</H2Typography>
        <H3Typography class="border-l-4 border-blue-600 pl-4 text-blue-600">
          Sine Wave
        </H3Typography>
        <SineDemo />

        <H3Typography class="border-l-4 border-blue-600 pl-4 text-blue-600">
          Two Sine Waves Added
        </H3Typography>
        <AdditiveSineDemo />
      </div>
      <div class="flex flex-1 flex-col gap-8 p-8">
        <H3Typography class="border-l-4 border-blue-600 pl-4 text-blue-600">
          Compose 2 Sines in 2D
        </H3Typography>
        <ComposeSineDemo />
      </div>
    </div>
  );
}

function SineDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [body] = createSineWave({
    amplitude: 90,
  });

  const xOffset = () => {
    return (
      body.position +
      -(ballSize.width ?? 0) / 2 +
      (containerSize.width ?? 0) / 2
    );
  };

  return (
    <div
      class="w-full overflow-hidden rounded-lg bg-slate-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="size-8 rounded-full bg-cyan-500 shadow-xl"
        style={{
          transform: `translate(${xOffset()}px`,
        }}
        ref={setBall}
      />
    </div>
  );
}

function AdditiveSineDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [body] = createBodyAnimation(() => [
    sineWavePass({
      frequency: 1,
      amplitude: 90,
    }),
    additivePass(
      sineWavePass(() => ({
        frequency: 2,
        amplitude: 45,
      })),
    ),
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
      class="w-full overflow-hidden rounded-lg bg-slate-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="size-8 rounded-full bg-cyan-500 shadow-xl"
        style={{
          transform: `translate(${xOffset()}px`,
        }}
        ref={setBall}
      />
    </div>
  );
}

function ComposeSineDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [body] = createSine2DWave({
    amplitude: [90, 90],
    phase: [Math.PI / 2, 0],
  });

  const xOffset = () => {
    return (
      body.position[0] +
      -(ballSize.width ?? 0) / 2 +
      (containerSize.width ?? 0) / 2
    );
  };

  const yOffset = () => {
    return (
      body.position[1] +
      -(ballSize.height ?? 0) / 2 +
      (containerSize.height ?? 0) / 2
    );
  };

  return (
    <div
      class="h-full w-full overflow-hidden rounded-lg bg-slate-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="size-10 rounded-full bg-cyan-500 shadow-xl"
        style={{
          transform: `translate(${xOffset()}px, ${yOffset()}px)`,
        }}
        ref={setBall}
      />
    </div>
  );
}
