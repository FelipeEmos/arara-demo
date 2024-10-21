import { BodyAnimationPass } from "../body-animation";

export function additivePass(rawPass: BodyAnimationPass): BodyAnimationPass {
  return (world) => {
    const { body } = world;
    const rawResult = rawPass(world);
    return {
      position: body.position + rawResult.position,
      velocity: body.velocity + rawResult.velocity,
      acceleration: body.acceleration + rawResult.acceleration,
    };
  };
}
