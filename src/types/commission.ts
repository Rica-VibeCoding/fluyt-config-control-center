
export interface CommissionRule {
  id: string;
  type: 'VENDEDOR' | 'GERENTE';
  order: number;
  minValue: number;
  maxValue: number | null;
  percentage: number;
  isActive: boolean;
  createdAt: string;
}

export interface CommissionFormData {
  type: 'VENDEDOR' | 'GERENTE';
  minValue: string;
  maxValue: string;
  percentage: string;
}
