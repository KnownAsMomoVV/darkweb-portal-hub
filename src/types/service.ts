
import { ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  url: string;
  category: string;
}
