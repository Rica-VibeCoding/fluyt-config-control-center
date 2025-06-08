
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SectionInfoProps {
  section: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    adminOnly?: boolean;
  };
}

export const SectionInfo = ({ section }: SectionInfoProps) => {
  return (
    <div className="app-card p-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 app-icon-container">
          <section.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">{section.label}</h2>
            {section.adminOnly && (
              <Badge variant="destructive" className="text-xs">
                Admin Only
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{section.description}</p>
        </div>
      </div>
    </div>
  );
};
