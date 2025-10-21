import { cn } from "@/lib/utils";

interface SuccessCheckmarkProps {
  className?: string;
  size?: number;
}

export const SuccessCheckmark = ({ className, size = 48 }: SuccessCheckmarkProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={cn("text-green-500", className)}
      fill="none"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="animate-scale-in"
      />
      <path
        d="M14 24l8 8 16-16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="checkmark"
        style={{ animationDelay: "0.2s" }}
      />
    </svg>
  );
};
