
import { Users, DollarSign, Settings as SettingsIcon, FileText, Building2, Store, UserCog, Layers } from 'lucide-react';

export const sections = [{
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
