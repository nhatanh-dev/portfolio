import styles from "@/app/(v2)/v2-preview/v2.module.css";

/** Splits text into per-character spans so motion can stagger a mask reveal. Hidden from AT; the heading carries an aria-label. */
export default function V2Chars({ text, motion, attr = "data-m" }: { text: string; motion?: string; attr?: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => {
        const hook = motion ? { [attr]: motion } : {};
        return (
          <span key={i} className={styles.ch} aria-hidden="true" {...hook}>
            {c === " " ? " " : c}
          </span>
        );
      })}
    </>
  );
}
