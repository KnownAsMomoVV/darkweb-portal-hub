
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DraggableServiceCard from './DraggableServiceCard';
import { Service } from '@/types/service';

interface CategorySectionProps {
  title: string;
  services: Service[];
  isEditing: boolean;
  onReorderServices: (categoryName: string, reorderedServices: Service[]) => void;
  onUpdateService: (id: string, updatedService: Partial<Service>) => void;
}

const CategorySection = ({ 
  title, 
  services, 
  isEditing, 
  onReorderServices,
  onUpdateService 
}: CategorySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categoryServices, setCategoryServices] = useState<Service[]>(services);
  
  // Update local state when services prop changes
  useEffect(() => {
    setCategoryServices(services);
  }, [services]);

  if (services.length === 0) return null;
  
  const handleUpdateService = (id: string, updatedService: Partial<Service>) => {
    onUpdateService(id, updatedService);
  };
  
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
          {categoryServices.map((service) => (
            <DraggableServiceCard
              key={service.id}
              {...service}
              isEditing={isEditing}
              onDragStart={() => {}}
              onDragOver={() => {}}
              onDrop={() => {}}
              onUpdate={handleUpdateService}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
