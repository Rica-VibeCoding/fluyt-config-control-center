
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsHeader = () => {
  return (
    <div className="productivity-header">
      <div className="productivity-container py-8">
        <div className="flex items-center gap-4">
          <div className="productivity-icon-container w-12 h-12">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="productivity-heading-xl">Configurações do Sistema</h1>
            <p className="productivity-description mt-1">
              Gerencie todos os aspectos da sua aplicação de forma eficiente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
