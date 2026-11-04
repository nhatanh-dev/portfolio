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

/** Scroll position (px) for the element with this id, or null if it does not exist. */
export function landingY(id: string): number | null {
  const el = document.getElementById(id);
  if (!el) return null;
  if (id === "hero") return 0;
  // Breathing room above the introduction: clear of the floating dock / menu button, scaled a little with the screen height.
  const gap = window.innerWidth >= 1024 ? Math.min(130, Math.max(88, window.innerHeight * 0.12)) : 88;

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
