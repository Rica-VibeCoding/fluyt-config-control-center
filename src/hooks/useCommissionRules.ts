
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CommissionRule, CommissionFormData } from '@/types/commission';

export const useCommissionRules = () => {
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

  const validateRanges = (newRule: Omit<CommissionRule, 'id' | 'order' | 'isActive' | 'createdAt'>, excludeId?: string) => {
    const sameTypeRules = rules.filter(r => 
      r.type === newRule.type && 
      r.id !== excludeId &&
      r.isActive
    );

    // Sort rules by minValue to check for gaps and overlaps
    const sortedRules = [...sameTypeRules].sort((a, b) => a.minValue - b.minValue);

    // Check for overlaps with existing rules
    for (const rule of sortedRules) {
      const ruleMax = rule.maxValue || Infinity;
      const newMax = newRule.maxValue || Infinity;
      
      // Check if ranges overlap
      if (
        (newRule.minValue >= rule.minValue && newRule.minValue <= ruleMax) ||
        (newMax >= rule.minValue && newMax <= ruleMax) ||
        (newRule.minValue <= rule.minValue && newMax >= ruleMax)
      ) {
        return {
          isValid: false,
          message: `Esta faixa sobrepõe com a regra existente: ${rule.minValue} - ${rule.maxValue || 'Infinito'}`
        };
      }
    }

    return { isValid: true, message: '' };
  };

  const getNextOrder = (type: 'VENDEDOR' | 'GERENTE') => {
    const typeRules = rules.filter(r => r.type === type);
    return Math.max(...typeRules.map(r => r.order), 0) + 1;
  };

  const createRule = (formData: CommissionFormData) => {
    const minValue = Number(formData.minValue);
    const maxValue = formData.maxValue ? Number(formData.maxValue) : null;
    const percentage = Number(formData.percentage);

    if (maxValue && maxValue <= minValue) {
      toast({
        title: "Valores inválidos",
        description: "O valor máximo deve ser maior que o valor mínimo.",
        variant: "destructive"
      });
      return false;
    }

    const newRuleData = {
      type: formData.type as 'VENDEDOR' | 'GERENTE',
      minValue,
      maxValue,
      percentage
    };

    const validation = validateRanges(newRuleData);
    if (!validation.isValid) {
      toast({
        title: "Sobreposição de faixas",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }

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
    return true;
  };

  const updateRule = (ruleId: string, formData: CommissionFormData) => {
    const minValue = Number(formData.minValue);
    const maxValue = formData.maxValue ? Number(formData.maxValue) : null;
    const percentage = Number(formData.percentage);

    if (maxValue && maxValue <= minValue) {
      toast({
        title: "Valores inválidos",
        description: "O valor máximo deve ser maior que o valor mínimo.",
        variant: "destructive"
      });
      return false;
    }

    const newRuleData = {
      type: formData.type as 'VENDEDOR' | 'GERENTE',
      minValue,
      maxValue,
      percentage
    };

    const validation = validateRanges(newRuleData, ruleId);
    if (!validation.isValid) {
      toast({
        title: "Sobreposição de faixas",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }

    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
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
    return true;
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast({
      title: "Regra removida",
      description: "A regra de comissão foi removida com sucesso."
    });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    
    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: rule?.isActive ? "Regra desativada" : "Regra ativada",
      description: `A regra foi ${rule?.isActive ? 'desativada' : 'ativada'} com sucesso.`
    });
  };

  const getActiveRulesByType = (type: 'VENDEDOR' | 'GERENTE') => {
    return rules
      .filter(r => r.type === type && r.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const calculateCommission = (saleValue: number, type: 'VENDEDOR' | 'GERENTE') => {
    const activeRules = getActiveRulesByType(type);
    
    for (const rule of activeRules) {
      const maxValue = rule.maxValue || Infinity;
      if (saleValue >= rule.minValue && saleValue <= maxValue) {
        return (saleValue * rule.percentage) / 100;
      }
    }
    
    return 0;
  };

  return {
    rules,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus,
    getActiveRulesByType,
    calculateCommission
  };
};
