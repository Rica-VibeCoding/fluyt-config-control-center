
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Header simplificado */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Setores</h2>
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
      </div>

      {/* Tabela com melhor contraste e densidade */}
      <div className="border border-border rounded-md overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b-2 border-border">
              <TableHead className="font-semibold text-foreground py-3">Nome</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Descrição</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Colaboradores</TableHead>
              <TableHead className="font-semibold text-foreground py-3">Criado em</TableHead>
              <TableHead className="font-semibold text-foreground py-3 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectors.map((sector, index) => (
              <TableRow 
                key={sector.id}
                className={`border-b border-border/50 hover:bg-muted/30 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <TableCell className="font-medium py-2.5 text-foreground">{sector.name}</TableCell>
                <TableCell className="text-muted-foreground py-2.5">{sector.description}</TableCell>
                <TableCell className="py-2.5">
                  <span className="text-foreground font-medium">{sector.employeeCount}</span>
                </TableCell>
                <TableCell className="py-2.5 text-foreground">{new Date(sector.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right py-2.5">
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
    </div>
  );
};
