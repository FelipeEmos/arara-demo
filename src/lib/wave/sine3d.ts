import { Accessor } from "solid-js";
import {
  createBody3DAnimation,
  Body3DAnimationOptions,
  Body3DAnimationPass,
} from "../body-3d-animation";
import { vec3 } from "gl-matrix";
import { compose3DPass } from "../composers/dimension-pass";
import { sineWavePass, defaultOptions, SineWaveOptions } from "./sine";
import { Dimension, getAxis } from "../physics";

export type Sine3DWaveOptions = {
  offset: vec3;
  frequency: vec3;
  amplitude: vec3;
  phase: vec3;
};

function getOptionsInDimention(
  options:
    | Partial<Sine3DWaveOptions>
    | Accessor<Partial<Sine3DWaveOptions>>
    | undefined,
  dimension: Dimension,
): Partial<SineWaveOptions> {
  const opts = typeof options === "function" ? options() : options;
  if (!opts) {
    return {};
  }
  const axis = getAxis(dimension);
  const result: Partial<SineWaveOptions> = {};
  for (let k of Object.keys(opts)) {
    const key = k as keyof SineWaveOptions;
    const value = opts[key];

    if (value) {
      result[key] = value[axis];
    }
  }
  return result;
}

export function sine3DWavePass(
  options?: Partial<Sine3DWaveOptions> | Accessor<Partial<Sine3DWaveOptions>>,
): Body3DAnimationPass {
  return compose3DPass({
    x: sineWavePass({
      ...defaultOptions,
      ...getOptionsInDimention(options, "x"),
    }),
    y: sineWavePass({
      ...defaultOptions,
      ...getOptionsInDimention(options, "y"),
    }),
    z: sineWavePass({
      ...defaultOptions,
      ...getOptionsInDimention(options, "z"),
    }),
  });
}

export function createSine3DWave(
  options?: Partial<Sine3DWaveOptions> | Accessor<Partial<Sine3DWaveOptions>>,
  bodyAnimationOptions?: () => Body3DAnimationOptions,
) {
  return createBody3DAnimation(
    () => [sine3DWavePass(options)],
    bodyAnimationOptions,
  );
}
