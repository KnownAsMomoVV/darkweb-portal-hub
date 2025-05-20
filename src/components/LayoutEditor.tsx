
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTabs } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, X, Settings, MoveUp, MoveDown, Palette, Layout, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types/service';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface LayoutEditorProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  categories: string[];
  services: Service[];
  onSaveLayout: (newServices: Service[], newCategories: string[]) => void;
}

// Theme options
const themeColors = [
  { name: "Dark (Default)", primary: "hsl(0, 0%, 98%)", background: "hsl(240, 10%, 3.9%)" },
  { name: "Ocean", primary: "hsl(217, 91%, 60%)", background: "hsl(224, 71%, 4%)" },
  { name: "Forest", primary: "hsl(142, 71%, 45%)", background: "hsl(120, 24%, 5%)" },
  { name: "Sunset", primary: "hsl(20, 90%, 50%)", background: "hsl(0, 20%, 5%)" },
  { name: "Lavender", primary: "hsl(270, 80%, 70%)", background: "hsl(260, 30%, 7%)" },
  { name: "Mint", primary: "hsl(160, 60%, 50%)", background: "hsl(165, 30%, 7%)" }
];

// Card size options
const cardSizeOptions = [
  { name: "Default", class: "" },
  { name: "Compact", class: "compact" },
  { name: "Large", class: "large" },
  { name: "Wide", class: "wide" }
];

// Animation level options
const animationOptions = [
  { name: "Minimal", value: "minimal" },
  { name: "Default", value: "default" },
  { name: "Enhanced", value: "enhanced" }
];

const LayoutEditor = ({ isEditing, onToggleEdit, categories, services, onSaveLayout }: LayoutEditorProps) => {
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editedCategories, setEditedCategories] = useState<string[]>(categories);
  const [editedServices, setEditedServices] = useState<Service[]>(services);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("layout");
  const [selectedTheme, setSelectedTheme] = useState("Dark (Default)");
  const [selectedCardSize, setSelectedCardSize] = useState("Default");
  const [animationLevel, setAnimationLevel] = useState("default");
  const [cardOpacity, setCardOpacity] = useState(100);
  const [enableGlass, setEnableGlass] = useState(true);
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
    // Save theme preferences to localStorage
    localStorage.setItem('dashboard-theme', selectedTheme);
    localStorage.setItem('dashboard-card-size', selectedCardSize);
    localStorage.setItem('dashboard-animation', animationLevel);
    localStorage.setItem('dashboard-card-opacity', cardOpacity.toString());
    localStorage.setItem('dashboard-glass-effect', enableGlass.toString());
    
    // Apply the theme immediately
    applyTheme(selectedTheme);
    
    // Save layout
    onSaveLayout(editedServices, editedCategories);
    setShowLayoutEditor(false);
    toast({
      title: "Layout saved",
      description: "Your custom layout and theme have been saved"
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
  
  const moveCategoryUp = (index: number) => {
    if (index <= 0) return;
    const newCategories = [...editedCategories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;
    setEditedCategories(newCategories);
  };
  
  const moveCategoryDown = (index: number) => {
    if (index >= editedCategories.length - 1) return;
    const newCategories = [...editedCategories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;
    setEditedCategories(newCategories);
  };
  
  const applyTheme = (themeName: string) => {
    const theme = themeColors.find(t => t.name === themeName);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primary);
      document.documentElement.style.setProperty('--background', theme.background);
    }
  };
  
  // Attempt to load saved theme settings on component mount
  useState(() => {
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme) setSelectedTheme(savedTheme);
    
    const savedCardSize = localStorage.getItem('dashboard-card-size');
    if (savedCardSize) setSelectedCardSize(savedCardSize);
    
    const savedAnimation = localStorage.getItem('dashboard-animation');
    if (savedAnimation) setAnimationLevel(savedAnimation);
    
    const savedOpacity = localStorage.getItem('dashboard-card-opacity');
    if (savedOpacity) setCardOpacity(parseInt(savedOpacity));
    
    const savedGlass = localStorage.getItem('dashboard-glass-effect');
    if (savedGlass) setEnableGlass(savedGlass === 'true');
  });
  
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
            <SheetTitle>Customize Dashboard</SheetTitle>
            <SheetDescription>
              Arrange categories, services, and customize appearance
            </SheetDescription>
          </SheetHeader>
          
          <Tabs 
            defaultValue="layout" 
            className="w-full mt-6"
            value={currentTab}
            onValueChange={setCurrentTab}
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="layout">
                <Layout className="mr-2 h-4 w-4" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="theme">
                <Palette className="mr-2 h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="animation">
                <Sparkles className="mr-2 h-4 w-4" />
                Effects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="layout" className="space-y-6 mt-2">
              {/* Layout Tab - Categories & Services */}
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
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Arrange Categories</h3>
                <div className="grid gap-2">
                  {editedCategories.map((category, index) => (
                    <Card key={category} className="bg-secondary/20">
                      <CardHeader className="p-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">{category}</h4>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveCategoryUp(index)}
                              disabled={index === 0}
                              className="h-8 w-8 p-0"
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => moveCategoryDown(index)}
                              disabled={index === editedCategories.length - 1}
                              className="h-8 w-8 p-0"
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveCategory(category)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
              
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
            </TabsContent>
            
            <TabsContent value="theme" className="space-y-6 mt-2">
              {/* Theme Tab - Color & Style */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Color Theme</h3>
                <RadioGroup 
                  defaultValue={selectedTheme} 
                  value={selectedTheme}
                  onValueChange={setSelectedTheme}
                  className="grid grid-cols-2 gap-2"
                >
                  {themeColors.map(theme => (
                    <div key={theme.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={theme.name} id={`theme-${theme.name}`} />
                      <Label htmlFor={`theme-${theme.name}`} className="cursor-pointer flex items-center gap-1.5">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{backgroundColor: theme.primary}}
                        />
                        <span>{theme.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Card Size</h3>
                <RadioGroup 
                  defaultValue={selectedCardSize} 
                  value={selectedCardSize}
                  onValueChange={setSelectedCardSize}
                  className="grid grid-cols-2 gap-2"
                >
                  {cardSizeOptions.map(size => (
                    <div key={size.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={size.name} id={`size-${size.name}`} />
                      <Label htmlFor={`size-${size.name}`}>{size.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Card Transparency</h3>
                <div className="flex flex-col space-y-2">
                  <Slider
                    value={[cardOpacity]}
                    min={30}
                    max={100}
                    step={5}
                    onValueChange={(value) => setCardOpacity(value[0])}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">
                    {cardOpacity}% opacity
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="glass-effect" className="text-sm font-medium">
                    Glass Effect
                  </Label>
                  <Switch
                    id="glass-effect"
                    checked={enableGlass}
                    onCheckedChange={setEnableGlass}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="animation" className="space-y-6 mt-2">
              {/* Animation Tab */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Animation Style</h3>
                <RadioGroup 
                  defaultValue={animationLevel} 
                  value={animationLevel}
                  onValueChange={setAnimationLevel}
                >
                  {animationOptions.map(option => (
                    <div key={option.name} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={option.value} id={`animation-${option.value}`} />
                      <Label htmlFor={`animation-${option.value}`}>{option.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {animationLevel === "minimal" && "Simple animations with minimal effects."}
                  {animationLevel === "default" && "Balanced animations that enhance the experience."}
                  {animationLevel === "enhanced" && "Rich animations with more dynamic effects."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveLayout}>
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LayoutEditor;
