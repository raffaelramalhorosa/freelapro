import * as React from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, rippleColor = "rgba(255, 255, 255, 0.6)", onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "0";
      ripple.style.height = "0";
      ripple.className = "ripple";
      ripple.style.background = rippleColor;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn("ripple-container", className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
RippleButton.displayName = "RippleButton";

export { RippleButton };
