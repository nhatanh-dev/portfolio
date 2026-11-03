import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared section-seam reveal: the section's own box is unmasked from the bottom up through the slanted top edge used across the
 * page, scrubbed to scroll (reversible). The slant in px matches the `--slant` clamp used by each section's CSS.
 */
export function curtainReveal(el: HTMLElement, opts: { start?: string; end?: string } = {}) {
  const { start = "top 92%", end = "top 42%" } = opts;
  const slantPct = () => (Math.min(44, Math.max(18, window.innerWidth * 0.03)) / el.offsetHeight) * 100;
  return gsap.fromTo(
    el,
    { clipPath: "polygon(0% 100%, 100% 96%, 100% 100%, 0% 100%)" },
    {
      clipPath: () => `polygon(0% ${slantPct()}%, 100% 0%, 100% 100%, 0% 100%)`,
      ease: "none",
      scrollTrigger: { trigger: el, start, end, scrub: 0.6, invalidateOnRefresh: true },
    },
  );
}
