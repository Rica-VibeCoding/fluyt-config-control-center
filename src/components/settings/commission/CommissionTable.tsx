
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Power } from 'lucide-react';
import { CommissionRule } from '@/types/commission';

interface CommissionTableProps {
  rules: CommissionRule[];
  onEdit: (rule: CommissionRule) => void;
  onDelete: (ruleId: string) => void;
  onToggleStatus: (ruleId: string) => void;
}

export const CommissionTable = ({ rules, onEdit, onDelete, onToggleStatus }: CommissionTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Infinito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Faixa de Valores</TableHead>
            <TableHead>Percentual</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>
                <Badge variant="outline">{rule.order}</Badge>
              </TableCell>
              <TableCell>
                {formatCurrency(rule.minValue)} - {formatCurrency(rule.maxValue)}
              </TableCell>
              <TableCell>{rule.percentage}%</TableCell>
              <TableCell>
                <Badge variant={rule.isActive ? "default" : "secondary"}>
                  {rule.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(rule.id)}
                    title={rule.isActive ? 'Desativar' : 'Ativar'}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
