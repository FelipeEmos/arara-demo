import { H3Typography } from "~/components/typography";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";
import { createSpring } from "~/lib/spring/spring";
import { createMousePosition } from "@solid-primitives/mouse";
import { createSpring2D } from "~/lib/spring/spring2d";
import { vec2 } from "gl-matrix";
import { createBody2DAnimation } from "~/lib/body-2d-animation";

export function SpringShowcase() {
  return (
    <div class="flex flex-col gap-8 md:flex-row">
      <div class="flex flex-1 flex-col gap-8">
        <H3Typography class="border-l-4 border-emerald-600 pl-4 text-emerald-600">
          Spring Signal
        </H3Typography>
        <div class="flex flex-col gap-4">
          <SpringDemo />
          Dynamic target where mouse is...
          <SpringMouseDemo />
          <Spring2DMouseDemo />
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-8"></div>
    </div>
  );
}

function SpringDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);

  const [target, setTarget] = createSignal(0);

  const [body] = createSpring(() => ({
    target: target(),
    stiffness: 16,
    damping: 16,
  }));

  const interval = setInterval(() => {
    const padding = 32;
    const max =
      (containerSize.width ?? 0) - (ballSize.width ?? 0) - 2 * padding;
    const minDistance = 10;

    let newTarget = Math.random() * max;
    while (Math.abs(newTarget - target()) < minDistance) {
      newTarget = Math.random() * max;
    }
    setTarget(newTarget);
  }, 2000);
  onCleanup(() => clearInterval(interval));

  return (
    <div
      class="relative w-full overflow-hidden rounded-lg bg-gray-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="z-10 size-8 rounded-full bg-emerald-500 shadow-xl"
        style={{
          transform: `translate(${body.position}px`,
        }}
        ref={setBall}
      />
      <div
        class="absolute left-8 top-8 size-8 rounded-full bg-rose-950 bg-opacity-30 shadow-xl"
        style={{
          transform: `translate(${target()}px`,
        }}
      />
    </div>
  );
}

function getRootPosition(element: HTMLElement | null | undefined): {
  top: number;
  left: number;
} {
  if (!element) {
    return { top: 0, left: 0 };
  }
  const parentPosition = getRootPosition(element.offsetParent as HTMLElement);
  return {
    top: element.offsetTop + parentPosition.top,
    left: element.offsetLeft + parentPosition.left,
  };
}

function SpringMouseDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);
  const padding = 32; // px

  const mouse = createMousePosition();
  const target = () => {
    const origin = getRootPosition(container());
    const rawTarget =
      mouse.x - origin.left - padding - (ballSize.width ?? 0) / 2;

    const min = 0;
    const max =
      (containerSize.width ?? 0) - (ballSize.width ?? 0) - 2 * padding;

    return Math.max(min, Math.min(rawTarget, max));
  };

  const [isHovering, setIsHovering] = createSignal(false);

  const [body] = createSpring(() => ({
    target: target(),
    stiffness: isHovering() ? 4 : 16,
    damping: 16,
  }));

  return (
    <div
      class="relative w-full overflow-hidden rounded-lg bg-gray-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="z-10 size-8 rounded-full bg-emerald-500 shadow-xl"
        style={{
          transform: `translate(${body.position}px`,
        }}
        ref={setBall}
      />
      <div
        class="group absolute left-8 top-8 size-8 rounded-full bg-rose-950 bg-opacity-30 shadow-xl transition-opacity hover:bg-opacity-100"
        style={{
          left: `${target() + padding}px`,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div class="h-full w-full rounded-full bg-rose-950 bg-opacity-0 transition-all group-hover:animate-ping group-hover:bg-opacity-100" />
      </div>
    </div>
  );
}

function Spring2DMouseDemo() {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const [ball, setBall] = createSignal<HTMLDivElement>();
  const ballSize = createElementSize(ball);
  const padding = 32; // px

  const mouse = createMousePosition();
  const target = (): vec2 => {
    const origin = getRootPosition(container());

    const rawTargetX =
      mouse.x - origin.left - padding - (ballSize.width ?? 0) / 2;
    const minX = 0;
    const maxX =
      (containerSize.width ?? 0) - (ballSize.width ?? 0) - 2 * padding;
    const targetX = Math.max(minX, Math.min(rawTargetX, maxX));

    const rawTargetY =
      mouse.y - origin.top - padding - (ballSize.height ?? 0) / 2;
    const minY = 0;
    const maxY =
      (containerSize.height ?? 0) - (ballSize.height ?? 0) - 2 * padding;
    const targetY = Math.max(minY, Math.min(rawTargetY, maxY));

    return [targetX, targetY];
  };

  const [body] = createSpring2D(() => ({
    target: target(),
    stiffness: 32,
    damping: 16,
  }));

  return (
    <div
      class="relative min-h-64 w-full overflow-hidden rounded-lg bg-gray-300 p-8 shadow-inner"
      ref={setContainer}
    >
      <div
        class="z-10 size-8 rounded-full bg-emerald-500 shadow-xl"
        style={{
          transform: `translate(${body.position[0]}px, ${body.position[1]}px)`,
        }}
        ref={setBall}
      />
      <div
        class="absolute left-8 top-8 size-8 rounded-full bg-rose-950 bg-opacity-30 shadow-xl transition-opacity"
        style={{
          left: `${target()[0] + padding}px`,
          top: `${target()[1] + padding}px`,
        }}
      />
    </div>
  );
}
