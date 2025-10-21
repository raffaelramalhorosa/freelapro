import { useEffect, RefObject } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

export const useScrollReveal = (
  refs: RefObject<HTMLElement>[],
  options: ScrollRevealOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    direction = "up",
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            entry.target.classList.add(`reveal-${direction}`);
            
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove("reveal-visible");
          }
        });
      },
      { threshold, rootMargin }
    );

    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.classList.add("reveal-hidden");
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [refs, threshold, rootMargin, triggerOnce, direction]);
};
