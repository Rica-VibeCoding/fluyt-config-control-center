
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2 } from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
  onToggleStatus: (companyId: string) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{company.name}</div>
                  <div className="text-sm text-muted-foreground">{company.address}</div>
                </div>
              </TableCell>
              <TableCell>{company.cnpj}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{company.email}</div>
                  <div className="text-muted-foreground">{company.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={company.isActive}
                    onCheckedChange={() => onToggleStatus(company.id)}
                  />
                  <Badge variant={company.isActive ? "default" : "secondary"}>
                    {company.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(company)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(company.id)}
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
