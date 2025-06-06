
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetStatus {
  id: string;
  name: string;
  order: number;
  blocksEditing: boolean;
  isDefault: boolean;
  isFinal: boolean;
  storeId: string;
  storeName: string;
  isActive: boolean;
  createdAt: string;
}

export const StatusConfig = () => {
  const { toast } = useToast();
  const [selectedStore, setSelectedStore] = useState('1');
  const [statuses, setStatuses] = useState<BudgetStatus[]>([
    {
      id: '1',
      name: 'Rascunho',
      order: 1,
      blocksEditing: false,
      isDefault: true,
      isFinal: false,
      storeId: '1',
      storeName: 'Loja Centro',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Em Análise',
      order: 2,
      blocksEditing: false,
      isDefault: false,
      isFinal: false,
      storeId: '1',
      storeName: 'Loja Centro',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Aprovado',
      order: 3,
      blocksEditing: true,
      isDefault: false,
      isFinal: false,
      storeId: '1',
      storeName: 'Loja Centro',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Vendido',
      order: 4,
      blocksEditing: true,
      isDefault: false,
      isFinal: true,
      storeId: '1',
      storeName: 'Loja Centro',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Perdido',
      order: 5,
      blocksEditing: true,
      isDefault: false,
      isFinal: true,
      storeId: '1',
      storeName: 'Loja Centro',
      isActive: true,
      createdAt: '2024-01-15'
    }
  ]);
  
  const stores = [
    { id: '1', name: 'Loja Centro' },
    { id: '2', name: 'Loja Shopping Norte' }
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<BudgetStatus | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    blocksEditing: false,
    isDefault: false,
    isFinal: false
  });

  const filteredStatuses = statuses.filter(s => s.storeId === selectedStore).sort((a, b) => a.order - b.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if trying to set another default
    if (formData.isDefault) {
      const existingDefault = statuses.find(s => 
        s.isDefault && 
        s.storeId === selectedStore && 
        s.id !== editingStatus?.id
      );
      
      if (existingDefault) {
        toast({
          title: "Status padrão já existe",
          description: "Apenas um status pode ser padrão por loja. Remova o padrão atual primeiro.",
          variant: "destructive"
        });
        return;
      }
    }

    const store = stores.find(s => s.id === selectedStore);
    
    if (editingStatus) {
      setStatuses(prev => prev.map(status => 
        status.id === editingStatus.id 
          ? { 
              ...status,
              name: formData.name,
              blocksEditing: formData.blocksEditing,
              isDefault: formData.isDefault,
              isFinal: formData.isFinal
            }
          : status
      ));
      toast({
        title: "Status atualizado",
        description: "O status foi atualizado com sucesso."
      });
    } else {
      const maxOrder = Math.max(...filteredStatuses.map(s => s.order), 0);
      const newStatus: BudgetStatus = {
        id: Date.now().toString(),
        name: formData.name,
        order: maxOrder + 1,
        blocksEditing: formData.blocksEditing,
        isDefault: formData.isDefault,
        isFinal: formData.isFinal,
        storeId: selectedStore,
        storeName: store?.name || '',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStatuses(prev => [...prev, newStatus]);
      toast({
        title: "Status criado",
        description: "Novo status adicionado com sucesso."
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (status: BudgetStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      blocksEditing: status.blocksEditing,
      isDefault: status.isDefault,
      isFinal: status.isFinal
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    
    if (status?.isDefault) {
      toast({
        title: "Não é possível excluir",
        description: "Não é possível excluir o status padrão da loja.",
        variant: "destructive"
      });
      return;
    }

    setStatuses(prev => prev.filter(s => s.id !== statusId));
    toast({
      title: "Status removido",
      description: "O status foi removido com sucesso."
    });
  };

  const moveStatus = (statusId: string, direction: 'up' | 'down') => {
    const status = filteredStatuses.find(s => s.id === statusId);
    if (!status) return;

    const currentIndex = filteredStatuses.findIndex(s => s.id === statusId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= filteredStatuses.length) return;

    const targetStatus = filteredStatuses[newIndex];
    
    setStatuses(prev => prev.map(s => {
      if (s.id === status.id) {
        return { ...s, order: targetStatus.order };
      }
      if (s.id === targetStatus.id) {
        return { ...s, order: status.order };
      }
      return s;
    }));

    toast({
      title: "Ordem atualizada",
      description: "A ordem dos status foi atualizada."
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStatus(null);
    setFormData({
      name: '',
      blocksEditing: false,
      isDefault: false,
      isFinal: false
    });
  };

  const getStatusColor = (status: BudgetStatus) => {
    if (status.isDefault) return 'default';
    if (status.isFinal) return status.name === 'Perdido' ? 'destructive' : 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Status de Orçamento
            </CardTitle>
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="store">Loja:</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCloseDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingStatus ? 'Editar Status' : 'Novo Status'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do Status *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Digite o nome do status"
                        required
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="blocksEditing">Bloqueia Edição</Label>
                        <Switch
                          id="blocksEditing"
                          checked={formData.blocksEditing}
                          onCheckedChange={(checked) => setFormData(prev => ({ 
                            ...prev, 
                            blocksEditing: checked 
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isDefault">Status Padrão da Loja</Label>
                        <Switch
                          id="isDefault"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) => setFormData(prev => ({ 
                            ...prev, 
                            isDefault: checked 
                          }))}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isFinal">Status Final</Label>
                        <Switch
                          id="isFinal"
                          checked={formData.isFinal}
                          onCheckedChange={(checked) => setFormData(prev => ({ 
                            ...prev, 
                            isFinal: checked,
                            blocksEditing: checked ? true : prev.blocksEditing 
                          }))}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingStatus ? 'Atualizar' : 'Criar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Propriedades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStatuses.map((status, index) => (
                  <TableRow key={status.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{status.order}</Badge>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStatus(status.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStatus(status.id, 'down')}
                            disabled={index === filteredStatuses.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{status.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {status.isDefault && (
                          <Badge variant="default" className="text-xs">Padrão</Badge>
                        )}
                        {status.blocksEditing && (
                          <Badge variant="secondary" className="text-xs">Bloqueia</Badge>
                        )}
                        {status.isFinal && (
                          <Badge variant="outline" className="text-xs">Final</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(status)}>
                        {status.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(status)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(status.id)}
                          disabled={status.isDefault}
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
    </div>
  );
};
