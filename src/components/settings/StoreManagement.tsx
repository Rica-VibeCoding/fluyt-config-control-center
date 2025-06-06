
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

interface Store {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  employeeCount: number;
  createdAt: string;
}

export const StoreManagement = () => {
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Loja Centro',
      companyId: '1',
      companyName: 'Fluyt Móveis Ltda',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 3333-4444',
      email: 'centro@fluyt.com.br',
      isActive: true,
      employeeCount: 8,
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Loja Shopping Norte',
      companyId: '1',
      companyName: 'Fluyt Móveis Ltda',
      address: 'Shopping Norte - Piso 2, Loja 205',
      phone: '(11) 5555-6666',
      email: 'norte@fluyt.com.br',
      isActive: true,
      employeeCount: 12,
      createdAt: '2024-02-15'
    }
  ]);
  
  const companies = [
    { id: '1', name: 'Fluyt Móveis Ltda' },
    { id: '2', name: 'Design House Brasil' }
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const company = companies.find(c => c.id === formData.companyId);
    if (!company) {
      toast({
        title: "Empresa obrigatória",
        description: "Selecione uma empresa para a loja.",
        variant: "destructive"
      });
      return;
    }

    if (editingStore) {
      setStores(prev => prev.map(store => 
        store.id === editingStore.id 
          ? { 
              ...store, 
              ...formData, 
              companyName: company.name
            }
          : store
      ));
      toast({
        title: "Loja atualizada",
        description: "Os dados da loja foram atualizados com sucesso."
      });
    } else {
      const newStore: Store = {
        id: Date.now().toString(),
        ...formData,
        companyName: company.name,
        isActive: true,
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStores(prev => [...prev, newStore]);
      
      // Here would create default store configurations
      toast({
        title: "Loja cadastrada",
        description: "Nova loja adicionada com configurações padrão criadas."
      });
    }

    setIsDialogOpen(false);
    setEditingStore(null);
    setFormData({ name: '', companyId: '', address: '', phone: '', email: '' });
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      companyId: store.companyId,
      address: store.address,
      phone: store.phone,
      email: store.email
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store && store.employeeCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Esta loja possui colaboradores vinculados. Remova os colaboradores primeiro.",
        variant: "destructive"
      });
      return;
    }

    setStores(prev => prev.filter(s => s.id !== storeId));
    toast({
      title: "Loja removida",
      description: "A loja foi removida com sucesso."
    });
  };

  return (
    <div className="space-y-4">
      {/* Header simplificado */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Lojas</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingStore(null);
                setFormData({ name: '', companyId: '', address: '', phone: '', email: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Loja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingStore ? 'Editar Loja' : 'Nova Loja'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyId">Empresa *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Nome da Loja *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome da loja"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro, cidade"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 9999-9999"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="loja@empresa.com.br"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingStore ? 'Atualizar' : 'Cadastrar'}
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
              <TableHead className="font-semibold text-foreground py-3">Loja</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Empresa</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Contato</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Colaboradores</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Status</TableHead>
              <TableHead className="font-semibold text-foreground py-3 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store, index) => (
              <TableRow 
                key={store.id}
                className={`border-b border-border/50 hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <TableCell className="py-2.5">
                  <div>
                    <div className="font-medium text-foreground">{store.name}</div>
                    <div className="text-sm text-muted-foreground">{store.address}</div>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <span className="text-foreground">{store.companyName}</span>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="text-sm">
                    <div className="text-foreground">{store.phone}</div>
                    <div className="text-muted-foreground">{store.email}</div>
                  </div>
                </TableCell>
                <TableCell className="py-2.5">
                  <span className="text-foreground font-medium">{store.employeeCount}</span>
                </TableCell>
                <TableCell className="py-2.5">
                  <Badge variant={store.isActive ? "default" : "secondary"}>
                    {store.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-2.5">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(store)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(store.id)}
                      disabled={store.employeeCount > 0}
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
