
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DraggableServiceCard from './DraggableServiceCard';
import { Service } from '@/types/service';

interface CategorySectionProps {
  title: string;
  services: Service[];
  isEditing: boolean;
  onReorderServices: (categoryName: string, reorderedServices: Service[]) => void;
}

const CategorySection = ({ title, services, isEditing, onReorderServices }: CategorySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categoryServices, setCategoryServices] = useState<Service[]>(services);
  const [draggedService, setDraggedService] = useState<string | null>(null);

  if (services.length === 0) return null;
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedService(id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    if (draggedService === null || draggedService === targetId) return;
    
    const sourceIndex = categoryServices.findIndex(service => service.id === draggedService);
    const targetIndex = categoryServices.findIndex(service => service.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    const newServicesList = [...categoryServices];
    const [movedService] = newServicesList.splice(sourceIndex, 1);
    newServicesList.splice(targetIndex, 0, movedService);
    
    setCategoryServices(newServicesList);
    onReorderServices(title, newServicesList);
    setDraggedService(null);
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
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
