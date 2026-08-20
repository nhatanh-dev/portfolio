"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export default function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isMounted, setIsMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
    
    // Fallback if reduced motion or SSR
    if (reduceMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const maxIterations = 15;
    
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1/3;
    }, 40);

    return () => clearInterval(interval);
  }, [text, reduceMotion]);

  if (!isMounted) return <span className={className}>{text}</span>;

  return <span className={className}>{displayText}</span>;
}
