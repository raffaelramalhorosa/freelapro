import { useEffect, RefObject } from "react";

interface ParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal" | "both";
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
) => {
  const { speed = 0.5, direction = "vertical" } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let transform = "";

      if (direction === "vertical" || direction === "both") {
        transform += `translateY(${scrollY * speed}px) `;
      }

      if (direction === "horizontal" || direction === "both") {
        transform += `translateX(${scrollX * speed}px)`;
      }

      element.style.transform = transform.trim();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [ref, speed, direction]);
};
