"use client";

// Tech Stack: Dot Matrix
export function StackBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" aria-hidden="true">
      <svg width="100%" height="100%">
        <pattern id="dot-matrix" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-[var(--accent)]" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dot-matrix)" />
      </svg>
      {/* Subtle glowing orb in top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
    </div>
  );
}

// Experience: Aurora Gradient
export function ExperienceBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[rgba(98,198,223,0.06)] blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[rgba(155,93,229,0.05)] blur-[120px] rounded-full mix-blend-screen" />
    </div>
  );
}

// Projects: Topography Lines (Simulated with SVG lines)
export function ProjectsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <pattern id="diagonal-stripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" className="text-[var(--accent)]" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
      </svg>
      {/* Mask gradient so it fades out at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_80%)]" />
    </div>
  );
}

// Education: Blueprint Grid
export function EducationBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0" aria-hidden="true">
      <svg width="100%" height="100%">
        <pattern id="blueprint-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--accent)]" />
          {/* Inner small grid */}
          <path d="M 15 0 L 15 60 M 30 0 L 30 60 M 45 0 L 45 60 M 0 15 L 60 15 M 0 30 L 60 30 M 0 45 L 60 45" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-[var(--accent)]" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      </svg>
    </div>
  );
}
