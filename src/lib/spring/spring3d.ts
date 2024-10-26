import { Accessor } from "solid-js";
import {
  Body3DAnimationOptions,
  Body3DAnimationPass,
  createBody3DAnimation,
} from "../body-3d-animation";
import { vec3 } from "gl-matrix";

export type Spring3DOptions = {
  mass: number;
  target: vec3;
  initialPosition: vec3;
  damping: number;
  stiffness: number;
};

export const defaultOptions = {
  mass: 1,
  target: [1, 1, 1],
  initialPosition: [0, 0, 0],
  damping: 0.5,
  stiffness: 0.5,
} as const satisfies Spring3DOptions;

export function spring3DPass(
  options?: Partial<Spring3DOptions> | Accessor<Partial<Spring3DOptions>>,
): Body3DAnimationPass {
  const distanceVector = vec3.create();
  const fricctionForce = vec3.create();
  const elasticForce = vec3.create();
  const sumForces = vec3.create();

  return ({ body, deltaTime }) => {
    const opts = typeof options === "function" ? options() : options;
    const { target, damping, stiffness, mass } = {
      ...defaultOptions,
      ...opts,
    };

    if (mass === 0) {
      // FIXME: Is this the best way to handle this in library code?
      throw new Error("Cannot create a spring3D animation with mass 0");
    }

    vec3.sub(distanceVector, target, body.position);
    vec3.scale(elasticForce, distanceVector, stiffness);
    vec3.scale(fricctionForce, body.velocity, -damping);

    vec3.add(sumForces, elasticForce, fricctionForce);

    const acceleration = vec3.scale(vec3.create(), sumForces, 1 / mass);
    const velocity = vec3.scaleAndAdd(
      vec3.create(),
      body.velocity,
      acceleration,
      deltaTime / 1000,
    );
    const position = vec3.scaleAndAdd(
      vec3.create(),
      body.position,
      acceleration,
      deltaTime / 1000,
    );

    return {
      position,
      velocity,
      acceleration,
    };
  };
}

export function createSpring3D(
  options?: Partial<Spring3DOptions> | Accessor<Partial<Spring3DOptions>>,
  bodyAnimationOptions?: () => Body3DAnimationOptions,
) {
  return createBody3DAnimation(
    () => [spring3DPass(options)],
    bodyAnimationOptions,
  );
}
