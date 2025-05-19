
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';
import services from '@/data/services';
import { Service } from '@/types/service';

const Dashboard = () => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Group services by category
  useEffect(() => {
    const uniqueCategories = [...new Set(services.map(service => service.category))];
    setCategories(uniqueCategories);
  }, []);
  
  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredServices(services);
      return;
    }
    
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(term.toLowerCase()) || 
      service.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredServices(filtered);
  };
  
  return (
    <div className="min-h-screen pb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                />
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
