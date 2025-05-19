
import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '@/types/service';
import { cn } from '@/lib/utils';

interface DraggableServiceCardProps extends Service {
  isEditing: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

const DraggableServiceCard = ({
  id,
  name,
  description,
  icon,
  url,
  category,
  isEditing,
  onDragStart,
  onDragOver,
  onDrop
}: DraggableServiceCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, id);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <div
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      className={cn(
        "transition-all duration-300",
        isEditing && "cursor-grab",
        isDragging && "opacity-50",
        isEditing && "relative"
      )}
    >
      {isEditing && (
        <div className="absolute -top-2 -right-2 bg-secondary text-xs px-2 py-1 rounded-full z-10">
          Drag to rearrange
        </div>
      )}
      <ServiceCard
        id={id}
        name={name}
        description={description}
        icon={icon}
        url={url}
        category={category}
      />
    </div>
  );
};

export default DraggableServiceCard;
