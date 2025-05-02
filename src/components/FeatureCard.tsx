
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
    <div className={`feature-card ${bgClass} ${borderClass} rounded-xl shadow-feature p-6 h-full flex flex-col`}>
      <div className="mb-4">
        <AnimatedIcon 
          icon={icon} 
          color={iconColor || (type === "traditional" ? "bg-gray-500" : "bg-primary")}
          animation={type === "traditional" ? "none" : "float"}
        />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${type === "enhanced" ? "text-primary" : ""}`}>{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  );
};

export default FeatureCard;
