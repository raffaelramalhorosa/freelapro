import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  opacity: number;
  phase: number;
}

export const AnimatedDotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createDots();
    };

    // Create grid of dots
    const createDots = () => {
      dotsRef.current = [];
      const spacing = 40;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dotsRef.current.push({
            x: i * spacing,
            y: j * spacing,
            baseSize: 2,
            size: 2,
            opacity: 0.3,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Mouse move handler with throttling
    let mouseThrottle: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseThrottle) return;
      
      mouseThrottle = window.setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        mouseThrottle = null;
      }, 16); // ~60fps throttle
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation loop with FPS limit
    const animate = () => {
      if (!ctx || !canvas) return;

      frameRef.current++;
      
      // Limit to 30 FPS for better performance
      if (frameRef.current % 2 !== 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render only every 3rd dot for performance
      dotsRef.current.forEach((dot, index) => {
        if (index % 3 !== 0) return;

        // Wave motion
        const waveOffset = Math.sin(frameRef.current * 0.02 + dot.y * 0.01) * 0.5;

        // Pulse animation
        const pulseScale = 1 + Math.sin(frameRef.current * 0.05 + dot.phase) * 0.3;

        // Glow effect
        const glowIntensity =
          Math.sin(frameRef.current * 0.03 + index * 0.1) > 0.7
            ? 0.8
            : 0.3;

        // Mouse interaction
        const dx = mouseRef.current.x - dot.x;
        const dy = mouseRef.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        let mouseScale = 1;
        let mouseGlow = 0;

        if (distance < maxDistance) {
          const influence = 1 - distance / maxDistance;
          mouseScale = 1 + influence * 1.5;
          mouseGlow = influence * 0.6;
        }

        // Calculate final values
        const finalSize = dot.baseSize * pulseScale * mouseScale;
        const finalOpacity = Math.min(
          glowIntensity + mouseGlow + waveOffset,
          1
        );

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${finalOpacity})`;
        ctx.fill();

        // Draw connecting lines only when mouse is near
        if (distance < 80 && mouseGlow > 0.3) {
          dotsRef.current.forEach((otherDot, otherIndex) => {
            if (otherIndex <= index || otherIndex % 3 !== 0) return;

            const odx = otherDot.x - dot.x;
            const ody = otherDot.y - dot.y;
            const oDist = Math.sqrt(odx * odx + ody * ody);

            if (oDist < 80) {
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(otherDot.x, otherDot.y);
              ctx.strokeStyle = `rgba(99, 102, 241, ${mouseGlow * 0.3})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mouseThrottle) {
        clearTimeout(mouseThrottle);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};
