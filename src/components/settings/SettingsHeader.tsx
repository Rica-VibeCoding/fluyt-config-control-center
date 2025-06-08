
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsHeader = () => {
  return (
    <div className="app-header">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 app-icon-container">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os aspectos da sua aplicação</p>
          </div>
        </div>
      </div>
    </div>
  );
};
