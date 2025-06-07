
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommissionFormData, CommissionRule } from '@/types/commission';

interface CommissionFormProps {
  onSubmit: (data: CommissionFormData) => boolean;
  onCancel: () => void;
  editingRule?: CommissionRule | null;
  selectedType: 'VENDEDOR' | 'GERENTE';
}

export const CommissionForm = ({ onSubmit, onCancel, editingRule, selectedType }: CommissionFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CommissionFormData>({
    defaultValues: editingRule ? {
      type: editingRule.type,
      minValue: editingRule.minValue.toString(),
      maxValue: editingRule.maxValue?.toString() || '',
      percentage: editingRule.percentage.toString()
    } : {
      type: selectedType,
      minValue: '',
      maxValue: '',
      percentage: ''
    }
  });

  const watchedType = watch('type');

  React.useEffect(() => {
    if (!editingRule) {
      setValue('type', selectedType);
    }
  }, [selectedType, setValue, editingRule]);

  const handleFormSubmit = (data: CommissionFormData) => {
    const success = onSubmit(data);
    if (success) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="type">Tipo *</Label>
        <Select
          value={watchedType}
          onValueChange={(value) => setValue('type', value as 'VENDEDOR' | 'GERENTE')}
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
            {...register('minValue', { 
              required: 'Valor mínimo é obrigatório',
              min: { value: 0, message: 'Valor deve ser maior ou igual a 0' }
            })}
          />
          {errors.minValue && (
            <p className="text-sm text-destructive mt-1">{errors.minValue.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
          <Input
            id="maxValue"
            type="number"
            min="0"
            step="0.01"
            placeholder="Deixe vazio para infinito"
            {...register('maxValue')}
          />
          {errors.maxValue && (
            <p className="text-sm text-destructive mt-1">{errors.maxValue.message}</p>
          )}
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
          {...register('percentage', { 
            required: 'Percentual é obrigatório',
            min: { value: 0, message: 'Percentual deve ser maior ou igual a 0' },
            max: { value: 100, message: 'Percentual deve ser menor ou igual a 100' }
          })}
        />
        {errors.percentage && (
          <p className="text-sm text-destructive mt-1">{errors.percentage.message}</p>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {editingRule ? 'Atualizar' : 'Criar Regra'}
        </Button>
      </div>
    </form>
  );
};
