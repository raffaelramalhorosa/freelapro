import { useEffect, RefObject } from "react";

export const useMagneticEffect = (
  ref: RefObject<HTMLElement>,
  strength: number = 0.3
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Magnetic effect within 150px
      if (distance < 150) {
        const pull = (150 - distance) / 150;
        const moveX = deltaX * pull * strength;
        const moveY = deltaY * pull * strength;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        element.style.transform = "translate(0, 0)";
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0, 0)";
    };

    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, strength]);
};
