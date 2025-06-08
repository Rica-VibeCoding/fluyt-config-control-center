
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
    <div className="bg-card rounded-lg border border-border p-1 shadow-sm">
      <TabsList 
        className="grid w-full h-12 bg-transparent gap-1" 
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map(item => (
          <TabsTrigger 
            key={item.id} 
            value={item.id} 
            className="flex items-center gap-2 h-10 px-3 app-nav-item rounded-md text-sm data-[state=active]:app-nav-item-active data-[state=active]:shadow-sm"
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span className="font-medium">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
