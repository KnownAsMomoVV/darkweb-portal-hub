
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';
import LayoutEditor from '@/components/LayoutEditor';
import services from '@/data/services';
import { Service } from '@/types/service';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  // Load custom layout from local storage if available
  const [serviceLayout, setServiceLayout] = useLocalStorage<Service[]>('dashboard-services-layout', services);
  const [categoryLayout, setCategoryLayout] = useLocalStorage<string[]>('dashboard-categories-layout', []);
  
  const [filteredServices, setFilteredServices] = useState<Service[]>(serviceLayout);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  
  // Theme and animation states
  const [cardSize, setCardSize] = useState('Default');
  const [animationLevel, setAnimationLevel] = useState('default');
  const [cardOpacity, setCardOpacity] = useState(100);
  const [glassEffect, setGlassEffect] = useState(true);
  
  // Group services by category and set up categories
  useEffect(() => {
    // If we have saved categories, use those; otherwise, extract from services
    const uniqueCategories = categoryLayout.length > 0 
      ? categoryLayout 
      : [...new Set(serviceLayout.map(service => service.category))];
      
    setCategories(uniqueCategories);
    setFilteredServices(serviceLayout);
  }, [serviceLayout, categoryLayout]);
  
  // Load theme settings from localStorage
  useEffect(() => {
    // Apply saved theme if exists
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme) {
      // Find the theme in the themeColors array from LayoutEditor
      const themeColors = [
        { name: "Dark (Default)", primary: "hsl(0, 0%, 98%)", background: "hsl(240, 10%, 3.9%)" },
        { name: "Ocean", primary: "hsl(217, 91%, 60%)", background: "hsl(224, 71%, 4%)" },
        { name: "Forest", primary: "hsl(142, 71%, 45%)", background: "hsl(120, 24%, 5%)" },
        { name: "Sunset", primary: "hsl(20, 90%, 50%)", background: "hsl(0, 20%, 5%)" },
        { name: "Lavender", primary: "hsl(270, 80%, 70%)", background: "hsl(260, 30%, 7%)" },
        { name: "Mint", primary: "hsl(160, 60%, 50%)", background: "hsl(165, 30%, 7%)" }
      ];
      
      const theme = themeColors.find(t => t.name === savedTheme);
      if (theme) {
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.documentElement.style.setProperty('--background', theme.background);
      }
    }
    
    // Load other style preferences
    const savedCardSize = localStorage.getItem('dashboard-card-size');
    if (savedCardSize) setCardSize(savedCardSize);
    
    const savedAnimation = localStorage.getItem('dashboard-animation');
    if (savedAnimation) setAnimationLevel(savedAnimation);
    
    const savedOpacity = localStorage.getItem('dashboard-card-opacity');
    if (savedOpacity) setCardOpacity(parseInt(savedOpacity));
    
    const savedGlass = localStorage.getItem('dashboard-glass-effect');
    if (savedGlass) setGlassEffect(savedGlass === 'true');
  }, []);
  
  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredServices(serviceLayout);
      return;
    }
    
    const filtered = serviceLayout.filter(service => 
      service.name.toLowerCase().includes(term.toLowerCase()) || 
      service.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredServices(filtered);
  };
  
  const handleUpdateService = (id: string, updatedService: Partial<Service>) => {
    const updatedLayout = serviceLayout.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    );
    
    setServiceLayout(updatedLayout);
  };
  
  const handleSaveLayout = (newServices: Service[], newCategories: string[]) => {
    setServiceLayout(newServices);
    setCategoryLayout(newCategories);
  };
  
  // Generate CSS classes based on settings
  const getCardStyleClass = () => {
    const classes = ['transition-all duration-300'];
    
    // Card size classes
    if (cardSize === 'Compact') classes.push('scale-90');
    if (cardSize === 'Large') classes.push('scale-105');
    if (cardSize === 'Wide') classes.push('md:col-span-2');
    
    // Glass effect
    if (glassEffect) {
      classes.push('backdrop-blur-lg');
    } else {
      classes.push('bg-white/5');
    }
    
    // Opacity
    if (cardOpacity < 100) {
      classes.push(`opacity-${cardOpacity/10}`);
    }
    
    return classes.join(' ');
  };
  
  // Generate animation class
  const getAnimationClass = () => {
    switch (animationLevel) {
      case 'minimal': return 'animate-fade-in';
      case 'enhanced': return 'animate-scale-in hover:scale-105';
      default: return 'animate-scale-in';
    }
  };
  
  // Function to handle reordering services within a category
  const handleReorderServices = (categoryName: string, reorderedServices: Service[]) => {
    // This is a placeholder for the actual implementation
    console.log(`Reordering services in ${categoryName}`, reorderedServices);
  };
  
  return (
    <div className={`min-h-screen pb-12 transition-all duration-300`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Header onSearch={handleSearch} />
        
        <main>
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">No services found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search or add a new service.
              </p>
            </div>
          ) : (
            <>
              {categories.map(category => (
                <CategorySection
                  key={category}
                  title={category}
                  services={filteredServices.filter(s => s.category === category)}
                  isEditing={isEditingLayout}
                  onReorderServices={handleReorderServices}
                  onUpdateService={handleUpdateService}
                />
              ))}
            </>
          )}
        </main>
        
        <LayoutEditor 
          isEditing={isEditingLayout}
          onToggleEdit={() => setIsEditingLayout(!isEditingLayout)}
          categories={categories}
          services={serviceLayout}
          onSaveLayout={handleSaveLayout}
        />
      </div>
    </div>
  );
};

export default Dashboard;
