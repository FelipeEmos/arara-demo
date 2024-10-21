import { vec2, vec3 } from "gl-matrix";

export type Body = {
  position: number;
  velocity: number;
  acceleration: number;
};

export type Body2D = {
  position: vec2;
  velocity: vec2;
  acceleration: vec2;
};

export type Body3D = {
  position: vec3;
  velocity: vec3;
  acceleration: vec3;
};
