import { useEffect, useState } from "react";

export const AnimatedGradient = () => {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPos({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-all duration-[3000ms] ease-in-out"
      style={{
        background: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
        zIndex: 1,
      }}
    />
  );
};
