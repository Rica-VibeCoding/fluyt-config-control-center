
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Header simplificado */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Empresas</h2>
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
      </div>

      {/* Tabela com melhor contraste e densidade */}
      <div className="border border-border rounded-md overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b-2 border-border">
              <TableHead className="font-semibold text-foreground py-3">Empresa</TableHead>
              <TableHead className="font-semibold text-foreground py-3">CNPJ</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Lojas</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Status</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Criado em</TableHead>
              <TableHead className="font-semibold text-foreground py-3 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow 
                key={company.id}
                className={`border-b border-border/50 hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <TableCell className="font-medium py-2.5 text-foreground">{company.name}</TableCell>
                <TableCell className="py-2.5 text-foreground">{company.cnpj}</TableCell>
                <TableCell className="py-2.5">
                  <span className="text-foreground font-medium">{company.storeCount}</span>
                </TableCell>
                <TableCell className="py-2.5">
                  <Badge variant={company.isActive ? "default" : "secondary"}>
                    {company.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="py-2.5 text-foreground">{new Date(company.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right py-2.5">
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
    </div>
  );
};
