
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  adminOnly?: boolean;
  items: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

interface SettingsNavigationProps {
  sections: Section[];
  userProfile: string;
}

export const SettingsNavigation = ({ sections, userProfile }: SettingsNavigationProps) => {
  return (
    <div className="productivity-nav">
      <TabsList className="grid w-full productivity-grid-cols-4 h-auto bg-transparent gap-2 p-1">
        {sections.map(section => {
          const Icon = section.icon;
          const isDisabled = section.adminOnly && userProfile !== 'ADMIN_MASTER';
          
          return (
            <TabsTrigger 
              key={section.id} 
              value={section.id} 
              disabled={isDisabled}
              className="productivity-nav-item data-[state=active]:productivity-nav-item-active flex flex-col items-center gap-2 h-auto py-4 px-3"
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{section.label}</span>
              {section.adminOnly && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Admin
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};
