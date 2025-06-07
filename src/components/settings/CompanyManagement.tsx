
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCompanyManagement } from '@/hooks/useCompanyManagement';
import { CompanyForm } from '@/components/settings/company/CompanyForm';
import { CompanyTable } from '@/components/settings/company/CompanyTable';
import { Company, CompanyFormData } from '@/types/company';

export const CompanyManagement = () => {
  const { companies, createCompany, updateCompany, deleteCompany, toggleCompanyStatus } = useCompanyManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCompany) {
      updateCompany(editingCompany.id, formData);
    } else {
      createCompany(formData);
    }

    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '', email: '', phone: '', address: '' });
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      cnpj: company.cnpj,
      email: company.email,
      phone: company.phone,
      address: company.address
    });
    setIsDialogOpen(true);
  };

  const handleNewCompany = () => {
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '', email: '', phone: '', address: '' });
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Empresas</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewCompany}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
                </DialogTitle>
              </DialogHeader>
              <CompanyForm
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEditing={!!editingCompany}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CompanyTable
        companies={companies}
        onEdit={handleEdit}
        onDelete={deleteCompany}
        onToggleStatus={toggleCompanyStatus}
      />
    </div>
  );
};
