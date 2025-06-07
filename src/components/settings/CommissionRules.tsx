
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, DollarSign, AlertTriangle } from 'lucide-react';
import { useCommissionRules } from '@/hooks/useCommissionRules';
import { CommissionForm } from '@/components/settings/commission/CommissionForm';
import { CommissionTable } from '@/components/settings/commission/CommissionTable';
import { CommissionRule } from '@/types/commission';

export const CommissionRules = () => {
  const {
    rules,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus
  } = useCommissionRules();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [selectedType, setSelectedType] = useState<'VENDEDOR' | 'GERENTE'>('VENDEDOR');

  const handleEdit = (rule: CommissionRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleSubmit = (formData: any) => {
    if (editingRule) {
      return updateRule(editingRule.id, formData);
    } else {
      return createRule(formData);
    }
  };

  const handleNewRule = (type: 'VENDEDOR' | 'GERENTE') => {
    setSelectedType(type);
    setEditingRule(null);
    setIsDialogOpen(true);
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
            <Button onClick={() => handleNewRule('VENDEDOR')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra Vendedor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CommissionTable
            rules={vendorRules}
            onEdit={handleEdit}
            onDelete={deleteRule}
            onToggleStatus={toggleRuleStatus}
          />
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
            <Button onClick={() => handleNewRule('GERENTE')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra Gerente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CommissionTable
            rules={managerRules}
            onEdit={handleEdit}
            onDelete={deleteRule}
            onToggleStatus={toggleRuleStatus}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Editar Regra' : 'Nova Regra de Comissão'}
            </DialogTitle>
          </DialogHeader>
          <CommissionForm
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            editingRule={editingRule}
            selectedType={selectedType}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
