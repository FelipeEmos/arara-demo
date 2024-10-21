import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";
import { isServer } from "solid-js/web";

export type AnimationCallback = (world: {
  currentTime: number;
  deltaTime: number;
}) => void;

export type AnimationController = {
  running: Accessor<boolean>;
  start: VoidFunction;
  stop: VoidFunction;
  pause: VoidFunction;

  add: (animationCallback: AnimationCallback) => void;
  remove: (animationCallback: AnimationCallback) => void;
};

export const VOID_ANIMATION_CONTROLLER = {
  running: () => false,
  start: () => {},
  stop: () => {},
  pause: () => {},
  add: () => {},
  remove: () => {},
} as const satisfies AnimationController;

export type AnimationControllerOptions = {
  autoplay?: boolean | "on-mount";
};

export function createAnimationController(
  options: AnimationControllerOptions = {
    autoplay: true,
  },
): AnimationController {
  if (isServer) {
    return VOID_ANIMATION_CONTROLLER;
  }
  const [running, setRunning] = createSignal(false);

  const [currentTime, setCurrentTime] = createSignal(0);
  const [lastPauseTime, setLastPauseTime] = createSignal(0);

  const [callbacks, setCallbacks] = createSignal<AnimationCallback[]>([]);
  const add = (animationCallback: AnimationCallback) => {
    setCallbacks([...callbacks(), animationCallback]);
  };
  const remove = (animationCallback: AnimationCallback) => {
    setCallbacks(callbacks().filter((c) => c !== animationCallback));
  };

  let rafRequestID = 0;
  const loop: FrameRequestCallback = (timestamp) => {
    rafRequestID = requestAnimationFrame(loop);
    const virtualTimestamp = timestamp + lastPauseTime();
    const deltaTime = virtualTimestamp - currentTime();
    setCurrentTime(virtualTimestamp);

    callbacks().forEach((c) => c({ currentTime: virtualTimestamp, deltaTime }));
  };

  const shouldRun = () => running() && callbacks().length > 0;

  createEffect<number | undefined>((prevRAF) => {
    if (shouldRun()) {
      rafRequestID = requestAnimationFrame(loop);
      return rafRequestID;
    }

    if (prevRAF !== undefined) {
      cancelAnimationFrame(prevRAF);
    }
    cancelAnimationFrame(rafRequestID);
  });

  const start = () => {
    setRunning(true);
  };
  const pause = () => {
    setRunning(false);
    setLastPauseTime(currentTime());
  };
  const stop = () => {
    setRunning(false);
    setLastPauseTime(0);
  };

  onCleanup(stop);

  if (options.autoplay === "on-mount") {
    onMount(start);
  } else if (options.autoplay === true) {
    start();
  }

  return {
    running,
    start,
    pause,
    stop,
    add,
    remove,
  };
}

export type AnimationControllerGenerator =
  | AnimationControllerOptions
  | Accessor<AnimationController>;

export function useOrCreateAnimationController(
  generator?: AnimationControllerGenerator,
) {
  const result = createMemo(() => {
    if (typeof generator === "function") {
      return generator();
    }
    return createAnimationController(generator);
  });

  return result;
}

export function createAnimation(
  animationCallback?: AnimationCallback,
  animationController?: AnimationControllerGenerator,
) {
  const controller = useOrCreateAnimationController(animationController);

  createEffect<AnimationController>((prevController) => {
    untrack(() => {
      if (!animationCallback) {
        return;
      }
      prevController?.remove(animationCallback);
      controller().add(animationCallback);
    });
    return controller();
  });

  return controller;
}
