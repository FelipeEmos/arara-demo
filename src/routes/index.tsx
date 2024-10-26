import { H2Typography } from "~/components/typography";
import { SineShowcase } from "~/demo/SineShowcase";

export default function Home() {
  return (
    <div class="flex flex-col gap-8 p-8">
      <H2Typography>Arara</H2Typography>
      <SineShowcase />
    </div>
  );
}
