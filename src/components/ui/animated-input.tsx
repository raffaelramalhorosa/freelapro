import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, icon, ...props }, ref) => {
    return (
      <div className="animated-input-wrapper">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          placeholder=" "
          className={cn(
            "animated-input peer",
            icon && "pl-10",
            className
          )}
          {...props}
        />
        <label className={cn("animated-label", icon && "left-10")}>
          {label}
        </label>
      </div>
    );
  }
);
AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
