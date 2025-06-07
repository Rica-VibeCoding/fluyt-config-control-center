
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sector, SectorFormData } from '@/types/sector';

export const useSectorManagement = () => {
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

  const createSector = (formData: SectorFormData) => {
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
  };

  const updateSector = (sectorId: string, formData: SectorFormData) => {
    setSectors(prev => prev.map(sector => 
      sector.id === sectorId 
        ? { ...sector, ...formData }
        : sector
    ));
    toast({
      title: "Setor atualizado",
      description: "Os dados do setor foram atualizados com sucesso."
    });
  };

  const deleteSector = (sectorId: string) => {
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

  // Função para ser usada em outros componentes que precisam listar setores
  const getAllSectors = () => sectors;

  return {
    sectors,
    createSector,
    updateSector,
    deleteSector,
    getAllSectors
  };
};
