
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SubNavigationItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SettingsSubNavigationProps {
  items: SubNavigationItem[];
}

export const SettingsSubNavigation = ({ items }: SettingsSubNavigationProps) => {
  return (
    <div className="productivity-nav">
      <TabsList 
        className="grid w-full h-auto bg-transparent gap-1 p-1" 
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map(item => (
          <TabsTrigger 
            key={item.id} 
            value={item.id} 
            className="productivity-nav-item data-[state=active]:productivity-nav-item-active flex items-center gap-2 h-12 px-4"
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span className="productivity-text-body font-medium">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
