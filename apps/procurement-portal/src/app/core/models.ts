export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CatalogItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
