
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCompanyManagement } from '@/hooks/useCompanyManagement';

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
  const { companies } = useCompanyManagement();
  
  // Filter only active companies for the dropdown
  const activeCompanies = companies.filter(company => company.isActive);
  
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'Loja Centro',
      companyId: '1',
      companyName: 'Fluyt Soluções Tecnológicas',
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
      companyName: 'Fluyt Soluções Tecnológicas',
      address: 'Shopping Norte - Piso 2, Loja 205',
      phone: '(11) 5555-6666',
      email: 'norte@fluyt.com.br',
      isActive: true,
      employeeCount: 12,
      createdAt: '2024-02-15'
    }
  ]);

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
    
    const company = activeCompanies.find(c => c.id === formData.companyId);
    if (!company) {
      toast({
        title: "Empresa obrigatória",
        description: "Selecione uma empresa ativa para a loja.",
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
    <div className="space-y-6">
      {/* Header usando tokens semânticos */}
      <div className="app-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 app-icon-container">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Gestão de Lojas</h3>
              <p className="text-sm text-muted-foreground">Controle todas as unidades da empresa</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="app-button-primary"
                onClick={() => {
                  setEditingStore(null);
                  setFormData({ name: '', companyId: '', address: '', phone: '', email: '' });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Loja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingStore ? 'Editar Loja' : 'Nova Loja'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyId" className="text-foreground font-medium">Empresa *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                    required
                  >
                    <SelectTrigger className="app-input">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCompanies.length === 0 ? (
                        <SelectItem value="" disabled>
                          Nenhuma empresa ativa encontrada
                        </SelectItem>
                      ) : (
                        activeCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name" className="text-foreground font-medium">Nome da Loja *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome da loja"
                    className="app-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-foreground font-medium">Endereço Completo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro, cidade"
                    className="app-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground font-medium">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 9999-9999"
                    className="app-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="loja@empresa.com.br"
                    className="app-input"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="app-button-primary" disabled={activeCompanies.length === 0}>
                    {editingStore ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerta se não houver empresas ativas */}
      {activeCompanies.length === 0 && (
        <div className="app-card p-6">
          <div className="text-center text-muted-foreground">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Nenhuma empresa ativa encontrada</p>
            <p className="text-sm">Cadastre e ative uma empresa primeiro para poder criar lojas.</p>
          </div>
        </div>
      )}

      {/* Tabela usando tokens semânticos */}
      <div className="app-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-b-2 border-border">
              <TableHead className="font-semibold text-foreground py-4">Loja</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Empresa</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Contato</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Colaboradores</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
              <TableHead className="font-semibold text-foreground py-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store, index) => (
              <TableRow 
                key={store.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? "bg-card" : "bg-muted/20"
                }`}
              >
                <TableCell className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 app-icon-container flex-shrink-0 mt-1">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{store.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {store.address}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="text-foreground font-medium">{store.companyName}</span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {store.phone}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {store.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">{store.employeeCount}</span>
                    <span className="text-xs text-muted-foreground">pessoas</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant={store.isActive ? "default" : "secondary"}
                    className={store.isActive ? "app-status-active" : "app-status-inactive"}
                  >
                    {store.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(store)}
                      className="h-8 w-8 p-0 border-border hover:border-primary hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(store.id)}
                      disabled={store.employeeCount > 0}
                      className="h-8 w-8 p-0 border-border hover:border-destructive hover:text-destructive disabled:opacity-50"
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
