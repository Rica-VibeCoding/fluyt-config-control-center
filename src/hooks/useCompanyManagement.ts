
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company, CompanyFormData } from '@/types/company';

export const useCompanyManagement = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Fluyt Soluções Tecnológicas',
      cnpj: '12.345.678/0001-90',
      email: 'contato@fluyt.com.br',
      phone: '(11) 98765-4321',
      address: 'Rua das Tecnologias, 123 - São Paulo/SP',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Empresa Parceira LTDA',
      cnpj: '98.765.432/0001-10',
      email: 'contato@parceira.com.br',
      phone: '(11) 91234-5678',
      address: 'Av. dos Negócios, 456 - São Paulo/SP',
      isActive: false,
      createdAt: '2024-02-15'
    }
  ]);

  const createCompany = (formData: CompanyFormData) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCompanies(prev => [...prev, newCompany]);
    toast({
      title: "Empresa cadastrada",
      description: "Nova empresa adicionada com sucesso."
    });
  };

  const updateCompany = (companyId: string, formData: CompanyFormData) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, ...formData }
        : company
    ));
    toast({
      title: "Empresa atualizada",
      description: "Os dados da empresa foram atualizados com sucesso."
    });
  };

  const toggleCompanyStatus = (companyId: string) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId 
        ? { ...company, isActive: !company.isActive }
        : company
    ));
    
    const company = companies.find(c => c.id === companyId);
    toast({
      title: company?.isActive ? "Empresa desativada" : "Empresa ativada",
      description: `A empresa foi ${company?.isActive ? 'desativada' : 'ativada'} com sucesso.`
    });
  };

  const deleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({
      title: "Empresa removida",
      description: "A empresa foi removida com sucesso."
    });
  };

  return {
    companies,
    createCompany,
    updateCompany,
    toggleCompanyStatus,
    deleteCompany
  };
};
