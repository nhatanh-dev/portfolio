"use client";

import { useSyncExternalStore } from "react";
import { v2Sections } from "./registry";

/**
 * The section crossing a thin band at 40% of the viewport height is "current". One shared IntersectionObserver serves every consumer
 * (inline nav, floating dock, mobile menu). Where sections overlap through their slanted edges the later one in page order wins.
 */
const FIRST = v2Sections[0].id;
let active = FIRST;
let io: IntersectionObserver | null = null;
const crossing = new Set<string>();
const subs = new Set<() => void>();

function start() {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? crossing.add(e.target.id) : crossing.delete(e.target.id)));
      const next = [...v2Sections].reverse().find((s) => crossing.has(s.id))?.id ?? active;
      if (next !== active) {
        active = next;
        subs.forEach((f) => f());
      }
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );
  v2Sections.forEach((s) => {
    const el = document.getElementById(s.id);
    if (el) io!.observe(el);
  });
}

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!io) start();
  return () => {
    subs.delete(cb);
    if (!subs.size && io) {
      io.disconnect();
      io = null;
      crossing.clear();
    }
  };
}

export function useActiveSection(): string {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => FIRST,
  );
}
