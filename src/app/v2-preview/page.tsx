import V2Nav from "@/components/v2/V2Nav";
import V2Anchors from "@/components/v2/V2Anchors";
import styles from "./v2.module.css";
import { v2Sections } from "@/components/v2/registry";

export default function V2Page() {
  return (
    <>
      <V2Nav />
      <V2Anchors />
      {/* id matches the root layout's skip link (#main-content); tabIndex lets the skip link move keyboard focus here. */}
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {v2Sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </>
  );
}
