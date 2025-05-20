
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 py-4",
      isScrolled ? "bg-background/80 backdrop-blur-lg shadow-md" : ""
    )}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-8 w-full"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
