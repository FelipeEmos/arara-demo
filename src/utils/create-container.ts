import { createSignal } from "solid-js";
import { createElementSize } from "@solid-primitives/resize-observer";

export function createContainer() {
  const [element, setElement] = createSignal<HTMLDivElement>();
  const size = createElementSize(element);

  return [size, setElement] as const;
}
