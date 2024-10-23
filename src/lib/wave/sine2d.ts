import { Accessor } from "solid-js";
import {
  createBody2DAnimation,
  Body2DAnimationOptions,
  Body2DAnimationPass,
} from "../body-2d-animation";
import { vec2 } from "gl-matrix";
import { compose2DPass } from "../composers/dimension-pass";
import { sineWavePass, defaultOptions, SineWaveOptions } from "./sine";
import { Dimension, getAxis } from "../physics";

export type Sine2DWaveOptions = {
  offset: vec2;
  frequency: vec2;
  amplitude: vec2;
  phase: vec2;
};

function getOptionsInDimention(
  options:
    | Partial<Sine2DWaveOptions>
    | Accessor<Partial<Sine2DWaveOptions>>
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

export function sine2DWavePass(
  options?: Partial<Sine2DWaveOptions> | Accessor<Partial<Sine2DWaveOptions>>,
): Body2DAnimationPass {
  return compose2DPass({
    x: sineWavePass({
      ...defaultOptions,
      ...getOptionsInDimention(options, "x"),
    }),
    y: sineWavePass({
      ...defaultOptions,
      ...getOptionsInDimention(options, "y"),
    }),
  });
}

export function createSine2DWave(
  options?: Partial<Sine2DWaveOptions> | Accessor<Partial<Sine2DWaveOptions>>,
  bodyAnimationOptions?: () => Body2DAnimationOptions,
) {
  return createBody2DAnimation(
    () => [sine2DWavePass(options)],
    bodyAnimationOptions,
  );
}
