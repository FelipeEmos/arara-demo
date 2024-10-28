import { H3Typography } from "~/components/typography";
import { createSignal, onCleanup } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";
import { createSpring } from "~/lib/spring/spring";
import { createMousePosition } from "@solid-primitives/mouse";
import { createSpring2D } from "~/lib/spring/spring2d";
import { vec2 } from "gl-matrix";
import araraRedImage from "~/assets/arara_red.jpg";
import araraBlueImage from "~/assets/arara_blue.jpg";
import { sineWavePass } from "~/lib/wave/sine";
import { createBodyAnimation } from "~/lib/body-animation";
import { lerp } from "~/lib/utils/interpolation";

export function SpringShowcase() {
  return (
    <div class="flex flex-col gap-8 md:flex-row">
      <div class="flex flex-1 flex-col gap-8">
        <H3Typography class="border-l-4 border-emerald-600 pl-4 text-emerald-600">
          Spring Signal
        </H3Typography>
        <div class="flex flex-col gap-4 font-normal">
          Random Target
          <SpringDemo />
          Mouse Target...
          <SpringMouseDemo />
          <Spring2DMouseDemo />
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-8">
        <H3Typography class="border-l-4 border-emerald-600 pl-4 text-emerald-600">
          Animated Hover Card
        </H3Typography>
        <SpringAnimatedCardDemo />
      </div>
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

function SpringAnimatedCardDemo() {
  return (
    <div class="flex flex-row gap-8">
      <SpringAnimatedCard imgSrc={araraRedImage} />
      <SpringAnimatedCard imgSrc={araraBlueImage} />
      {/* <SpringAnimatedCard /> */}
    </div>
  );
}

function SpringAnimatedCard(props: { imgSrc: string }) {
  const [container, setContainer] = createSignal<HTMLDivElement>();
  const containerSize = createElementSize(container);

  const mouse = createMousePosition();
  const mouseInsideCard = (): vec2 => {
    const origin = getRootPosition(container());

    const rawTargetX = mouse.x - origin.left;
    const minX = 0;
    const maxX = containerSize.width ?? 0;
    const targetX = Math.max(minX, Math.min(rawTargetX, maxX));

    const rawTargetY = mouse.y - origin.top;
    const minY = 0;
    const maxY = containerSize.height ?? 0;
    const targetY = Math.max(minY, Math.min(rawTargetY, maxY));

    const relativeX = targetX - (containerSize.width ?? 0) / 2;
    const relativeY = targetY - (containerSize.height ?? 0) / 2;

    // return [targetX, targetY];
    return [relativeX, relativeY];
  };

  const [mouseTweakAnimation] = createSpring2D(() => ({
    target: mouseInsideCard(),
    stiffness: 150,
    damping: 16,
  }));

  const [isHovering, setIsHovering] = createSignal(false);
  const [effectPercentage] = createSpring(() => ({
    target: isHovering() ? 1 : 0,
    stiffness: 150,
    damping: 16,
  }));

  const raiseAmount = () => 1 + 0.1 * effectPercentage.position;
  const heroRaiseAmount = () => 1.2 - 0.1 * effectPercentage.position;
  // const raiseAmount = () => 1;
  const CARD_ROTATION = 0.05;
  const roll = () =>
    CARD_ROTATION * effectPercentage.position * mouseTweakAnimation.position[1];
  const tilt = () =>
    CARD_ROTATION * effectPercentage.position * mouseTweakAnimation.position[0];

  const HERO_ROTATION = 0.05;
  const heroRoll = () =>
    HERO_ROTATION * effectPercentage.position * mouseTweakAnimation.position[1];
  const heroTilt = () =>
    HERO_ROTATION * effectPercentage.position * mouseTweakAnimation.position[0];

  const [shiningEffectContainer, setShineEffectContainer] =
    createSignal<HTMLDivElement>();
  const shiningEffectContainerSize = createElementSize(shiningEffectContainer);

  const frequency = 0.2;
  const [shiningEffectAnimation] = createBodyAnimation(() => [
    sineWavePass({
      amplitude: 0.5,
      frequency,
      phase: Math.PI / 2,
    }),
    ({ body }) => {
      // Filter only upper movement
      if (body.velocity < 0) {
        return {
          position: 0,
          velocity: 0,
          acceleration: 0,
        };
      }
      return {
        ...body,
        position: body.position + 0.5,
      };
    },
    // TODO: Make it easier to control "pulses"
    // ({ body, currentTime }) => {
    //   const t = currentTime / 1000;
    //   const cycle = Math.floor(frequency * t);
    //   // Discard some cycles
    //   if (cycle % 2 === 0) {
    //     return body;
    //   }
    //   return {
    //     position: 1,
    //     velocity: 0,
    //     acceleration: 0,
    //   };
    // },
  ]);

  const shiningEffectTranslation = () => {
    const min = -(shiningEffectContainerSize.height ?? 0) - 30;
    const max =
      (containerSize.height ?? 0) + (shiningEffectContainerSize.height ?? 0);
    return lerp(shiningEffectAnimation.position, min, max);
  };

  // let teste = 0;
  // createEffect(() => {
  //   console.log(teste, "ShiningTranslation", shiningEffectTranslation());
  //   teste++;
  // });

  return (
    <div
      class="relative flex min-h-64 w-full flex-col overflow-hidden rounded-lg bg-gray-800 p-4 text-white shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: `scale(${raiseAmount()})
        rotateX(${roll()}deg)
        rotateY(${tilt()}deg)`,
      }}
      ref={setContainer}
    >
      <div
        class="absolute inset-x-0 top-0 z-10"
        style={{
          transform: `translateY(${shiningEffectTranslation()}px)`,
          opacity: effectPercentage.position * 0.3,
        }}
        ref={setShineEffectContainer}
      >
        <div class="mb-2 h-2 w-full bg-white" />
        <div class="h-4 w-full bg-white" />
      </div>
      <div class="relative w-full flex-1 overflow-hidden rounded-lg">
        <img
          src={props.imgSrc}
          class="z-0 h-full w-full object-cover shadow-[inset_4px_4px_20px_20px_rgba(0,0,0,0.3)]"
          style={{
            transform: `scale(${heroRaiseAmount()})
            rotateX(${heroRoll()}deg)
            rotateY(${heroTilt()}deg)
            `,
          }}
        />
        <div class="pointer-events-none absolute -inset-2 shadow-[inset_4px_4px_20px_20px_rgba(0,0,0,0.3)] ring-[16px] ring-inset ring-black/10" />
      </div>
      <H3Typography class="pt-4 font-thin">Hover Me</H3Typography>
    </div>
  );
}
