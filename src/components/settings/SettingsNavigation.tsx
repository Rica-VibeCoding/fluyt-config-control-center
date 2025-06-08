import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  description: string;
  adminOnly?: boolean;
  items: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{
      className?: string;
    }>;
  }>;
}
interface SettingsNavigationProps {
  sections: Section[];
  userProfile: string;
}
export const SettingsNavigation = ({
  sections,
  userProfile
}: SettingsNavigationProps) => {
  return <div className="rounded-lg border border-border p-1 shadow-sm bg-zinc-200">
      <TabsList className="grid w-full grid-cols-4 h-14 bg-transparent gap-1">
        {sections.map(section => {
        const Icon = section.icon;
        const isDisabled = section.adminOnly && userProfile !== 'ADMIN_MASTER';
        return <TabsTrigger key={section.id} value={section.id} disabled={isDisabled} className="flex items-center gap-3 h-12 px-4 app-nav-item rounded-md data-[state=active]:app-nav-item-active data-[state=active]:shadow-sm">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{section.label}</span>
            </TabsTrigger>;
      })}
      </TabsList>
    </div>;
};