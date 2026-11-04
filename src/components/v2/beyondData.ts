/**
 * Section 07 — Beyond the Code. Only what the source images themselves show or print, plus the existing homepage's one-line
 * descriptions of running and badminton. Nothing here names an event role, ranking or year that the image does not carry.
 *
 * Attribution rules (see the report):
 * - The night-run photograph and the finisher certificate are SEPARATE documents (bibs 11022 and 11310). The certificate's time,
 *   rank and year are shown only as "printed on the certificate" and never attached to the photograph.
 * - The medal card's text is quoted as printed (Vietnamese) with a labelled English reading.
 * - The player portrait and the microphone portrait are not tied to any event.
 */
export type Img = { src: string; w: number; h: number };

/** A documentary image that opens in the viewer. `thumb` is shown on the page, `full` in the viewer. */
export type Doc = { id: string; title: string; meta: string; alt: string; thumb: Img; full: Img };

const b = (name: string, w: number) => `/v2/beyond/${name}-${w}.webp`;

export const docs: Doc[] = [
  {
    id: "run-photo",
    title: "HCMC Night Run Eximbank: event photograph",
    meta: "4th edition · 10 km bib 11022",
    alt: "Event photograph from the HCMC Night Run Eximbank, 4th edition: runners in the street at night, the central runner wearing bib 11022 for the 10 km.",
    thumb: { src: b("run-photo", 960), w: 960, h: 640 },
    full: { src: b("run-photo", 1920), w: 1920, h: 1280 },
  },
  {
    id: "run-certificate",
    title: "Finisher certificate",
    meta: "HCMC Night Run Eximbank 2024 · 10 km · bib 11310",
    alt: "Finisher certificate for the HCMC Night Run Eximbank 2024, 10 km, bib 11310, time 1:01:58, overall rank 224, gender rank 168, age group M_U31 rank 41.",
    thumb: { src: b("certificate", 512), w: 512, h: 362 },
    full: { src: b("certificate", 1024), w: 1024, h: 724 },
  },
  {
    id: "medal-card",
    title: "Badminton medal card",
    meta: "Hội thao 2025 Làng Cóc · Cầu lông · Hạng Nhì · Đôi Nam",
    alt: "Two medals on a printed card from FPT University reading: Hội thao 2025 Làng Cóc, Cầu lông, Hạng Nhì, Đôi Nam.",
    thumb: { src: b("medals", 720), w: 720, h: 720 },
    full: { src: b("medals", 1440), w: 1440, h: 1440 },
  },
];

export const doc = (id: string) => docs.findIndex((d) => d.id === id);

/** Trimmed transparent cutouts. Native sizes are the trimmed originals; the smaller file serves narrow screens. */
export const cutouts = {
  run: {
    alt: "Nhat Anh running in the night run, wearing a blue and white race shirt with bib 11022.",
    img: { src: b("run-cutout", 335), w: 335, h: 791 },
    /** Where the cutout sits inside the 1920×1280 event photograph (percent), so it registers exactly on it. */
    at: { left: (719 / 1920) * 100, top: (489 / 1280) * 100, width: (335 / 1920) * 100, height: (791 / 1280) * 100 },
  },
  court: {
    alt: "Nhat Anh in a ready stance with a badminton racket, wearing a white and blue sports shirt.",
    img: { src: b("court-cutout", 480), w: 480, h: 656 },
  },
  voice: {
    alt: "Nhat Anh speaking into a microphone, wearing a white short-sleeved shirt with a lanyard.",
    img: { src: b("voice-cutout", 278), w: 278, h: 468 },
  },
};

export const chapters = [
  { id: "run", n: "01", label: "The Run" },
  { id: "court", n: "02", label: "The Court" },
  { id: "voice", n: "03", label: "The Voice" },
] as const;

export const copy = {
  run: {
    lede: "Long-distance running: endurance, pacing, and consistent progress.",
    caption: "Event photograph · HCMC Night Run Eximbank, 4th edition · 10 km, bib 11022",
    record: {
      label: "Separate record · finisher certificate",
      lines: ["HCMC Night Run Eximbank 2024 · 10 km", "Time 1:01:58 · Overall 224 · Age group M_U31 41st"], 
    },
  },
  court: {
    lede: "Badminton: fast decisions and competitive focus.",
    record: {
      label: "Documentary record · medal card",
      printed: "Hội thao 2025 Làng Cóc · Cầu lông · Hạng Nhì · Đôi Nam",
      reading: "Sports festival 2025 · Badminton · Second place · Men's doubles",
    },
  },
  voice: {
    lede: "Communication, sharing ideas, and taking part beyond the technical work.",
    caption: "Speaking with a microphone at an outdoor activity.",
  },
};
