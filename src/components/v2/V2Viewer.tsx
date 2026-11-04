"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "@/app/(v2)/v2-preview/credentials.module.css";
import type { Doc } from "./beyondData";

type Props = {
  items: Doc[];
  /** Index into `items`, or null when closed. */
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** Returns the element that opened the dialog; focus goes back to it on close. */
  getOpener: () => HTMLElement | null;
};

/**
 * Enlarged documentary-photo view. Same native <dialog> pattern and look as the Credentials lightbox (showModal focus trap, Escape,
 * arrow keys, focus return), without the verification link.
 */
export default function V2Viewer({ items, index, onIndex, onClose, getOpener }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const d0 = open ? items[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const root = document.documentElement;
    if (open && !d.open) {
      const sb = window.innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (sb > 0) root.style.paddingRight = `${sb}px`;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) {
      root.style.overflow = "";
      root.style.paddingRight = "";
    }
  }, [open]);

  useEffect(
    () => () => {
      const root = document.documentElement;
      root.style.overflow = "";
      root.style.paddingRight = "";
    },
    [],
  );

  const step = (n: number) => onIndex((index! + n + items.length) % items.length);
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (!open) return;
    if (e.key === "Tab") {
      const f = Array.from(ref.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
      if (f.length) {
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <dialog
      ref={ref}
      className={styles.lb}
      aria-labelledby="vw-title"
      aria-describedby="vw-meta"
      onKeyDown={onKey}
      onClose={() => {
        onClose();
        getOpener()?.focus();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {d0 && (
        <div className={styles.lbBody}>
          <div className={styles.lbBar}>
            <p className={styles.lbCount} aria-live="polite">
              {String(index! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button type="button" className={styles.lbClose} onClick={onClose} aria-label="Close enlarged photograph">
              <X size={20} aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>

          <figure className={styles.lbFig}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={d0.id} src={d0.full.src} width={d0.full.w} height={d0.full.h} alt={d0.alt} />
          </figure>

          <div className={styles.lbFoot}>
            <div>
              <h3 id="vw-title" className={styles.lbTitle}>
                {d0.title}
              </h3>
              <p id="vw-meta" className={styles.lbMeta}>
                {d0.meta}
              </p>
            </div>
            <div className={styles.lbActions}>
              <button type="button" className={styles.lbNav} onClick={() => step(-1)} aria-label="Previous photograph">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button type="button" className={styles.lbNav} onClick={() => step(1)} aria-label="Next photograph">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
