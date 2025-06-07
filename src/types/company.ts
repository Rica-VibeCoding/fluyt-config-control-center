
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export interface CompanyFormData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
}
