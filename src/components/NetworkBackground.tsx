"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; isTechNode: boolean }[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 10000), 100);
    const connectionDistance = 150;
    
    // Tech colors: Cyan (Default), Docker Blue, C# Purple, AWS Orange, Postgres Blue
    const colors = [
      "rgba(98, 198, 223, 0.8)",   // Cyan
      "rgba(36, 150, 237, 0.8)",   // Docker Blue
      "rgba(155, 79, 150, 0.8)",   // C# Purple
      "rgba(255, 153, 0, 0.8)",    // AWS Orange
      "rgba(51, 103, 145, 0.8)",   // Postgres Blue
      "rgba(155, 93, 229, 0.8)"    // Violet
    ];

    const mouse = {
      x: width / 2,
      y: height / 2,
    };

    let isMouseActive = false;

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const isTechNode = Math.random() > 0.8; // 20% are special tech nodes
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: isTechNode ? Math.random() * 2 + 2 : Math.random() * 1.5 + 0.5,
          color: isTechNode ? colors[Math.floor(Math.random() * colors.length)] : "rgba(98, 198, 223, 0.4)",
          isTechNode
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMouseActive = true;
    };

    const onMouseLeave = () => {
      isMouseActive = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    let animationFrame: number;

    const animate = () => {
      if (rawReduceMotion) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;

        if (particles[i].x < 0 || particles[i].x > width) particles[i].vx *= -1;
        if (particles[i].y < 0 || particles[i].y > height) particles[i].vy *= -1;

        // Add glow to tech nodes via a second larger circle (shadowBlur crashes iOS Safari)
        if (particles[i].isTechNode) {
          ctx.beginPath();
          ctx.arc(particles[i].x, particles[i].y, particles[i].radius * 3, 0, Math.PI * 2);
          // Create a faint version of the color for the glow
          ctx.fillStyle = particles[i].color.replace("0.8", "0.2").replace("0.4", "0.1");
          ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = particles[i].color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Mix colors if one is a tech node
            const alpha = 0.15 - (dist / connectionDistance) * 0.15;
            if (particles[i].isTechNode) {
               ctx.strokeStyle = particles[i].color.replace("0.8", alpha.toString());
            } else if (particles[j].isTechNode) {
               ctx.strokeStyle = particles[j].color.replace("0.8", alpha.toString());
            } else {
               ctx.strokeStyle = `rgba(98, 198, 223, ${alpha})`;
            }
            
            ctx.stroke();
          }
        }
        
        if (isMouseActive) {
          const mouseDx = particles[i].x - mouse.x;
          const mouseDy = particles[i].y - mouse.y;
          const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
          
          if (mouseDist < 180) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(98, 198, 223, ${0.3 - mouseDist / 180 * 0.3})`;
              ctx.stroke();
              
              // Magnetic repulsion/attraction
              particles[i].x -= mouseDx * 0.01;
              particles[i].y -= mouseDy * 0.01;
          }
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      if (window.innerWidth === width) return; // Ignore vertical resize (iOS URL bar)
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [rawReduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-90" aria-hidden="true" />;
}
