
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Layers, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Sector {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  createdAt: string;
}

export const SectorManagement = () => {
  const { toast } = useToast();
  const [sectors, setSectors] = useState<Sector[]>([
    {
      id: '1',
      name: 'Vendas',
      description: 'Setor responsável pelo atendimento e vendas',
      employeeCount: 12,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Medição',
      description: 'Setor responsável pelas medições técnicas',
      employeeCount: 3,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Montagem',
      description: 'Coordenação de montadores',
      employeeCount: 2,
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      name: 'Administração',
      description: 'Gestão administrativa e financeira',
      employeeCount: 4,
      createdAt: '2024-02-10'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSector) {
      setSectors(prev => prev.map(sector => 
        sector.id === editingSector.id 
          ? { ...sector, ...formData }
          : sector
      ));
      toast({
        title: "Setor atualizado",
        description: "Os dados do setor foram atualizados com sucesso."
      });
    } else {
      const newSector: Sector = {
        id: Date.now().toString(),
        ...formData,
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSectors(prev => [...prev, newSector]);
      toast({
        title: "Setor cadastrado",
        description: "Novo setor adicionado com sucesso."
      });
    }

    setIsDialogOpen(false);
    setEditingSector(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name,
      description: sector.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector && sector.employeeCount > 0) {
      toast({
        title: "Não é possível excluir",
        description: "Este setor possui colaboradores vinculados. Remova os colaboradores primeiro.",
        variant: "destructive"
      });
      return;
    }

    setSectors(prev => prev.filter(s => s.id !== sectorId));
    toast({
      title: "Setor removido",
      description: "O setor foi removido com sucesso."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Gestão de Setores
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingSector(null);
                setFormData({ name: '', description: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Setor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSector ? 'Editar Setor' : 'Novo Setor'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Setor *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome do setor"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Breve descrição do setor"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingSector ? 'Atualizar' : 'Cadastrar'}
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
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Colaboradores</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell className="font-medium">{sector.name}</TableCell>
                  <TableCell className="text-muted-foreground">{sector.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {sector.employeeCount}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(sector.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sector)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(sector.id)}
                        disabled={sector.employeeCount > 0}
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
