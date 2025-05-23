
import { ReactNode } from "react";

interface AnimatedIconProps {
  icon: ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
  animation?: "float" | "pulse" | "none";
}

const AnimatedIcon = ({ 
  icon, 
  color = "bg-primary", 
  size = "md", 
  animation = "float" 
}: AnimatedIconProps) => {
  const sizeClasses = {
    sm: "p-1.5 sm:p-2 text-lg sm:text-xl",
    md: "p-2 sm:p-3 text-xl sm:text-2xl",
    lg: "p-2.5 sm:p-4 text-2xl sm:text-3xl"
  };

  const animationClass = animation === "float" 
    ? "animate-float" 
    : animation === "pulse" 
      ? "animate-pulse-slow" 
      : "";

  return (
    <div className={`${color} ${sizeClasses[size]} rounded-full text-white shadow-md ${animationClass}`}>
      {icon}
    </div>
  );
};

export default AnimatedIcon;
