
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';
import LayoutEditor from '@/components/LayoutEditor';
import services from '@/data/services';
import { Service } from '@/types/service';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  
  // Load custom layout from local storage if available
  const [serviceLayout, setServiceLayout] = useLocalStorage<Service[]>('dashboard-services-layout', services);
  
  // Group services by category
  useEffect(() => {
    const uniqueCategories = [...new Set(serviceLayout.map(service => service.category))];
    setCategories(uniqueCategories);
    setFilteredServices(serviceLayout);
  }, [serviceLayout]);
  
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
  
  const handleReorderServices = (categoryName: string, reorderedServices: Service[]) => {
    const updatedLayout = [...serviceLayout];
    
    // Replace services in the specified category with reordered ones
    reorderedServices.forEach(service => {
      const index = updatedLayout.findIndex(s => s.id === service.id);
      if (index !== -1) {
        updatedLayout[index] = service;
      }
    });
    
    setServiceLayout(updatedLayout);
  };
  
  return (
    <div className="min-h-screen pb-12 transition-all duration-300">
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
                />
              ))}
            </>
          )}
        </main>
        
        <LayoutEditor 
          isEditing={isEditingLayout}
          onToggleEdit={() => setIsEditingLayout(!isEditingLayout)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
