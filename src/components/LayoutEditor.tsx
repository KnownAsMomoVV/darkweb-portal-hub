
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, X, Move, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types/service';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface LayoutEditorProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  categories: string[];
  services: Service[];
  onSaveLayout: (newServices: Service[], newCategories: string[]) => void;
}

const LayoutEditor = ({ isEditing, onToggleEdit, categories, services, onSaveLayout }: LayoutEditorProps) => {
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editedCategories, setEditedCategories] = useState<string[]>(categories);
  const [editedServices, setEditedServices] = useState<Service[]>(services);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handlePasswordSubmit = () => {
    if (password === "momopc") {
      setShowPasswordDialog(false);
      setShowLayoutEditor(true);
      setEditedCategories([...categories]);
      setEditedServices([...services]);
      onToggleEdit();
      setIsAuthenticated(true);
      toast({
        title: "Edit mode enabled",
        description: "You can now customize your layout"
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (editedCategories.includes(newCategoryName.trim())) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive"
      });
      return;
    }
    
    setEditedCategories([...editedCategories, newCategoryName.trim()]);
    setNewCategoryName('');
    toast({
      title: "Category added",
      description: `"${newCategoryName.trim()}" has been added`
    });
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    // Check if category has services
    const hasServices = editedServices.some(service => service.category === categoryToRemove);
    
    if (hasServices) {
      toast({
        title: "Cannot remove category",
        description: "Please move or delete all services from this category first",
        variant: "destructive"
      });
      return;
    }
    
    setEditedCategories(editedCategories.filter(cat => cat !== categoryToRemove));
    toast({
      title: "Category removed",
      description: `"${categoryToRemove}" has been removed`
    });
  };
  
  const handleMoveService = (serviceId: string, newCategory: string) => {
    setEditedServices(
      editedServices.map(service => 
        service.id === serviceId ? { ...service, category: newCategory } : service
      )
    );
  };
  
  const handleSaveLayout = () => {
    onSaveLayout(editedServices, editedCategories);
    setShowLayoutEditor(false);
    toast({
      title: "Layout saved",
      description: "Your custom layout has been saved"
    });
  };

  const handleCancelEdit = () => {
    setShowLayoutEditor(false);
    onToggleEdit();
    setIsAuthenticated(false);
    toast({
      title: "Edit cancelled",
      description: "No changes were saved"
    });
  };
  
  const handleReopenEditor = () => {
    setShowLayoutEditor(true);
  };
  
  return (
    <>
      {isAuthenticated ? (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          {!showLayoutEditor && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-primary text-primary-foreground"
              onClick={handleReopenEditor}
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Layout
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isEditing ? 'bg-destructive text-destructive-foreground' : ''}`}
            onClick={handleCancelEdit}
          >
            <X className="mr-2 h-4 w-4" />
            Exit Editor
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 right-4 z-50"
          onClick={() => setShowPasswordDialog(true)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Layout
        </Button>
      )}
      
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Layout Editor</DialogTitle>
            <DialogDescription>
              Enter password to enable layout customization
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Unlock Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Sheet open={showLayoutEditor} onOpenChange={(isOpen) => {
        // Only allow closing from SheetClose component or explicit buttons
        // Prevent accidental closing by clicking outside
        if (!isOpen) {
          setShowLayoutEditor(false);
        }
      }}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Customize Layout</SheetTitle>
            <SheetDescription>
              Add categories and organize your services
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4 space-y-6">
            {/* Add new category */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add New Category</h3>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Category name" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            
            {/* Manage categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Manage Categories</h3>
              <div className="grid gap-2">
                {editedCategories.map(category => (
                  <Card key={category} className="bg-secondary/20">
                    <CardHeader className="p-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">{category}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Manage services */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Organize Services</h3>
              <div className="grid gap-2">
                {editedServices.map(service => (
                  <Card key={service.id} className="bg-background">
                    <CardHeader className="p-3 pb-1">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 pb-1">
                      <p className="text-xs text-muted-foreground">
                        Currently in: {service.category}
                      </p>
                    </CardContent>
                    <CardFooter className="p-3 pt-1">
                      <select 
                        className="w-full p-1 text-sm rounded border bg-background"
                        value={service.category}
                        onChange={(e) => handleMoveService(service.id, e.target.value)}
                      >
                        {editedCategories.map(cat => (
                          <option key={cat} value={cat}>
                            Move to: {cat}
                          </option>
                        ))}
                      </select>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveLayout}>
              Save Layout
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LayoutEditor;
