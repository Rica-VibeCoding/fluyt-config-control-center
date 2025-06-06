
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, DollarSign, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommissionRule {
  id: string;
  type: 'VENDEDOR' | 'GERENTE';
  order: number;
  minValue: number;
  maxValue: number | null;
  percentage: number;
  isActive: boolean;
  createdAt: string;
}

export const CommissionRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<CommissionRule[]>([
    // Vendedor rules
    {
      id: '1',
      type: 'VENDEDOR',
      order: 1,
      minValue: 0,
      maxValue: 10000,
      percentage: 2.0,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      type: 'VENDEDOR',
      order: 2,
      minValue: 10001,
      maxValue: 25000,
      percentage: 2.5,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      type: 'VENDEDOR',
      order: 3,
      minValue: 25001,
      maxValue: null,
      percentage: 3.0,
      isActive: true,
      createdAt: '2024-01-15'
    },
    // Gerente rules
    {
      id: '4',
      type: 'GERENTE',
      order: 1,
      minValue: 0,
      maxValue: 50000,
      percentage: 1.0,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      type: 'GERENTE',
      order: 2,
      minValue: 50001,
      maxValue: 100000,
      percentage: 1.5,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '6',
      type: 'GERENTE',
      order: 3,
      minValue: 100001,
      maxValue: null,
      percentage: 2.0,
      isActive: true,
      createdAt: '2024-01-15'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [selectedType, setSelectedType] = useState<'VENDEDOR' | 'GERENTE'>('VENDEDOR');
  const [formData, setFormData] = useState({
    type: 'VENDEDOR',
    minValue: '',
    maxValue: '',
    percentage: ''
  });

  const validateRanges = (newRule: Omit<CommissionRule, 'id' | 'order' | 'isActive' | 'createdAt'>, excludeId?: string) => {
    const sameTypeRules = rules.filter(r => 
      r.type === newRule.type && 
      r.id !== excludeId
    );

    // Check for overlaps
    for (const rule of sameTypeRules) {
      const ruleMax = rule.maxValue || Infinity;
      const newMax = newRule.maxValue || Infinity;
      
      if (
        (newRule.minValue <= ruleMax && newRule.minValue >= rule.minValue) ||
        (newMax <= ruleMax && newMax >= rule.minValue) ||
        (newRule.minValue <= rule.minValue && newMax >= ruleMax)
      ) {
        return false;
      }
    }

    return true;
  };

  const getNextOrder = (type: 'VENDEDOR' | 'GERENTE') => {
    const typeRules = rules.filter(r => r.type === type);
    return Math.max(...typeRules.map(r => r.order), 0) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const minValue = Number(formData.minValue);
    const maxValue = formData.maxValue ? Number(formData.maxValue) : null;
    const percentage = Number(formData.percentage);

    if (maxValue && maxValue <= minValue) {
      toast({
        title: "Valores inválidos",
        description: "O valor máximo deve ser maior que o valor mínimo.",
        variant: "destructive"
      });
      return;
    }

    const newRuleData = {
      type: formData.type as 'VENDEDOR' | 'GERENTE',
      minValue,
      maxValue,
      percentage
    };

    if (!validateRanges(newRuleData, editingRule?.id)) {
      toast({
        title: "Sobreposição de faixas",
        description: "Esta faixa de valores já está coberta por outra regra. Verifique os valores.",
        variant: "destructive"
      });
      return;
    }

    if (editingRule) {
      setRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { 
              ...rule,
              ...newRuleData
            }
          : rule
      ));
      toast({
        title: "Regra atualizada",
        description: "A regra de comissão foi atualizada com sucesso."
      });
    } else {
      const newRule: CommissionRule = {
        id: Date.now().toString(),
        ...newRuleData,
        order: getNextOrder(newRuleData.type),
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRules(prev => [...prev, newRule]);
      toast({
        title: "Regra criada",
        description: "Nova regra de comissão adicionada com sucesso."
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (rule: CommissionRule) => {
    setEditingRule(rule);
    setFormData({
      type: rule.type,
      minValue: rule.minValue.toString(),
      maxValue: rule.maxValue?.toString() || '',
      percentage: rule.percentage.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast({
      title: "Regra removida",
      description: "A regra de comissão foi removida com sucesso."
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRule(null);
    setFormData({
      type: selectedType,
      minValue: '',
      maxValue: '',
      percentage: ''
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'Infinito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const vendorRules = rules.filter(r => r.type === 'VENDEDOR').sort((a, b) => a.order - b.order);
  const managerRules = rules.filter(r => r.type === 'GERENTE').sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuração Crítica:</strong> As regras de comissão impactam diretamente o cálculo de comissões. 
          Mudanças criam snapshots históricos para auditoria.
        </AlertDescription>
      </Alert>

      {/* Vendedor Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Regras de Comissão - Vendedor
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedType('VENDEDOR');
                  handleCloseDialog();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Regra Vendedor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? 'Editar Regra' : 'Nova Regra de Comissão'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="type">Tipo *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                        <SelectItem value="GERENTE">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minValue">Valor Mínimo (R$) *</Label>
                      <Input
                        id="minValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.minValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, minValue: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.maxValue}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxValue: e.target.value }))}
                        placeholder="Deixe vazio para infinito"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="percentage">Percentual de Comissão (%) *</Label>
                    <Input
                      id="percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingRule ? 'Atualizar' : 'Criar Regra'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
                {vendorRules.map((rule) => (
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
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rule.id)}
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
        </CardContent>
      </Card>

      {/* Manager Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Regras de Comissão - Gerente
            </CardTitle>
            <Button onClick={() => {
              setSelectedType('GERENTE');
              handleCloseDialog();
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra Gerente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                {managerRules.map((rule) => (
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
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(rule.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};
