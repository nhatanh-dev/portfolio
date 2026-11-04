"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initial-load anchor navigation. The root layout makes <html> smooth-scrolling, so the browser's fragment scroll starts as an animation
 * that ScrollTrigger's refresh (which briefly resets the scroll position) interrupts, leaving the page near the top. The initial scroll is
 * therefore instant; once the document, fonts and images have loaded (layout is final) the triggers are refreshed and the hash target is
 * re-applied unless the visitor has already scrolled, then smooth scrolling is restored for in-page navigation. Browser Back/Forward between
 * hash entries is also corrected: the Next.js router can leave the page at the top (the #about entry, whose top edge sits exactly at the
 * bottom of the first viewport), so once the traversal's scroll has stopped, a hash target that is entirely off screen is brought into view.
 */
export default function V2Anchors() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    let live = true;
    let touched = false;
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const mark = () => {
      touched = true;
    };
    events.forEach((e) => window.addEventListener(e, mark, { passive: true, once: true }));

    const loaded =
      document.readyState === "complete" ? Promise.resolve() : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
    Promise.all([loaded, document.fonts?.ready]).then(() => {
      if (!live) return;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target && !touched) target.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = "";
    });

    const onPop = () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (!target) return;
      let last = -1;
      let still = 0;
      const tick = () => {
        if (!live) return;
        still = window.scrollY === last ? still + 1 : 0;
        last = window.scrollY;
        if (still < 3) {
          requestAnimationFrame(tick);
          return;
        }
        const r = target.getBoundingClientRect();
        if (r.top >= window.innerHeight || r.bottom <= 0) target.scrollIntoView({ block: "start", behavior: "instant" });
      };
      requestAnimationFrame(tick);
    };
    window.addEventListener("popstate", onPop);

    return () => {
      live = false;
      window.removeEventListener("popstate", onPop);
      root.style.scrollBehavior = "";
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, []);

  return null;
}
