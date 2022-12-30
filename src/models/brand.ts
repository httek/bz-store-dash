import { Category } from "./category";

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  sequence?: number;
  status?: number;
  site?: string;
  description?: string;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  category?: Category | null
}