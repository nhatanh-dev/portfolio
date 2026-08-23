"use client";

import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

interface FloatingPhotoStackProps {
  children: React.ReactNode;
  images: (string | StaticImageData)[];
}

export default function FloatingPhotoStack({ children, images }: FloatingPhotoStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const rawReduceMotion = useReducedMotion();

  useEffect(() => {
    setPortalRoot(document.body);
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update rect on scroll or when entering
  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current && isHovered) {
        setRect(containerRef.current.getBoundingClientRect());
      }
    };
    if (isHovered) {
      updateRect();
      window.addEventListener("scroll", updateRect, { passive: true });
      window.addEventListener("resize", updateRect);
    }
    return () => {
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [isHovered]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // The Lightbox Modal
  const Lightbox = () => {
    if (!portalRoot) return null;
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-[var(--accent)] transition-colors p-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>
            
            <div 
              className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-video flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={images[currentIndex]} 
                alt="Gallery image" 
                fill 
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {images.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-12 pointer-events-none">
                <button 
                  onClick={prevImage}
                  className="pointer-events-auto p-3 rounded-full bg-black/50 text-white hover:bg-[var(--accent)] hover:text-black transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="pointer-events-auto p-3 rounded-full bg-black/50 text-white hover:bg-[var(--accent)] hover:text-black transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
            
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-y-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`block w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[var(--accent)]' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      portalRoot
    );
  };

  if (isMobile) {
    return (
      <div className="block">
        <span className="font-semibold text-[var(--foreground)]">{children}</span>
        {images.length > 0 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 snap-x">
            {images.map((src, idx) => (
              <div 
                key={idx} 
                onClick={() => { setCurrentIndex(idx); setIsOpen(true); }}
                className="relative aspect-video w-56 shrink-0 snap-start overflow-hidden rounded-md border border-[var(--border-strong)] cursor-pointer"
              >
                <Image src={src} alt="Photo" fill className="object-cover transition-transform hover:scale-105" />
              </div>
            ))}
          </div>
        )}
        <Lightbox />
      </div>
    );
  }

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (containerRef.current) setRect(containerRef.current.getBoundingClientRect());
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
      setHoveredPhotoIndex(null);
    }, 150);
  };

  // The floating stack rendered in a portal to escape overflow-hidden
  const StackPortal = () => {
    if (!portalRoot || !rect) return null;
    
    // We use absolute positioning relative to the document body.
    // window.scrollY + rect.top gives us the absolute top coordinate on the page.
    const absoluteTop = window.scrollY + rect.top;
    const absoluteLeft = window.scrollX + rect.left + rect.width / 2;

    return createPortal(
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute z-[100] w-64 h-48 -translate-x-1/2"
            style={{
              top: absoluteTop - 16,
              left: absoluteLeft,
              y: "-100%", // Move it up by its own height
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {images.map((src, idx) => {
                const spread = 12;
                const baseOffset = images.length > 1 ? (idx - (images.length - 1) / 2) * spread : 0;
                
                const isPhotoHovered = hoveredPhotoIndex === idx;
                const isAnyHovered = hoveredPhotoIndex !== null;
                const shouldBeColor = isAnyHovered ? isPhotoHovered : idx === 0;
                
                const zIndex = isPhotoHovered ? 50 : images.length - idx;
                const yOffset = isPhotoHovered ? -20 : 0;
                const rotateOffset = isPhotoHovered ? 0 : baseOffset;
                const scaleOffset = isPhotoHovered ? 1.05 : 1;

                return (
                  <motion.div
                    key={idx}
                    initial={rawReduceMotion ? { opacity: 1 } : { rotate: 0, y: 10 }}
                    animate={rawReduceMotion ? { opacity: 1 } : { rotate: rotateOffset, y: yOffset, scale: scaleOffset }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className={`absolute w-56 aspect-[4/3] rounded-lg overflow-hidden border-[3px] border-[var(--surface)] shadow-2xl bg-[var(--surface)] cursor-pointer`}
                    style={{ zIndex }}
                    onMouseEnter={() => setHoveredPhotoIndex(idx)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                      setIsOpen(true);
                      setIsHovered(false); // Close popover when lightbox opens
                    }}
                  >
                    <div className={`relative w-full h-full transition-all duration-300 ${shouldBeColor ? 'grayscale-0' : 'grayscale'}`}>
                      <Image src={src} alt="Polaroid photo" fill className="object-cover pointer-events-none" sizes="224px" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      portalRoot
    );
  };

  return (
    <>
      <span
        ref={containerRef}
        className="relative inline-block font-semibold text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)] cursor-pointer border-b border-dashed border-[var(--accent)]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span onClick={() => { setCurrentIndex(0); setIsOpen(true); setIsHovered(false); }}>
          {children}
        </span>
      </span>
      <StackPortal />
      <Lightbox />
    </>
  );
}
