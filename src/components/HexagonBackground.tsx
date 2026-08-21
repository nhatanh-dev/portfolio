"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const hexRadius = 35;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 0.75;

    let cols = Math.ceil(width / horizDist) + 2;
    let rows = Math.ceil(height / vertDist) + 2;

    const mouse = { x: width / 2, y: -height, targetX: width / 2, targetY: -height };
    let isMouseIn = false;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      isMouseIn = true;
    };

    const onMouseLeave = () => {
      isMouseIn = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const drawHexagon = (x: number, y: number, radius: number, glow: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i);
        const xPos = x + radius * Math.cos(angle);
        const yPos = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
      
      const baseAlpha = 0.03;
      const highlightAlpha = glow * 0.5;
      
      // Secondary Accent: Deep Violet highlight for variation
      if (glow > 0.6) {
        ctx.strokeStyle = `rgba(155, 93, 229, ${baseAlpha + highlightAlpha})`;
      } else {
        ctx.strokeStyle = `rgba(98, 198, 223, ${baseAlpha + highlightAlpha})`;
      }
      
      ctx.lineWidth = 1 + glow * 1.5;
      ctx.stroke();

      if (glow > 0) {
        ctx.fillStyle = `rgba(98, 198, 223, ${glow * 0.1})`;
        ctx.fill();
      }
    };

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      if (rawReduceMotion) {
        // Just draw a static grid for reduced motion
        ctx.clearRect(0, 0, width, height);
        for (let r = -1; r < rows; r++) {
          for (let c = -1; c < cols; c++) {
            const x = c * horizDist;
            const y = r * vertDist + (c % 2 === 1 ? vertDist / 2 : 0);
            drawHexagon(x, y, hexRadius * 0.95, 0);
          }
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);
      
      // Smooth mouse follow
      if (isMouseIn) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        mouse.x += (width / 2 - mouse.x) * 0.02;
        mouse.y += (-height - mouse.y) * 0.02;
      }

      time += 0.01;

      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const x = c * horizDist;
          const y = r * vertDist + (c % 2 === 1 ? vertDist / 2 : 0);
          
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Wave effect base
          const wave = Math.sin(x * 0.005 + y * 0.005 + time) * 0.5 + 0.5;
          
          // Mouse interaction glow (radius of ~250px)
          let glow = Math.max(0, 1 - dist / 250);
          
          // Combine wave and glow, but mouse takes precedence
          glow = Math.max(wave * 0.1, glow);
          
          // Slightly shrink hexes that are glowing for a pulsing feel
          const currentRadius = hexRadius * (0.95 - glow * 0.1);

          drawHexagon(x, y, currentRadius, glow);
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / horizDist) + 2;
      rows = Math.ceil(height / vertDist) + 2;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [rawReduceMotion]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none opacity-80"
      aria-hidden="true" 
    />
  );
}
