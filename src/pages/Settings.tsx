import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Settings as SettingsIcon, FileText, Building2, Store, UserCog, Layers } from 'lucide-react';
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
const Settings = () => {
  const [activeSection, setActiveSection] = useState('pessoas');
  const userProfile = 'ADMIN_MASTER'; // This would come from auth context

  const sections = [{
    id: 'pessoas',
    label: 'Pessoas',
    icon: Users,
    description: 'Gestão de empresas, lojas, equipe e setores',
    items: [{
      id: 'empresas',
      label: 'Empresas',
      icon: Building2
    }, {
      id: 'lojas',
      label: 'Lojas',
      icon: Store
    }, {
      id: 'equipe',
      label: 'Equipe',
      icon: UserCog
    }, {
      id: 'setores',
      label: 'Setores',
      icon: Layers
    }]
  }, {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    description: 'Configurações críticas do sistema',
    adminOnly: true,
    items: [{
      id: 'comissoes',
      label: 'Regras de Comissão'
    }, {
      id: 'config-loja',
      label: 'Configurações da Loja'
    }, {
      id: 'status',
      label: 'Status de Orçamento'
    }]
  }, {
    id: 'operacional',
    label: 'Operacional',
    icon: SettingsIcon,
    description: 'Prestadores de serviços',
    items: [{
      id: 'montadores',
      label: 'Montadores'
    }, {
      id: 'transportadoras',
      label: 'Transportadoras'
    }]
  }, {
    id: 'sistema',
    label: 'Sistema',
    icon: FileText,
    description: 'Auditoria e logs',
    items: [{
      id: 'auditoria',
      label: 'Auditoria'
    }]
  }];
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
        return <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Funcionalidade em desenvolvimento
              </div>
            </CardContent>
          </Card>;
    }
  };
  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            
          </div>
          
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            {sections.map(section => {
            const Icon = section.icon;
            const isDisabled = section.adminOnly && userProfile !== 'ADMIN_MASTER';
            return <TabsTrigger key={section.id} value={section.id} disabled={isDisabled} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                </TabsTrigger>;
          })}
          </TabsList>

          {sections.map(section => <TabsContent key={section.id} value={section.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <section.icon className="h-5 w-5" />
                    {section.label}
                    {section.adminOnly && <Badge variant="destructive" className="text-xs">
                        Admin Only
                      </Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </CardHeader>
              </Card>

              <Tabs defaultValue={section.items[0]?.id} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
                  {section.items.map(item => <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2 text-xs sm:text-sm">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </TabsTrigger>)}
                </TabsList>

                {section.items.map(item => <TabsContent key={item.id} value={item.id}>
                    {renderContent(section.id, item.id)}
                  </TabsContent>)}
              </Tabs>
            </TabsContent>)}
        </Tabs>
      </div>
    </div>;
};
export default Settings;