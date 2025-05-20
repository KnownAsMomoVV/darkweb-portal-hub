
import React from 'react';
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

// Make sure icons are properly rendered as React elements
const services: Service[] = [
  {
    id: '1',
    name: 'Time Tracker',
    description: 'Track time for honorary work',
    icon: <Calendar className="h-7 w-7" />,
    url: 'https://timetracker.example.com',
    category: 'Productivity'
  },
  {
    id: '2',
    name: 'Wishlist',
    description: 'Keep track of wanted items',
    icon: <ShoppingCart className="h-7 w-7" />,
    url: 'https://wishlist.example.com',
    category: 'Personal'
  },
  {
    id: '3',
    name: 'Portainer',
    description: 'Container management',
    icon: <Monitor className="h-7 w-7" />,
    url: 'https://portainer.example.com',
    category: 'Infrastructure'
  },
  {
    id: '4',
    name: 'Portfolio',
    description: 'Personal portfolio site',
    icon: <Image className="h-7 w-7" />,
    url: 'https://portfolio.example.com',
    category: 'Personal'
  },
  {
    id: '5',
    name: 'Database',
    description: 'Database management',
    icon: <Database className="h-7 w-7" />,
    url: 'https://database.example.com',
    category: 'Infrastructure'
  },
  {
    id: '6',
    name: 'Bitwarden',
    description: 'Password manager',
    icon: <Lock className="h-7 w-7" />,
    url: 'https://bitwarden.example.com',
    category: 'Security'
  },
  {
    id: '7',
    name: 'Cloud Storage',
    description: 'Personal cloud storage',
    icon: <Cloud className="h-7 w-7" />,
    url: 'https://cloud.example.com',
    category: 'Storage'
  },
  {
    id: '8',
    name: 'Immich',
    description: 'Google Photos alternative',
    icon: <Image className="h-7 w-7" />,
    url: 'https://immich.example.com',
    category: 'Media'
  },
  {
    id: '9',
    name: 'System Settings',
    description: 'System configuration',
    icon: <Settings className="h-7 w-7" />,
    url: 'https://settings.example.com',
    category: 'Infrastructure'
  }
];

export default services;
