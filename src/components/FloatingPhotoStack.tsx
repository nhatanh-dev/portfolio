"use client";

import { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const rawReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // The Lightbox Modal
  const Lightbox = () => (
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
            onClick={(e) => e.stopPropagation()} // Prevent click from closing
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
    </AnimatePresence>
  );

  if (isMobile) {
    return (
      <span className="block">
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
      </span>
    );
  }

  return (
    <>
      <span
        ref={containerRef}
        className="relative inline-block font-semibold text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)] cursor-pointer border-b border-dashed border-[var(--accent)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredPhotoIndex(null);
        }}
      >
        <span onClick={() => { setCurrentIndex(0); setIsOpen(true); }}>
          {children}
        </span>

        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute left-1/2 bottom-full mb-4 -translate-x-1/2 z-[100] w-64 h-48"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {images.map((src, idx) => {
                  const spread = 12;
                  const baseOffset = images.length > 1 ? (idx - (images.length - 1) / 2) * spread : 0;
                  
                  // Logic for interaction
                  const isPhotoHovered = hoveredPhotoIndex === idx;
                  const isAnyHovered = hoveredPhotoIndex !== null;
                  
                  // Only first image is colored by default, others grayscale
                  // Unless hovered, then hovered is colored, others grayscale
                  const shouldBeColor = isAnyHovered ? isPhotoHovered : idx === 0;
                  
                  // Hovered image comes to front
                  const zIndex = isPhotoHovered ? 50 : images.length - idx;
                  
                  // Hovered image pops up and straightens
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
        </AnimatePresence>
      </span>
      <Lightbox />
    </>
  );
}
