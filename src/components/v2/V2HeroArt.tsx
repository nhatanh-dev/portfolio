import { useId } from "react";
import styles from "@/app/v2-preview/v2.module.css";

/* Lightweight flat-vector scenery for the hero shape: no filters, no raster. */

type Box = { x: number; y: number; body: string; top: string; side: string };

const W = 220;
const H = 96;
const DX = 42;
const DY = -28;

function Container({ x, y, body, top, side, ribs }: Box & { ribs: string }) {
  return (
    <g>
      <polygon points={`${x},${y} ${x + W},${y} ${x + W + DX},${y + DY} ${x + DX},${y + DY}`} fill={top} />
      <polygon
        points={`${x + W},${y} ${x + W + DX},${y + DY} ${x + W + DX},${y + DY + H} ${x + W},${y + H}`}
        fill={side}
      />
      <rect x={x} y={y} width={W} height={H} fill={body} />
      <rect x={x} y={y} width={W} height={H} fill={`url(#${ribs})`} />
      <rect x={x} y={y} width={W} height={H} fill="none" stroke="rgba(0,0,0,.38)" strokeWidth="4" />
      <rect x={x} y={y + H - 7} width={W} height="7" fill="rgba(0,0,0,.35)" />
      <rect x={x} y={y} width={W} height="6" fill="rgba(255,255,255,.1)" />
    </g>
  );
}

export function HeroCloud() {
  return (
    <svg className={styles.cloud} data-m="cloud" viewBox="0 0 520 250" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cloudFill" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="230">
          <stop offset="0" stopColor="#fff1e9" />
          <stop offset="1" stopColor="#ffc2af" />
        </linearGradient>
      </defs>
      {/* Opaque fills + group opacity so overlapping shapes merge into one silhouette. */}
      <g fill="url(#cloudFill)" opacity="0.72">
        <circle cx="150" cy="150" r="62" />
        <circle cx="240" cy="108" r="88" />
        <circle cx="352" cy="132" r="72" />
        <circle cx="436" cy="168" r="48" />
        <rect x="96" y="150" width="390" height="70" rx="35" />
      </g>
    </svg>
  );
}

export function HeroContainers({ className = styles.crates }: { className?: string }) {
  const ribs = useId();
  return (
    <svg className={className} data-m="crates" viewBox="-90 0 500 540" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={ribs} width="13" height="10" patternUnits="userSpaceOnUse">
          <rect width="4" height="10" fill="rgba(0,0,0,.34)" />
          <rect x="4" width="2" height="10" fill="rgba(255,255,255,.07)" />
        </pattern>
      </defs>
      <ellipse cx="160" cy="530" rx="260" ry="14" fill="rgba(0,0,0,.25)" />
      <Container ribs={ribs} x={-60} y={434} body="#554a41" top="#85776b" side="#352e29" />
      <Container ribs={ribs} x={150} y={434} body="#3b3430" top="#6b5f56" side="#231f1c" />
      <Container ribs={ribs} x={150} y={338} body="#a23420" top="#cf5a42" side="#74210f" />
      <Container ribs={ribs} x={150} y={242} body="#4b433d" top="#7a6e64" side="#2c2622" />
      <Container ribs={ribs} x={150} y={146} body="#3b3430" top="#6b5f56" side="#231f1c" />
    </svg>
  );
}
