import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const MouseTrail = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let particleId = 0;
    const colors = [
      "rgba(99, 102, 241, 0.6)",
      "rgba(168, 85, 247, 0.6)",
      "rgba(236, 72, 153, 0.6)",
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    };

    // Throttle mouse move events
    let lastTime = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 50) {
        handleMouseMove(e);
        lastTime = now;
      }
    };

    document.addEventListener("mousemove", throttledMouseMove);

    return () => {
      document.removeEventListener("mousemove", throttledMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-trail-fade"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            background: particle.color,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};
