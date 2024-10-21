import { ComponentProps } from "solid-js";
import { cn } from "~/utils/tailwind";

// Typography default components inspired on Shadcn UI
// https://ui.shadcn.com/docs/components/typography#h1

export function H1Typography(props: ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      class={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.class,
      )}
    />
  );
}

export function H2Typography(props: ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      class={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        props.class,
      )}
    />
  );
}

export function H3Typography(props: ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      class={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.class,
      )}
    />
  );
}

export function H4Typography(props: ComponentProps<"h4">) {
  return (
    <h4
      {...props}
      class={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.class,
      )}
    />
  );
}

export function PTypography(props: ComponentProps<"p">) {
  return (
    <p
      {...props}
      class={cn("leading-7 [&:not(:first-child)]:mt-6", props.class)}
    />
  );
}

export function BlockquoteTypography(props: ComponentProps<"blockquote">) {
  return (
    <blockquote
      {...props}
      class={cn("mt-6 border-l-2 pl-6 italic", props.class)}
    />
  );
}

export function ListTypography(props: ComponentProps<"ul">) {
  return (
    <ul {...props} class={cn("my-6 ml-6 list-disc [&>li]:mt-2", props.class)} />
  );
}

export function LeadTypography(props: ComponentProps<"p">) {
  return (
    <p {...props} class={cn("text-muted-foreground text-xl", props.class)} />
  );
}
