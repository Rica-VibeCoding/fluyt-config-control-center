
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
        return <Card className="app-card">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Funcionalidade em desenvolvimento
              </div>
            </CardContent>
          </Card>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header usando tokens semânticos */}
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

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          {/* Navegação principal */}
          <div className="bg-muted rounded-lg p-1">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-transparent">
              {sections.map(section => {
                const Icon = section.icon;
                const isDisabled = section.adminOnly && userProfile !== 'ADMIN_MASTER';
                return (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id} 
                    disabled={isDisabled} 
                    className="flex items-center gap-3 h-12 px-4 text-muted-foreground hover:text-foreground font-medium rounded-md transition-colors duration-200 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {sections.map(section => (
            <TabsContent key={section.id} value={section.id} className="space-y-6">
              {/* Card de informação da seção */}
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

              {/* Sub-navegação */}
              <Tabs defaultValue={section.items[0]?.id} className="space-y-4">
                <div className="bg-muted rounded-lg p-1">
                  <TabsList className="grid w-full h-12 bg-transparent" style={{ gridTemplateColumns: `repeat(${section.items.length}, 1fr)` }}>
                    {section.items.map(item => (
                      <TabsTrigger 
                        key={item.id} 
                        value={item.id} 
                        className="flex items-center gap-2 h-10 px-3 text-muted-foreground hover:text-foreground font-medium rounded-md transition-colors duration-200 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="font-medium text-sm">{item.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {section.items.map(item => (
                  <TabsContent key={item.id} value={item.id}>
                    {renderContent(section.id, item.id)}
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
