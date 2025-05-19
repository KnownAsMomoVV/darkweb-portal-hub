
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [time, setTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  
  return (
    <header className="py-4 px-6 flex flex-col md:flex-row items-center justify-between mb-8 animate-fade-in">
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Hub</h1>
        <p className="text-muted-foreground text-sm">{formattedDate} · {formattedTime}</p>
      </div>
      
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          className="pl-10 bg-secondary border-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </header>
  );
};

export default Header;
