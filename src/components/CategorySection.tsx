
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { Service } from '@/types/service';

interface CategorySectionProps {
  title: string;
  services: Service[];
}

const CategorySection = ({ title, services }: CategorySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (services.length === 0) return null;
  
  return (
    <div className="mb-10 animate-fade-in">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <button className="p-1 rounded-full hover:bg-secondary">
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
