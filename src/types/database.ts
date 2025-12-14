export type AppRole = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string | null;
  quantity: number;
  total_price: number;
  purchased_at: string;
}

export interface SweetFormData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
}
