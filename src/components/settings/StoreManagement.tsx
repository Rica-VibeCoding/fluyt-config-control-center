
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Store, Building2, Users } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Gestão de Lojas
          </CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Colaboradores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {store.companyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{store.phone}</div>
                      <div className="text-muted-foreground">{store.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {store.employeeCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={store.isActive ? "default" : "secondary"}>
                      {store.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
      </CardContent>
    </Card>
  );
};
