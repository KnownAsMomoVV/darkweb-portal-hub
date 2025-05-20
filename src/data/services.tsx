
import { 
  Calendar, 
  Database, 
  Cloud, 
  Image, 
  ShoppingCart, 
  Monitor, 
  Lock, 
  Settings 
} from 'lucide-react';
import { Service } from '@/types/service';

const services: Service[] = [
  {
    id: '1',
    name: 'Time Tracker',
    description: 'Track time for honorary work',
    icon: <Calendar className="h-7 w-7" />,
    url: 'https://time.momoh.de',
    category: 'Productivity'
  },
  {
    id: '2',
    name: 'Wishlist',
    description: 'Keep track of wanted items',
    icon: <ShoppingCart className="h-7 w-7" />,
    url: 'https://wish.momoh.de',
    category: 'Personal'
  },
  {
    id: '3',
    name: 'Portainer',
    description: 'Container management',
    icon: <Monitor className="h-7 w-7" />,
    url: 'https://port.momoh.de',
    category: 'Infrastructure'
  },
  {
    id: '4',
    name: 'Portfolio',
    description: 'Personal portfolio site',
    icon: <Image className="h-7 w-7" />,
    url: 'https://momoh.de',
    category: 'Personal'
  },
  {
    id: '5',
    name: 'Database',
    description: 'Database management',
    icon: <Database className="h-7 w-7" />,
    url: 'https://db.momoh.de/_/',
    category: 'Infrastructure'
  },
  {
    id: '6',
    name: 'Bitwarden',
    description: 'Password manager',
    icon: <Lock className="h-7 w-7" />,
    url: 'https://warden.momoh.de',
    category: 'Security'
  },
  {
    id: '7',
    name: 'Cloud Storage',
    description: 'Personal cloud storage',
    icon: <Cloud className="h-7 w-7" />,
    url: 'https://cloud.momoh.de',
    category: 'Productivity'
  },
  {
    id: '8',
    name: 'Immich',
    description: 'Google Photos alternative',
    icon: <Image className="h-7 w-7" />,
    url: 'https://pic.momoh.de',
    category: 'Media'
  },
  {
    id: '9',
    name: 'Social Media (Portfolio)',
    description: 'Social Media (portfolio)',
    icon: <Image className="h-7 w-7" />,
    url: 'https://me.momoh.de',
    category: 'Personal'
  }
];

export default services;
