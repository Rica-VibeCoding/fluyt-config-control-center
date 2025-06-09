
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
    <div className="productivity-card p-6">
      <div className="flex items-start gap-4">
        <div className="productivity-icon-container">
          <section.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="productivity-heading-lg">{section.label}</h2>
            {section.adminOnly && (
              <Badge variant="destructive" className="text-xs">
                Acesso Restrito
              </Badge>
            )}
          </div>
          <p className="productivity-description">{section.description}</p>
        </div>
      </div>
    </div>
  );
};
