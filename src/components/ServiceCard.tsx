
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  category: string;
  styleClass?: string;
  animationClass?: string;
}

const ServiceCard = ({ 
  name, 
  description, 
  icon, 
  url, 
  styleClass = "", 
  animationClass = "animate-scale-in" 
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Ensure icon is a valid React element
  const iconElement = icon ? icon : null;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "glass-card p-5 rounded-lg flex flex-col items-center text-center transition-all duration-300",
        "hover:bg-white/10 hover:shadow-lg group",
        animationClass,
        styleClass
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-secondary",
          "transition-all duration-300 group-hover:text-white",
          isHovered ? "bg-white/20" : ""
        )}
      >
        {iconElement}
      </div>
      
      <h3 className="font-medium text-lg mb-1">{name}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
      
      <div className={cn(
        "mt-3 px-3 py-1 text-xs rounded-full transition-all duration-300 opacity-0",
        "bg-white/10 text-white/80",
        isHovered ? "opacity-100" : ""
      )}>
        Visit
      </div>
    </a>
  );
};

export default ServiceCard;
