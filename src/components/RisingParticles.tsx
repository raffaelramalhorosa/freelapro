import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

export const RisingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      "rgba(99, 102, 241, 0.6)",
      "rgba(168, 85, 247, 0.6)",
      "rgba(236, 72, 153, 0.6)",
    ];

    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));

    setParticles(initialParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 w-1.5 h-1.5 rounded-full animate-rise"
          style={{
            left: `${particle.x}%`,
            background: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
