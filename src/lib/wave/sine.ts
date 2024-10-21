import { Accessor } from "solid-js";
import {
  BodyAnimationOptions,
  BodyAnimationPass,
  createBodyAnimation,
} from "../body-animation";

export type SineWaveOptions = {
  offset: number;
  frequency: number;
  amplitude: number;
  phase: number;
};

const defaultOptions: SineWaveOptions = {
  offset: 0,
  frequency: 1,
  amplitude: 1,
  phase: 0,
};

export function makeSineWavePass(
  options?: Partial<SineWaveOptions> | Accessor<Partial<SineWaveOptions>>,
): BodyAnimationPass {
  return ({ currentTime }) => {
    const opts = typeof options === "function" ? options() : options;
    const { offset, frequency, amplitude, phase } = {
      ...defaultOptions,
      ...opts,
    };

    const omega = 2 * Math.PI * frequency;
    const sine = Math.sin((omega * currentTime) / 1000 + phase);
    const cosine = Math.cos((omega * currentTime) / 1000 + phase);

    return {
      position: offset + amplitude * sine,
      velocity: amplitude * omega * cosine,
      acceleration: -amplitude * omega * omega * cosine,
    };
  };
}

export function createSineWave(
  options: Accessor<Partial<SineWaveOptions>> = () => defaultOptions,
  bodyAnimationOptions?: () => BodyAnimationOptions,
) {
  return createBodyAnimation(
    () => [makeSineWavePass(options)],
    bodyAnimationOptions,
  );
}
