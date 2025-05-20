
import { ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: ReactNode | string;
  url: string;
  category: string;
  iconColor?: string;
}

export type Theme = 'default' | 'blue' | 'purple' | 'green' | 'amber';

export interface ThemeConfig {
  name: string;
  value: Theme;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
}
