import { H2Typography } from "~/components/typography";
import { SineShowcase } from "~/demo/SineShowcase";
import { SpringShowcase } from "~/demo/SpringShowcase";

export default function Home() {
  return (
    <div class="flex flex-col gap-8 p-8 pb-20">
      <H2Typography>Arara</H2Typography>
      <SineShowcase />
      <SpringShowcase />
    </div>
  );
}
