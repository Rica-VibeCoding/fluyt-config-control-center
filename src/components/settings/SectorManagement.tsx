
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useSectorManagement } from '@/hooks/useSectorManagement';
import { SectorForm } from '@/components/settings/sector/SectorForm';
import { SectorTable } from '@/components/settings/sector/SectorTable';
import { Sector, SectorFormData } from '@/types/sector';

export const SectorManagement = () => {
  const { sectors, createSector, updateSector, deleteSector } = useSectorManagement();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState<SectorFormData>({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSector) {
      updateSector(editingSector.id, formData);
    } else {
      createSector(formData);
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

  const handleNewSector = () => {
    setEditingSector(null);
    setFormData({ name: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingSector(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Setores</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewSector}>
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
              <SectorForm
                formData={formData}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEditing={!!editingSector}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SectorTable
        sectors={sectors}
        onEdit={handleEdit}
        onDelete={deleteSector}
      />
    </div>
  );
};
