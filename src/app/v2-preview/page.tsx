import V2Nav from "@/components/v2/V2Nav";
import { v2Sections } from "@/components/v2/registry";

export default function V2Page() {
  return (
    <>
      <V2Nav />
      <main id="v2-main">
        {v2Sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </>
  );
}
