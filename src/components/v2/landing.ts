/**
 * Where an in-page destination should land. A section's outer box is not the right anchor: the sections overlap through slanted seams and
 * several start with generous padding, so aligning the box at a fixed offset leaves a strip of the previous section visible or the
 * introduction far down the screen. Each destination is instead positioned by its introduction (the heading group, the photo for About,
 * the full-bleed stage for Beyond the Code) at one consistent distance from the top of the viewport.
 *
 * Positions come from layout offsets (offsetTop), not bounding rects, so they are not affected by the entrance transforms that the
 * scroll animations apply to the elements.
 */
const slant = () => Math.min(44, Math.max(18, window.innerWidth * 0.03));

function docTop(el: HTMLElement): number {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/**
 * Distance from the top of the viewport to the introduction. It is the bottom of the fixed chrome (the floating dock on desktop, the menu
 * button on mobile) plus a small clearance, so content that runs under the chrome (Works' first project card sits in the dock's column)
 * is never covered, with a minimum of 8.5% of the screen height for comfort on tall screens. The chrome is measured, with its designed
 * bottom edge (62px dock, 58px button) as the fallback while it is hidden or mid-transition.
 */
function introGap(): number {
  const desk = window.innerWidth >= 1024;
  const el = document.querySelector<HTMLElement>(desk ? "[class*='dock']" : "button[aria-controls='v2-menu']");
  const measured = el?.getBoundingClientRect().bottom ?? 0;
  const bottom = measured > 20 && measured < 120 ? measured : desk ? 62 : 58;
  return Math.round(Math.min(100, Math.max(bottom + (desk ? 14 : 12), window.innerHeight * 0.085)));
}

/** Scroll position (px) for the element with this id, or null if it does not exist. */
export function landingY(id: string): number | null {
  const el = document.getElementById(id);
  if (!el) return null;
  if (id === "hero") return 0;
  const gap = introGap();

  // Beyond the Code: the scenes are full-bleed, so the scene itself starts at the top edge. The Voice scene has a slanted top edge, which
  // is scrolled past so that the previous (vermilion) scene does not show above it.
  if (id === "beyond") return Math.max(0, docTop(el.querySelector<HTMLElement>("#beyond-run") ?? el));
  if (id === "beyond-run" || id === "beyond-court") return Math.max(0, docTop(el));
  if (id === "beyond-voice") return Math.max(0, docTop(el) + slant());

  const h2 = el.querySelector<HTMLElement>("h2");
  const group = h2 && h2.parentElement !== el ? h2.parentElement : h2;
  const tops = [group, ...Array.from(el.querySelectorAll<HTMLElement>(":scope > figure"))].filter(Boolean).map((n) => docTop(n as HTMLElement));
  if (!tops.length) return null;
  return Math.max(0, Math.round(Math.min(...tops) - gap));
}

/** Scroll to a destination. `smooth` is ignored (instant) when the visitor prefers reduced motion. */
export function scrollToId(id: string, smooth = true): boolean {
  const y = landingY(id);
  if (y === null) return false;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: y, behavior: smooth && !calm ? "smooth" : "instant" });
  return true;
}
