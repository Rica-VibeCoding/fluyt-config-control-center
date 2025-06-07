
export interface Sector {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  createdAt: string;
}

export interface SectorFormData {
  name: string;
  description: string;
}
