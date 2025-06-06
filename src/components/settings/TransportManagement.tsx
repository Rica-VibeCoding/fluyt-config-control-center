
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transport {
  id: string;
  companyName: string;
  fixedValue: number;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export const TransportManagement = () => {
  const { toast } = useToast();
  const [transports, setTransports] = useState<Transport[]>([
    {
      id: '1',
      companyName: 'Transportes Rápidos Ltda',
      fixedValue: 120,
      phone: '(11) 3333-4444',
      email: 'contato@rapidostransportes.com.br',
      isActive: true,
      createdAt: '2024-01-25'
    },
    {
      id: '2',
      companyName: 'Entrega Express',
      fixedValue: 95,
      phone: '(11) 5555-6666',
      email: 'vendas@entregaexpress.com.br',
      isActive: true,
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      companyName: 'LogiMóveis Transportes',
      fixedValue: 150,
      phone: '(11) 7777-8888',
      email: 'operacao@logimoveis.com.br',
      isActive: false,
      createdAt: '2024-03-01'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<Transport | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    fixedValue: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransport) {
      setTransports(prev => prev.map(transport => 
        transport.id === editingTransport.id 
          ? { 
              ...transport,
              companyName: formData.companyName,
              fixedValue: Number(formData.fixedValue),
              phone: formData.phone,
              email: formData.email
            }
          : transport
      ));
      toast({
        title: "Transportadora atualizada",
        description: "Os dados da transportadora foram atualizados com sucesso."
      });
    } else {
      const newTransport: Transport = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        fixedValue: Number(formData.fixedValue),
        phone: formData.phone,
        email: formData.email,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTransports(prev => [...prev, newTransport]);
      toast({
        title: "Transportadora cadastrada",
        description: "Nova transportadora adicionada com sucesso."
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (transport: Transport) => {
    setEditingTransport(transport);
    setFormData({
      companyName: transport.companyName,
      fixedValue: transport.fixedValue.toString(),
      phone: transport.phone,
      email: transport.email
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (transportId: string) => {
    setTransports(prev => prev.filter(t => t.id !== transportId));
    toast({
      title: "Transportadora removida",
      description: "A transportadora foi removida com sucesso."
    });
  };

  const toggleStatus = (transportId: string) => {
    setTransports(prev => prev.map(transport => 
      transport.id === transportId 
        ? { ...transport, isActive: !transport.isActive }
        : transport
    ));
    
    const transport = transports.find(t => t.id === transportId);
    toast({
      title: `Transportadora ${transport?.isActive ? 'desativada' : 'ativada'}`,
      description: `A transportadora foi ${transport?.isActive ? 'desativada' : 'ativada'} com sucesso.`
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransport(null);
    setFormData({
      companyName: '',
      fixedValue: '',
      phone: '',
      email: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestão de Transportadoras
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCloseDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transportadora
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTransport ? 'Editar Transportadora' : 'Nova Transportadora'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nome da transportadora"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fixedValue">Valor Fixo por Entrega (R$) *</Label>
                  <Input
                    id="fixedValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fixedValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, fixedValue: e.target.value }))}
                    placeholder="Valor fixo por entrega"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 3333-4444"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@transportadora.com.br"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingTransport ? 'Atualizar' : 'Cadastrar'}
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
                <TableHead>Valor Fixo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transports.map((transport) => (
                <TableRow key={transport.id}>
                  <TableCell className="font-medium">{transport.companyName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(transport.fixedValue)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transport.phone}</div>
                      {transport.email && (
                        <div className="text-muted-foreground">{transport.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(transport.id)}
                    >
                      <Badge variant={transport.isActive ? "default" : "secondary"}>
                        {transport.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transport)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(transport.id)}
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
