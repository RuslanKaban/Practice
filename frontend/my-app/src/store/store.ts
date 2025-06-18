export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';


export interface Category {
  id: number;
  title: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  discont_price: number | null;
  description: string;
  image: string;
  categoryId: number;
}

export const api = {
  async fetchCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories/all`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  },

  async fetchProductsByCategory(id: number): Promise<{category: Category, data: Product[]}> {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  }
};