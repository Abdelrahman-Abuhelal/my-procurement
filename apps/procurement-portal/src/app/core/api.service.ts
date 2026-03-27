import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { AuthResponse, CatalogItem } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  signIn(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/signin`, payload);
  }

  signUp(payload: { name: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/signup`, payload);
  }

  getMe() {
    return this.http.get<AuthResponse['user']>(`${API_BASE_URL}/auth/me`);
  }

  getItems(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get<CatalogItem[]>(`${API_BASE_URL}/items${query}`);
  }

  createItem(payload: {
    title: string;
    description: string;
    category: string;
    price: number;
  }) {
    return this.http.post<CatalogItem>(`${API_BASE_URL}/items`, payload);
  }
}
