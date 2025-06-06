
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, UserCog, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  profile: 'VENDEDOR' | 'GERENTE' | 'MEDIDOR' | 'ADMIN_MASTER';
  storeId: string;
  storeName: string;
  sectorId: string;
  sectorName: string;
  individualDiscountLimit: number;
  overrideCommissionVendor?: number;
  overrideCommissionManager?: number;
  minimumGuaranteed?: number;
  measurementValue?: number;
  isActive: boolean;
  createdAt: string;
}

export const TeamManagement = () => {
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'João Silva Santos',
      email: 'joao@fluyt.com.br',
      profile: 'VENDEDOR',
      storeId: '1',
      storeName: 'Loja Centro',
      sectorId: '1',
      sectorName: 'Vendas',
      individualDiscountLimit: 15,
      overrideCommissionVendor: 3.5,
      isActive: true,
      createdAt: '2024-01-25'
    },
    {
      id: '2',
      name: 'Maria Fernanda Oliveira',
      email: 'maria@fluyt.com.br',
      profile: 'GERENTE',
      storeId: '1',
      storeName: 'Loja Centro',
      sectorId: '1',
      sectorName: 'Vendas',
      individualDiscountLimit: 25,
      overrideCommissionManager: 2,
      minimumGuaranteed: 3000,
      isActive: true,
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Carlos Alberto Medeiros',
      email: 'carlos@fluyt.com.br',
      profile: 'MEDIDOR',
      storeId: '1',
      storeName: 'Loja Centro',
      sectorId: '2',
      sectorName: 'Medição',
      individualDiscountLimit: 0,
      measurementValue: 150,
      isActive: true,
      createdAt: '2024-02-10'
    }
  ]);
  
  const stores = [
    { id: '1', name: 'Loja Centro' },
    { id: '2', name: 'Loja Shopping Norte' }
  ];

  const sectors = [
    { id: '1', name: 'Vendas' },
    { id: '2', name: 'Medição' },
    { id: '3', name: 'Montagem' }
  ];

  const profiles = [
    { value: 'VENDEDOR', label: 'Vendedor' },
    { value: 'GERENTE', label: 'Gerente' },
    { value: 'MEDIDOR', label: 'Medidor' },
    { value: 'ADMIN_MASTER', label: 'Admin Master' }
  ];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: '',
    storeId: '',
    sectorId: '',
    individualDiscountLimit: 0,
    overrideCommissionVendor: '',
    overrideCommissionManager: '',
    minimumGuaranteed: '',
    measurementValue: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate email
    const isDuplicate = team.some(member => 
      member.email === formData.email && member.id !== editingMember?.id
    );
    
    if (isDuplicate) {
      toast({
        title: "Email já cadastrado",
        description: "Este email já está sendo utilizado por outro colaborador.",
        variant: "destructive"
      });
      return;
    }

    const store = stores.find(s => s.id === formData.storeId);
    const sector = sectors.find(s => s.id === formData.sectorId);

    if (editingMember) {
      setTeam(prev => prev.map(member => 
        member.id === editingMember.id 
          ? { 
              ...member,
              name: formData.name,
              email: formData.email,
              profile: formData.profile as any,
              storeId: formData.storeId,
              storeName: store?.name || '',
              sectorId: formData.sectorId,
              sectorName: sector?.name || '',
              individualDiscountLimit: formData.individualDiscountLimit,
              overrideCommissionVendor: formData.overrideCommissionVendor ? Number(formData.overrideCommissionVendor) : undefined,
              overrideCommissionManager: formData.overrideCommissionManager ? Number(formData.overrideCommissionManager) : undefined,
              minimumGuaranteed: formData.minimumGuaranteed ? Number(formData.minimumGuaranteed) : undefined,
              measurementValue: formData.measurementValue ? Number(formData.measurementValue) : undefined
            }
          : member
      ));
      toast({
        title: "Colaborador atualizado",
        description: "Os dados do colaborador foram atualizados com sucesso."
      });
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        profile: formData.profile as any,
        storeId: formData.storeId,
        storeName: store?.name || '',
        sectorId: formData.sectorId,
        sectorName: sector?.name || '',
        individualDiscountLimit: formData.individualDiscountLimit,
        overrideCommissionVendor: formData.overrideCommissionVendor ? Number(formData.overrideCommissionVendor) : undefined,
        overrideCommissionManager: formData.overrideCommissionManager ? Number(formData.overrideCommissionManager) : undefined,
        minimumGuaranteed: formData.minimumGuaranteed ? Number(formData.minimumGuaranteed) : undefined,
        measurementValue: formData.measurementValue ? Number(formData.measurementValue) : undefined,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeam(prev => [...prev, newMember]);
      toast({
        title: "Colaborador cadastrado",
        description: "Novo colaborador adicionado com sucesso."
      });
    }

    handleCloseDialog();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      profile: member.profile,
      storeId: member.storeId,
      sectorId: member.sectorId,
      individualDiscountLimit: member.individualDiscountLimit,
      overrideCommissionVendor: member.overrideCommissionVendor?.toString() || '',
      overrideCommissionManager: member.overrideCommissionManager?.toString() || '',
      minimumGuaranteed: member.minimumGuaranteed?.toString() || '',
      measurementValue: member.measurementValue?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (memberId: string) => {
    setTeam(prev => prev.filter(m => m.id !== memberId));
    toast({
      title: "Colaborador removido",
      description: "O colaborador foi removido com sucesso."
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      profile: '',
      storeId: '',
      sectorId: '',
      individualDiscountLimit: 0,
      overrideCommissionVendor: '',
      overrideCommissionManager: '',
      minimumGuaranteed: '',
      measurementValue: ''
    });
  };

  const getProfileBadgeVariant = (profile: string) => {
    switch (profile) {
      case 'ADMIN_MASTER': return 'destructive';
      case 'GERENTE': return 'default';
      case 'VENDEDOR': return 'secondary';
      case 'MEDIDOR': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Gestão de Equipe
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCloseDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Colaborador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? 'Editar Colaborador' : 'Novo Colaborador'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do colaborador"
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
                      placeholder="email@empresa.com.br"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="profile">Perfil *</Label>
                    <Select
                      value={formData.profile}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, profile: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.value} value={profile.value}>
                            {profile.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="storeId">Loja *</Label>
                    <Select
                      value={formData.storeId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, storeId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a loja" />
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
                  <div>
                    <Label htmlFor="sectorId">Setor *</Label>
                    <Select
                      value={formData.sectorId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sectorId: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="individualDiscountLimit">Limite Individual de Desconto (%)</Label>
                  <Input
                    id="individualDiscountLimit"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.individualDiscountLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, individualDiscountLimit: Number(e.target.value) }))}
                  />
                </div>

                {/* Conditional fields based on profile */}
                {(formData.profile === 'VENDEDOR' || formData.profile === 'GERENTE') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="overrideCommissionVendor">Override Comissão Vendedor (%)</Label>
                      <Input
                        id="overrideCommissionVendor"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.overrideCommissionVendor}
                        onChange={(e) => setFormData(prev => ({ ...prev, overrideCommissionVendor: e.target.value }))}
                        placeholder="Deixe vazio para usar regra padrão"
                      />
                    </div>
                    {formData.profile === 'GERENTE' && (
                      <div>
                        <Label htmlFor="overrideCommissionManager">Override Comissão Gerente (%)</Label>
                        <Input
                          id="overrideCommissionManager"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.overrideCommissionManager}
                          onChange={(e) => setFormData(prev => ({ ...prev, overrideCommissionManager: e.target.value }))}
                          placeholder="Deixe vazio para usar regra padrão"
                        />
                      </div>
                    )}
                  </div>
                )}

                {formData.profile === 'GERENTE' && (
                  <div>
                    <Label htmlFor="minimumGuaranteed">Mínimo Garantido (R$)</Label>
                    <Input
                      id="minimumGuaranteed"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minimumGuaranteed}
                      onChange={(e) => setFormData(prev => ({ ...prev, minimumGuaranteed: e.target.value }))}
                      placeholder="Valor mínimo garantido"
                    />
                  </div>
                )}

                {formData.profile === 'MEDIDOR' && (
                  <div>
                    <Label htmlFor="measurementValue">Valor por Medição (R$) *</Label>
                    <Input
                      id="measurementValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.measurementValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, measurementValue: e.target.value }))}
                      placeholder="Valor pago por medição realizada"
                      required={formData.profile === 'MEDIDOR'}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingMember ? 'Atualizar' : 'Cadastrar'}
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
                <TableHead>Colaborador</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Loja/Setor</TableHead>
                <TableHead>Limite Desc.</TableHead>
                <TableHead>Comissões</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getProfileBadgeVariant(member.profile)}>
                      {member.profile}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {member.storeName}
                      </div>
                      <div className="text-muted-foreground">{member.sectorName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{member.individualDiscountLimit}%</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.overrideCommissionVendor && (
                        <div>V: {member.overrideCommissionVendor}%</div>
                      )}
                      {member.overrideCommissionManager && (
                        <div>G: {member.overrideCommissionManager}%</div>
                      )}
                      {member.measurementValue && (
                        <div>M: R$ {member.measurementValue}</div>
                      )}
                      {member.minimumGuaranteed && (
                        <div className="text-green-600">Min: R$ {member.minimumGuaranteed}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
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
