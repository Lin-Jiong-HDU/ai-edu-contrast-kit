
import { ReactNode } from "react";
import AnimatedIcon from "./AnimatedIcon";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  type: "traditional" | "enhanced";
}

const FeatureCard = ({
  title,
  description,
  icon,
  iconColor,
  type
}: FeatureCardProps) => {
  const bgClass = type === "traditional" 
    ? "bg-white" 
    : "bg-gradient-to-br from-primary/10 to-secondary/10";
  
  const borderClass = type === "traditional" 
    ? "border border-gray-200" 
    : "border border-primary/30";

  return (
    <div className={`feature-card ${bgClass} ${borderClass} rounded-xl shadow-feature p-3 sm:p-4 md:p-6 h-full flex flex-col`}>
      <div className="mb-3 md:mb-4">
        <AnimatedIcon 
          icon={icon} 
          color={iconColor || (type === "traditional" ? "bg-gray-500" : "bg-primary")}
          size="sm" 
          animation={type === "traditional" ? "none" : "float"}
        />
      </div>
      <h3 className={`text-lg md:text-xl font-semibold mb-1.5 md:mb-2 ${type === "enhanced" ? "text-primary" : ""}`}>{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground flex-grow">{description}</p>
    </div>
  );
};

export default FeatureCard;
