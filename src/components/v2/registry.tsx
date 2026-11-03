import type { ComponentType } from "react";
import V2Hero from "./V2Hero";
import V2About from "./V2About";
import V2Works from "./V2Works";
import V2Experience from "./V2Experience";
import V2Tech from "./V2Tech";
import V2Credentials from "./V2Credentials";
import V2Beyond from "./V2Beyond";
import V2Contact from "./V2Contact";

export type V2Section = {
  /** Anchor id; the section component renders <section id={id}>. */
  id: string;
  /** Label shown in the primary navigation. Only implemented sections belong in this list. */
  label: string;
  Component: ComponentType;
};

/**
 * Single source of truth for page composition and navigation, in scroll order.
 */
export const v2Sections: V2Section[] = [
  { id: "hero", label: "Home", Component: V2Hero },
  { id: "about", label: "About", Component: V2About },
  { id: "works", label: "Works", Component: V2Works },
  { id: "experience", label: "Experience", Component: V2Experience },
  { id: "expertise", label: "Expertise", Component: V2Tech },
  { id: "credentials", label: "Credentials", Component: V2Credentials },
  { id: "beyond", label: "Beyond", Component: V2Beyond },
  { id: "contact", label: "Contact", Component: V2Contact },
];
