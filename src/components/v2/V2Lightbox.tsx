"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import styles from "@/app/v2-preview/credentials.module.css";
import { credentials, kindLabel } from "./credentialsData";

type Props = {
  /** Index into `credentials`, or null when closed. */
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** Returns the element that opened the dialog; focus goes back to it on close. */
  getOpener: () => HTMLElement | null;
};

/**
 * Accessible enlarged certificate view built on the native <dialog>: showModal() provides the focus trap, inert page behind it and
 * Escape-to-close. Arrow keys move between certificates; closing returns focus to the trigger.
 */
export default function V2Lightbox({ index, onIndex, onClose, getOpener }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const c = open ? credentials[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      // Lock page scroll without a layout jump from the vanishing scrollbar.
      const root = document.documentElement;
      const sb = window.innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (sb > 0) root.style.paddingRight = `${sb}px`;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) {
      const root = document.documentElement;
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

  const step = (d: number) => onIndex((index! + d + credentials.length) % credentials.length);
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (!open) return;
    if (e.key === "Tab") {
      // Keep Tab/Shift+Tab inside the dialog: loop between its first and last control instead of leaving to the browser UI.
      const f = Array.from(ref.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
      if (f.length) {
        const first = f[0];
        const last = f[f.length - 1];
        const act = document.activeElement;
        if (e.shiftKey && act === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && act === last) {
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
      aria-labelledby="lb-title"
      aria-describedby="lb-meta"
      onKeyDown={onKey}
      onClose={() => {
        onClose();
        getOpener()?.focus();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself, outside its content box) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {c && (
        <div className={styles.lbBody}>
          <div className={styles.lbBar}>
            <p className={styles.lbCount} aria-live="polite">
              {String(c.n).padStart(2, "0")} / {String(credentials.length).padStart(2, "0")}
            </p>
            <button type="button" className={styles.lbClose} onClick={onClose} aria-label="Close enlarged certificate">
              <X size={20} aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>

          <figure className={styles.lbFig}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={c.id}
              src={c.full.src}
              width={c.full.w}
              height={c.full.h}
              alt={`${kindLabel[c.kind]} certificate: ${c.title}, issued by ${c.issuer}, ${c.date.label}. Awarded to Nguyen Pham Nhat Anh.`}
            />
          </figure>

          <div className={styles.lbFoot}>
            <div>
              <h3 id="lb-title" className={styles.lbTitle}>
                {c.title}
              </h3>
              <p id="lb-meta" className={styles.lbMeta}>
                {kindLabel[c.kind]} · {c.issuer} · {c.date.label}
              </p>
            </div>
            <div className={styles.lbActions}>
              <button type="button" className={styles.lbNav} onClick={() => step(-1)} aria-label="Previous certificate">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button type="button" className={styles.lbNav} onClick={() => step(1)} aria-label="Next certificate">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
              <a href={c.verifyUrl} className={styles.verifyLight} target="_blank" rel="noopener noreferrer">
                Verify on Coursera <ArrowUpRight size={18} aria-hidden="true" />
                <span className={styles.srOnly}> (opens Coursera in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
