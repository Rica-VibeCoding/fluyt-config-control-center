
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Sector } from '@/types/sector';

interface SectorTableProps {
  sectors: Sector[];
  onEdit: (sector: Sector) => void;
  onDelete: (sectorId: string) => void;
}

export const SectorTable: React.FC<SectorTableProps> = ({
  sectors,
  onEdit,
  onDelete
}) => {
  return (
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
                    onClick={() => onEdit(sector)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(sector.id)}
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
  );
};
