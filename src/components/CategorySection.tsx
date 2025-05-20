
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
  cardStyleClass?: string;
  animationClass?: string;
}

const CategorySection = ({ 
  title, 
  services, 
  isEditing, 
  onReorderServices,
  onUpdateService,
  cardStyleClass = '',
  animationClass = 'animate-scale-in'
}: CategorySectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  
  // Update local state when services prop changes
  useEffect(() => {
    setCategoryServices(services);
  }, [services]);

  if (services.length === 0) return null;
  
  const handleUpdateService = (id: string, updatedService: Partial<Service>) => {
    if (onUpdateService) {
      onUpdateService(id, updatedService);
    }
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItemId || draggedItemId === targetId) {
      return;
    }
    
    const newOrder = [...categoryServices];
    const draggedItemIndex = newOrder.findIndex(service => service.id === draggedItemId);
    const targetIndex = newOrder.findIndex(service => service.id === targetId);
    
    if (draggedItemIndex === -1 || targetIndex === -1) {
      return;
    }
    
    // Reorder the services
    const [draggedItem] = newOrder.splice(draggedItemIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setCategoryServices(newOrder);
    onReorderServices(title, newOrder);
    setDraggedItemId(null);
  };
  
  return (
    <div className="mb-10 animate-fade-in">
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <button className="p-1 rounded-full hover:bg-secondary" type="button">
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryServices.map((service) => (
            <DraggableServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description}
              icon={service.icon}
              url={service.url}
              category={service.category}
              isEditing={isEditing}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onUpdate={handleUpdateService}
              styleClass={cardStyleClass || ''}
              animationClass={animationClass || ''}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
