export interface Product {
  id: number;
  title: string;
  price: number;
  discont_price?: number;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number;
  discountPercent?: number;
}
