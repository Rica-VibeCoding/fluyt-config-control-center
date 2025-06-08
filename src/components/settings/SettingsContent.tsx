
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyManagement } from '@/components/settings/CompanyManagement';
import { StoreManagement } from '@/components/settings/StoreManagement';
import { TeamManagement } from '@/components/settings/TeamManagement';
import { SectorManagement } from '@/components/settings/SectorManagement';
import { CommissionRules } from '@/components/settings/CommissionRules';
import { StoreConfig } from '@/components/settings/StoreConfig';
import { StatusConfig } from '@/components/settings/StatusConfig';
import { ContractorManagement } from '@/components/settings/ContractorManagement';
import { TransportManagement } from '@/components/settings/TransportManagement';
import { AuditLogs } from '@/components/settings/AuditLogs';

interface SettingsContentProps {
  sectionId: string;
  itemId: string;
}

export const SettingsContent = ({ sectionId, itemId }: SettingsContentProps) => {
  const renderContent = (sectionId: string, itemId: string) => {
    const key = `${sectionId}-${itemId}`;
    switch (key) {
      case 'pessoas-empresas':
        return <CompanyManagement />;
      case 'pessoas-lojas':
        return <StoreManagement />;
      case 'pessoas-equipe':
        return <TeamManagement />;
      case 'pessoas-setores':
        return <SectorManagement />;
      case 'financeiro-comissoes':
        return <CommissionRules />;
      case 'financeiro-config-loja':
        return <StoreConfig />;
      case 'financeiro-status':
        return <StatusConfig />;
      case 'operacional-montadores':
        return <ContractorManagement />;
      case 'operacional-transportadoras':
        return <TransportManagement />;
      case 'sistema-auditoria':
        return <AuditLogs />;
      default:
        return (
          <Card className="app-card">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Funcionalidade em desenvolvimento
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return renderContent(sectionId, itemId);
};
