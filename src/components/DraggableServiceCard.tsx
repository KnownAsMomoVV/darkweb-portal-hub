
import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '@/types/service';
import { cn } from '@/lib/utils';
import { Edit, Link, Calendar, Database, Cloud, Image, ShoppingCart, Monitor, Lock, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface DraggableServiceCardProps extends Service {
  isEditing: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onUpdate?: (id: string, updatedService: Partial<Service>) => void;
}

// Helper function to get icon component by name
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    Calendar: <Calendar className="h-7 w-7" />,
    Database: <Database className="h-7 w-7" />,
    Cloud: <Cloud className="h-7 w-7" />,
    Image: <Image className="h-7 w-7" />,
    ShoppingCart: <ShoppingCart className="h-7 w-7" />,
    Monitor: <Monitor className="h-7 w-7" />,
    Lock: <Lock className="h-7 w-7" />,
    Settings: <Settings className="h-7 w-7" />,
  };

  return iconMap[iconName] || <Settings className="h-7 w-7" />;
};

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
  onDrop,
  onUpdate
}: DraggableServiceCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name,
      description,
      url
    }
  });
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(e, id);
  };
  
  const handleEditSubmit = (data: any) => {
    if (onUpdate) {
      onUpdate(id, data);
      toast({
        title: "Service updated",
        description: `${data.name} has been updated successfully.`
      });
      setShowEditDialog(false);
    }
  };
  
  // Ensure icon is a valid React element
  const safeIcon = typeof icon === 'string' 
    ? getIconComponent(icon as string)
    : (React.isValidElement(icon) ? icon : <Settings className="h-7 w-7" />);
  
  return (
    <>
      <div
        draggable={isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "transition-all duration-300",
          isEditing && "cursor-grab",
          isDragging && "opacity-50",
          isEditing && "relative"
        )}
      >
        {isEditing && (
          <>
            <div className="absolute -top-2 -right-2 bg-secondary text-xs px-2 py-1 rounded-full z-10">
              Drag to rearrange
            </div>
            <button 
              className="absolute top-2 right-2 bg-primary/80 p-1.5 rounded-full z-10 hover:bg-primary transition-colors"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit size={14} className="text-white" />
            </button>
          </>
        )}
        <ServiceCard
          id={id}
          name={name}
          description={description}
          icon={safeIcon}
          url={url}
          category={category}
        />
      </div>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Link size={16} className="text-muted-foreground" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DraggableServiceCard;
