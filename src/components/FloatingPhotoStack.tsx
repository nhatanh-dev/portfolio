"use client";

import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FloatingPhotoStackProps {
  children: React.ReactNode;
  images: (string | StaticImageData)[];
}

export default function FloatingPhotoStack({ children, images }: FloatingPhotoStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const rawReduceMotion = useReducedMotion();

  useEffect(() => {
    // Check if device is touch/mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  if (isMobile) {
    return (
      <span className="block">
        <span className="font-semibold text-[var(--foreground)]">{children}</span>
        {images.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 snap-x">
            {images.map((src, idx) => (
              <div key={idx} className="relative aspect-video w-48 shrink-0 snap-start overflow-hidden rounded-md border border-[var(--border-strong)]">
                <Image src={src} alt="Photo" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-block font-semibold text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)] cursor-crosshair border-b border-dashed border-[var(--accent)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed pointer-events-none z-[100]"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              x: "-50%",
              y: "-100%", // Position above cursor
            }}
          >
            {/* Offset container slightly so it doesn't clip directly under mouse */}
            <div className="relative -top-6">
              {images.map((src, idx) => {
                // Calculate fan out angles: e.g., if 3 images: -10deg, 0deg, 10deg
                const spread = 15;
                const offset = images.length > 1 ? (idx - (images.length - 1) / 2) * spread : 0;
                
                return (
                  <motion.div
                    key={idx}
                    initial={rawReduceMotion ? { opacity: 1 } : { rotate: 0, y: 10 }}
                    animate={rawReduceMotion ? { opacity: 1 } : { rotate: offset, y: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: idx * 0.05 }}
                    className={`absolute origin-bottom-left w-56 aspect-[4/3] rounded-lg overflow-hidden border-4 border-white shadow-xl bg-white ${idx === 0 ? "relative" : "inset-0"}`}
                    style={{ zIndex: images.length - idx }}
                  >
                    {/* Grayscale filter that removes on slightly hovered/animated */}
                    <div className="relative w-full h-full grayscale mix-blend-multiply opacity-90 transition-all duration-500">
                      <Image src={src} alt="Polaroid photo" fill className="object-cover" sizes="224px" />
                      {/* Cyan Duotone Overlay */}
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-20 mix-blend-screen" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
