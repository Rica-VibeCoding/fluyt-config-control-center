
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contractor {
  id: string;
  name: string;
  category: 'MARCENEIRO' | 'ELETRICISTA' | 'ENCANADOR' | 'GESSEIRO' | 'PINTOR' | 'OUTRO';
  fixedValue: number;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export const ContractorManagement = () => {
  const { toast } = useToast();
  const [contractors, setContractors] = useState<Contractor[]>([
    {
      id: '1',
      name: 'João Marceneiro Silva',
      category: 'MARCENEIRO',
      fixedValue: 350,
      phone: '(11) 99999-1234',
      isActive: true,
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Carlos Elétrica & Cia',
      category: 'ELETRICISTA',
      fixedValue: 250,
      phone: '(11) 88888-5678',
      isActive: true,
      createdAt: '2024-02-05'
    },
    {
      id: '3',
      name: 'Maria dos Gessos',
      category: 'GESSEIRO',
      fixedValue: 180,
      phone: '(11) 77777-9012',
      isActive: true,
      createdAt: '2024-02-15'
    }
  ]);
  
  const categories = [
    { value: 'MARCENEIRO', label: 'Marceneiro' },
    { value: 'ELETRICISTA', label: 'Eletricista' },
    { value: 'ENCANADOR', label: 'Encanador' },
    { value: 'GESSEIRO', label: 'Gesseiro' },
    { value: 'PINTOR', label: 'Pintor' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    fixedValue: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContractor) {
      setContractors(prev => prev.map(contractor => 
        contractor.id === editingContractor.id 
          ? { 
              ...contractor,
              name: formData.name,
              category: formData.category as any,
              fixedValue: Number(formData.fixedValue),
              phone: formData.phone
            }
          : contractor
      ));
      toast({
        title: "Montador atualizado",
        description: "Os dados do montador foram atualizados com sucesso."
      });
    } else {
      const newContractor: Contractor = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category as any,
        fixedValue: Number(formData.fixedValue),
        phone: formData.phone,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setContractors(prev => [...prev, newContractor]);
      toast({
        title: "Montador cadastrado",
        description: "Novo montador adicionado com sucesso."
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setFormData({
      name: contractor.name,
      category: contractor.category,
      fixedValue: contractor.fixedValue.toString(),
      phone: contractor.phone
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (contractorId: string) => {
    setContractors(prev => prev.filter(c => c.id !== contractorId));
    toast({
      title: "Montador removido",
      description: "O montador foi removido com sucesso."
    });
  };

  const toggleStatus = (contractorId: string) => {
    setContractors(prev => prev.map(contractor => 
      contractor.id === contractorId 
        ? { ...contractor, isActive: !contractor.isActive }
        : contractor
    ));
    
    const contractor = contractors.find(c => c.id === contractorId);
    toast({
      title: `Montador ${contractor?.isActive ? 'desativado' : 'ativado'}`,
      description: `O montador foi ${contractor?.isActive ? 'desativado' : 'ativado'} com sucesso.`
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingContractor(null);
    setFormData({
      name: '',
      category: '',
      fixedValue: '',
      phone: ''
    });
  };

  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, any> = {
      'MARCENEIRO': 'default',
      'ELETRICISTA': 'secondary',
      'ENCANADOR': 'outline',
      'GESSEIRO': 'destructive',
      'PINTOR': 'default',
      'OUTRO': 'secondary'
    };
    return variants[category] || 'outline';
  };

  return (
    <div className="space-y-4">
      {/* Header simplificado */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Montadores</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCloseDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Montador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingContractor ? 'Editar Montador' : 'Novo Montador'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome/Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do montador ou empresa"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fixedValue">Valor Fixo (R$) *</Label>
                  <Input
                    id="fixedValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fixedValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedValue: e.target.value }))}
                    placeholder="Valor fixo por serviço"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingContractor ? 'Atualizar' : 'Cadastrar'}
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
              <TableHead className="font-semibold text-foreground py-3">Nome/Empresa</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Categoria</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Valor Fixo</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Contato</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Status</TableHead>
              <TableHead className="font-semibold text-foreground py-3 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractors.map((contractor, index) => (
              <TableRow 
                key={contractor.id}
                className={`border-b border-border/50 hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <TableCell className="font-medium py-2.5 text-foreground">{contractor.name}</TableCell>
                <TableCell className="py-2.5">
                  <Badge variant={getCategoryBadgeVariant(contractor.category)}>
                    {categories.find(c => c.value === contractor.category)?.label}
                  </Badge>
                </TableCell>
                <TableCell className="py-2.5 text-foreground">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(contractor.fixedValue)}
                </TableCell>
                <TableCell className="text-sm text-foreground py-2.5">
                  {contractor.phone}
                </TableCell>
                <TableCell className="py-2.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(contractor.id)}
                  >
                    <Badge variant={contractor.isActive ? "default" : "secondary"}>
                      {contractor.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Button>
                </TableCell>
                <TableCell className="text-right py-2.5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(contractor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contractor.id)}
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
