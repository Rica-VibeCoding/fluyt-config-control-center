
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Building2, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  createdAt: string;
  updatedAt: string;
  storeCount: number;
  isActive: boolean;
}

export const CompanyManagement = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Fluyt Móveis Ltda',
      cnpj: '12.345.678/0001-90',
      createdAt: '2024-01-15',
      updatedAt: '2024-06-01',
      storeCount: 3,
      isActive: true
    },
    {
      id: '2',
      name: 'Design House Brasil',
      cnpj: '98.765.432/0001-10',
      createdAt: '2024-02-20',
      updatedAt: '2024-05-15',
      storeCount: 2,
      isActive: true
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: ''
  });

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  const formatCNPJ = (value: string) => {
    const clean = value.replace(/\D/g, '');
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCNPJ(formData.cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, insira um CNPJ válido com 14 dígitos.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate CNPJ
    const isDuplicate = companies.some(company => 
      company.cnpj === formData.cnpj && company.id !== editingCompany?.id
    );
    
    if (isDuplicate) {
      toast({
        title: "CNPJ já cadastrado",
        description: "Este CNPJ já está sendo utilizado por outra empresa.",
        variant: "destructive"
      });
      return;
    }

    if (editingCompany) {
      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : company
      ));
      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso."
      });
    } else {
      const newCompany: Company = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        storeCount: 0,
        isActive: true
      };
      setCompanies(prev => [...prev, newCompany]);
      toast({
        title: "Empresa cadastrada",
        description: "Nova empresa adicionada com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData({ name: '', cnpj: '' });
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      cnpj: company.cnpj
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company && company.storeCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Esta empresa possui lojas vinculadas. Remova as lojas primeiro.",
        variant: "destructive"
      });
      return;
    }

    setCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({
      title: "Empresa removida",
      description: "A empresa foi removida com sucesso."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestão de Empresas
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCompany(null);
                setFormData({ name: '', cnpj: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome da empresa"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      cnpj: formatCNPJ(e.target.value) 
                    }))}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCompany ? 'Atualizar' : 'Cadastrar'}
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
                <TableHead>Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Lojas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      {company.storeCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isActive ? "default" : "secondary"}>
                      {company.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(company.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                        disabled={company.storeCount > 0}
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
  );
};
