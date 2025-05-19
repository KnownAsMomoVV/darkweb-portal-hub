
import { useState } from 'react';
import ServiceCard from './ServiceCard';
import { Service } from '@/types/service';
import { cn } from '@/lib/utils';
import { Edit, Link } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface DraggableServiceCardProps extends Service {
  isEditing: boolean;
  allCategories: string[];
  onUpdate?: (id: string, updatedService: Partial<Service>) => void;
}

const DraggableServiceCard = ({
  id,
  name,
  description,
  icon,
  url,
  category,
  isEditing,
  allCategories,
  onUpdate
}: DraggableServiceCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name,
      description,
      url,
      category
    }
  });
  
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
  
  return (
    <>
      <div className={cn(
        "transition-all duration-300",
        isEditing && "relative"
      )}>
        {isEditing && (
          <button 
            className="absolute top-2 right-2 bg-primary/80 p-1.5 rounded-full z-10 hover:bg-primary transition-colors"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit size={14} className="text-white" />
          </button>
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
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
