export interface Product {
  id: number;
  category_id?: number;
  uuid?: string;
  name?: string;
  covers: string[];
  description?: string;
  status?: number;
  sequence?: number;
  created_at?: string;
  updated_at?: string;
}