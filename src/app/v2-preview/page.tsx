import V2Nav from "@/components/v2/V2Nav";
import V2Hero from "@/components/v2/V2Hero";
import V2About from "@/components/v2/V2About";
import V2Works from "@/components/v2/V2Works";

export default function V2Page() {
  return (
    <>
      <V2Nav />
      <main id="v2-main">
        <V2Hero />
        <V2About />
        <V2Works />
      </main>
    </>
  );
}
