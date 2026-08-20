# UI audit and design direction

## Design read

Reading this as a software engineer portfolio for recruiters and technical hiring managers, with a restrained technical/editorial language built on the existing dark identity.

- Design variance: 6/10
- Motion intensity: 3/10
- Visual density: 4/10
- Redesign mode: targeted visual overhaul with content, routes, links, data, and functionality preserved

## Baseline findings

- The initial mobile hero is taller than the viewport while vertically centered inside an overflow-hidden section, which clips the name and availability label.
- The 1440px composition uses a narrow content scale and leaves too much empty space while important supporting copy remains small.
- Cyan, orange, indigo, and green accents compete with each other; gradients and glows weaken hierarchy.
- Repeated numbered eyebrows, rounded cards, nested panels, and decorative effects create a component-library/template feel.
- Project screenshots are the strongest proof of work but are visually constrained by dense two-column cards and small supporting text.
- Muted text, captions, and metadata are frequently below a comfortable reading size and contrast.
- Several touch targets are below 44px, including the mobile menu control and carousel controls.
- Skill chips are rendered as buttons despite having no interaction, adding misleading keyboard stops.
- Navigation has hover feedback but no current-section state; the mobile trigger lacks expanded/control state metadata.
- Most below-the-fold sections render from opacity zero until observed, which produces blank full-page captures before scrolling and is fragile under motion/capture constraints.

## Direction

- Concept: technical editorial portfolio, calm and precise, with projects as the visual center of gravity.
- Typography: keep Archivo for readable body copy and Space Grotesk for display/technical labels; increase body size, line height, and contrast.
- Spacing: one consistent wide container, larger section rhythm, fewer nested boxes, explicit mobile spacing.
- Color: preserve the deep navy identity, use one cyan accent consistently, and use neutral ink/surface steps for hierarchy.
- Components: 12px surface radius, compact 8px controls, flat borders instead of glow, project media given more area.
- Motion: hero entrance and menu transition only, plus short hover/focus feedback; all motion respects reduced-motion.
- Avoid: multi-color gradients, glow rings, animated decoration, excessive pills, nested cards, tiny metadata, and decorative section dividers.

## Validation targets

- Route: `/`
- Viewports: 1440x1000, 1024x900, 390x844
- States: initial hero, mobile navigation open, keyboard focus, carousel next image, reduced motion
