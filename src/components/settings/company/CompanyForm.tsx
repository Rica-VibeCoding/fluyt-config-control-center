
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyFormData } from '@/types/company';

interface CompanyFormProps {
  formData: CompanyFormData;
  onFormDataChange: (data: CompanyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isEditing
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Razão Social *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          placeholder="Nome da empresa"
          required
        />
      </div>
      <div>
        <Label htmlFor="cnpj">CNPJ *</Label>
        <Input
          id="cnpj"
          value={formData.cnpj}
          onChange={(e) => onFormDataChange({ ...formData, cnpj: e.target.value })}
          placeholder="00.000.000/0000-00"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
            placeholder="email@empresa.com.br"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
            placeholder="(00) 00000-0000"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Endereço *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
          placeholder="Endereço completo"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};
