import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      // Update dot position immediately
      setDotPosition({ x: e.clientX, y: e.clientY });
      
      // Update cursor position with delay
      timeoutId = setTimeout(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor circle */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-all duration-300 ease-out ${
          isHovering ? "custom-cursor-hover" : ""
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "40px",
          height: "40px",
          border: "2px solid rgba(99, 102, 241, 0.5)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
      />
      
      {/* Cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] bg-primary rounded-full"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          width: "6px",
          height: "6px",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};
