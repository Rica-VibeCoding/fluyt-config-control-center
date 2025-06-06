
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  recordId: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress: string;
}

export const AuditLogs = () => {
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-06-06T14:30:00Z',
      userId: '1',
      userName: 'Ana Costa',
      action: 'UPDATE',
      table: 'config_loja',
      recordId: '1',
      changes: {
        deflatorCost: { old: 15.0, new: 15.5 },
        discountLimitVendor: { old: 10.0, new: 12.0 }
      },
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-06-06T13:15:00Z',
      userId: '2',
      userName: 'João Silva Santos',
      action: 'CREATE',
      table: 'cad_equipe',
      recordId: '15',
      changes: {
        name: { old: null, new: 'Pedro Santos' },
        email: { old: null, new: 'pedro@fluyt.com.br' },
        profile: { old: null, new: 'VENDEDOR' }
      },
      ipAddress: '192.168.1.105'
    },
    {
      id: '3',
      timestamp: '2024-06-06T11:45:00Z',
      userId: '1',
      userName: 'Ana Costa',
      action: 'UPDATE',
      table: 'config_regras_comissao_faixa',
      recordId: '3',
      changes: {
        percentage: { old: 2.5, new: 3.0 }
      },
      ipAddress: '192.168.1.100'
    },
    {
      id: '4',
      timestamp: '2024-06-06T10:20:00Z',
      userId: '3',
      userName: 'Carlos Mendes',
      action: 'DELETE',
      table: 'cad_montadores',
      recordId: '8',
      changes: {
        name: { old: 'Montador Inativo', new: null },
        isActive: { old: false, new: null }
      },
      ipAddress: '192.168.1.110'
    }
  ]);

  const [filters, setFilters] = useState({
    user: '',
    action: 'all',
    table: 'all',
    dateRange: undefined as DateRange | undefined
  });

  const [searchTerm, setSearchTerm] = useState('');

  const tables = [
    'cad_empresas',
    'c_lojas',
    'cad_equipe',
    'cad_setores',
    'config_loja',
    'config_regras_comissao_faixa',
    'config_status_orcamento',
    'cad_montadores',
    'cad_transportadoras'
  ];

  const actions = [
    { value: 'CREATE', label: 'Criação' },
    { value: 'UPDATE', label: 'Atualização' },
    { value: 'DELETE', label: 'Exclusão' }
  ];

  const filteredLogs = logs.filter(log => {
    if (filters.user && !log.userName.toLowerCase().includes(filters.user.toLowerCase())) {
      return false;
    }
    if (filters.action !== 'all' && log.action !== filters.action) {
      return false;
    }
    if (filters.table !== 'all' && log.table !== filters.table) {
      return false;
    }
    if (searchTerm && !log.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.table.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'CREATE': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      default: return 'outline';
    }
  };

  const getActionLabel = (action: string) => {
    const actionMap: Record<string, string> = {
      'CREATE': 'Criação',
      'UPDATE': 'Atualização',
      'DELETE': 'Exclusão'
    };
    return actionMap[action] || action;
  };

  const formatChanges = (changes: Record<string, { old: any; new: any }>) => {
    return Object.entries(changes).map(([field, change]) => (
      <div key={field} className="text-xs leading-relaxed">
        <span className="font-medium text-foreground">{field}:</span>{' '}
        <span className="text-red-700 bg-red-50 px-1 rounded">{change.old?.toString() || 'null'}</span>{' '}
        → <span className="text-green-700 bg-green-50 px-1 rounded">{change.new?.toString() || 'null'}</span>
      </div>
    ));
  };

  const clearFilters = () => {
    setFilters({
      user: '',
      action: 'all',
      table: 'all',
      dateRange: undefined
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* Header simplificado */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Logs de Auditoria</h2>
        </div>
      </div>

      {/* Filtros sempre visíveis e compactos */}
      <div className="bg-muted/30 border border-border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Filtros</h3>
          <Button variant="outline" size="sm" onClick={clearFilters} className="h-8 px-3 text-xs">
            Limpar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="searchTerm" className="text-sm font-medium mb-1 block">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="searchTerm"
                placeholder="Usuário ou tabela..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="action" className="text-sm font-medium mb-1 block">Ação</Label>
            <Select
              value={filters.action}
              onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todas as ações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                {actions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="table" className="text-sm font-medium mb-1 block">Tabela</Label>
            <Select
              value={filters.table}
              onValueChange={(value) => setFilters(prev => ({ ...prev, table: value }))}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Todas as tabelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tabelas</SelectItem>
                {tables.map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1 block">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 text-sm",
                    !filters.dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    "Selecione o período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Tabela com melhor contraste e densidade */}
      <div className="border border-border rounded-md overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b-2 border-border">
              <TableHead className="font-semibold text-foreground py-3">Data/Hora</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Usuário</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Ação</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Tabela</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Alterações</TableHead>
              <TableHead className="font-semibold text-foreground py-3">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log, index) => (
              <TableRow 
                key={log.id} 
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <TableCell className="py-2.5 text-sm text-foreground">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium py-2.5 text-foreground">{log.userName}</TableCell>
                <TableCell className="py-2.5">
                  <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                    {getActionLabel(log.action)}
                  </Badge>
                </TableCell>
                <TableCell className="py-2.5">
                  <code className="bg-muted/60 border border-border px-2 py-1 rounded text-xs font-mono text-foreground">
                    {log.table}
                  </code>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="max-w-sm space-y-1">
                    {formatChanges(log.changes)}
                  </div>
                </TableCell>
                <TableCell className="py-2.5 text-sm text-muted-foreground font-mono">
                  {log.ipAddress}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/20">
            <div className="text-sm">Nenhum log encontrado com os filtros aplicados.</div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="mt-2 text-xs"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
