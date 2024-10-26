import { Accessor } from "solid-js";
import {
  BodyAnimationOptions,
  BodyAnimationPass,
  createBodyAnimation,
} from "../body-animation";

export type SpringOptions = {
  mass: number;
  target: number;
  initialPosition: number;
  damping: number;
  stiffness: number;
};

export const defaultOptions = {
  mass: 1,
  target: 1,
  initialPosition: 0,
  damping: 0.5,
  stiffness: 0.5,
} as const satisfies SpringOptions;

export function springPass(
  options?: Partial<SpringOptions> | Accessor<Partial<SpringOptions>>,
): BodyAnimationPass {
  return ({ body, deltaTime }) => {
    const opts = typeof options === "function" ? options() : options;
    const { target, damping, stiffness, mass } = {
      ...defaultOptions,
      ...opts,
    };

    if (mass === 0) {
      // FIXME: Is this the best way to handle this in library code?
      throw new Error("Cannot create a spring animation with mass 0");
    }

    const delta = target - body.position;
    const elasticForce = delta * stiffness;
    const fricctionForce = body.velocity * -damping;

    const acceleration = (elasticForce + fricctionForce) / mass;
    const velocity = body.velocity + (acceleration * deltaTime) / 1000;
    const position = body.position + (velocity * deltaTime) / 1000;

    return {
      position,
      velocity,
      acceleration,
    };
  };
}

export function createSpring(
  options?: Partial<SpringOptions> | Accessor<Partial<SpringOptions>>,
  bodyAnimationOptions?: () => BodyAnimationOptions,
) {
  return createBodyAnimation(() => [springPass(options)], bodyAnimationOptions);
}
