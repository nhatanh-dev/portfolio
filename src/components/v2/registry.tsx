import type { ComponentType } from "react";
import V2Hero from "./V2Hero";
import V2About from "./V2About";
import V2Works from "./V2Works";
import V2Experience from "./V2Experience";

export type V2Section = {
  /** Anchor id; the section component renders <section id={id}>. */
  id: string;
  /** Label shown in the primary navigation. Only implemented sections belong in this list. */
  label: string;
  Component: ComponentType;
};

/**
 * Single source of truth for page composition and navigation, in scroll order.
 * Technical Expertise, Credentials, Beyond the Code and Contact are added here as they are built.
 */
export const v2Sections: V2Section[] = [
  { id: "hero", label: "Home", Component: V2Hero },
  { id: "about", label: "About", Component: V2About },
  { id: "works", label: "Works", Component: V2Works },
  { id: "experience", label: "Experience", Component: V2Experience },
];
