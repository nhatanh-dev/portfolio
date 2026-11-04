"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { landingY, scrollToId } from "./landing";

/**
 * Initial-load anchor navigation. The root layout makes <html> smooth-scrolling, so the browser's fragment scroll starts as an animation
 * that ScrollTrigger's refresh (which briefly resets the scroll position) interrupts, leaving the page near the top. The initial scroll is
 * therefore instant; once the document, fonts and images have loaded (layout is final) the triggers are refreshed and the hash target is
 * re-applied unless the visitor has already scrolled, then smooth scrolling is restored for in-page navigation. Browser Back/Forward between
 * hash entries is also corrected: the Next.js router can leave the page at the top (the #about entry, whose top edge sits exactly at the
 * bottom of the first viewport), so once the traversal's scroll has stopped, the entry is put at its landing position.
 *
 * Resizing across a breakpoint such as 1024px (rotating a tablet, resizing a window) re-creates the section animations, which refreshed
 * ScrollTrigger and left the page at the top: its refresh scrolls to the top to measure, and several refreshes run back to back, so the
 * position it restores can be the already-reset one. The reading position (the section at 40% of the viewport and how far through it) is
 * therefore tracked and re-applied once a resize has settled.
 *
 * Destinations land by their introduction, not by the section box (see landing.ts), for clicks, the initial hash and Back/Forward.
 *
 * In-page anchor clicks are handled here too. A plain <a href="#x"> click makes the browser add a history entry without the Next router's
 * history state; going Back to such an entry after visiting a case study left the case-study page rendered under the home URL. Pushing the
 * entry ourselves with the router's current state keeps every entry router-owned (modified clicks keep their native behaviour).
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

    // Waits until scrolling has stopped for a few frames (the browser's or the Next router's own scroll-to-hash has finished), then puts the
    // hash target at its landing position. `allow` lets the initial-load case stand down once the visitor has scrolled.
    const landWhenSettled = (id: string, allow: () => boolean = () => true, done?: () => void) => {
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
        const y = landingY(id);
        if (allow() && y !== null && Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: y, behavior: "instant" });
        done?.();
      };
      requestAnimationFrame(tick);
    };

    const loaded =
      document.readyState === "complete" ? Promise.resolve() : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
    Promise.all([loaded, document.fonts?.ready]).then(() => {
      if (!live) return;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target && !touched) {
        scrollToId(id, false);
        // On a client-side return to this page (Back from a case study) the Next router scrolls to the hash after this; land again once it has.
        landWhenSettled(id, () => !touched, () => (root.style.scrollBehavior = ""));
        return;
      }
      root.style.scrollBehavior = "";
    });

    // Reading anchor: which section sits at 40% of the viewport and the fraction of it already above that line.
    let anchor: { el: Element; frac: number; px: number } | null = null;
    let resizing = false;
    const read = () => {
      const line = window.innerHeight * 0.4;
      for (const el of Array.from(document.querySelectorAll("main > section"))) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) return { el, frac: (line - r.top) / Math.max(r.height, 1), px: line - r.top };
      }
      return null;
    };
    let raf = 0;
    const onScroll = () => {
      if (resizing || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        anchor = read() ?? anchor;
      });
    };
    let settle = 0;
    let lastW = window.innerWidth;
    const onResize = () => {
      // Only a width change (breakpoint, rotation, window resize) re-creates the layout. A height-only resize is the mobile browser
      // collapsing or showing its URL bar while the visitor scrolls; re-applying a stored position then snaps the page back by the
      // distance scrolled since the resize began (measured: 400-500px), and ScrollTrigger already ignores such resizes on touch devices.
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      if (!resizing) anchor = anchor ?? read();
      resizing = true;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (anchor && live) {
          const r = anchor.el.getBoundingClientRect();
          // Near a section's start keep the same distance from it; deeper in, keep the same fraction through it.
          const into = anchor.px <= window.innerHeight ? anchor.px : anchor.frac * r.height;
          const y = window.scrollY + r.top + into - window.innerHeight * 0.4;
          root.style.scrollBehavior = "auto";
          window.scrollTo(0, Math.max(0, y));
          requestAnimationFrame(() => live && (root.style.scrollBehavior = ""));
        }
        resizing = false;
      }, 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    anchor = read();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      if (window.location.hash !== `#${id}`) window.history.pushState(window.history.state, "", `#${id}`);
      if (!scrollToId(id)) target.scrollIntoView({ block: "start" });
      // Same focus behaviour as a native fragment navigation: the target becomes the sequential-focus starting point.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    const onPop = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      // The browser's own fragment scroll aligns the section box (or the Next router leaves the page elsewhere); put the entry at the same
      // landing position a click on its link produces.
      if (id && document.getElementById(id)) landWhenSettled(id);
    };
    window.addEventListener("popstate", onPop);

    return () => {
      live = false;
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
      root.style.scrollBehavior = "";
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, []);

  return null;
}
