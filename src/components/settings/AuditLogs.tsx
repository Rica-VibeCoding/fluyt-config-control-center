
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    action: '',
    table: '',
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
    if (filters.action && log.action !== filters.action) {
      return false;
    }
    if (filters.table && log.table !== filters.table) {
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
      <div key={field} className="text-xs">
        <span className="font-medium">{field}:</span>{' '}
        <span className="text-red-600">{change.old?.toString() || 'null'}</span>{' '}
        → <span className="text-green-600">{change.new?.toString() || 'null'}</span>
      </div>
    ));
  };

  const clearFilters = () => {
    setFilters({
      user: '',
      action: '',
      table: '',
      dateRange: undefined
    });
    setSearchTerm('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Logs de Auditoria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Filtros</h3>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="searchTerm">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="searchTerm"
                    placeholder="Usuário ou tabela..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="action">Ação</Label>
                <Select
                  value={filters.action}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as ações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as ações</SelectItem>
                    {actions.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="table">Tabela</Label>
                <Select
                  value={filters.table}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, table: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as tabelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as tabelas</SelectItem>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Período</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
          </CardContent>
        </Card>

        {/* Results */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Alterações</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {getActionLabel(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {log.table}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-sm">
                      {formatChanges(log.changes)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum log encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
