export interface User {
  id: number;
  name: string;
  email: string;
  status?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Balance {
  balance: string;
}

export interface Mutation {
  id: number;
  type: "credit" | "debit";
  amount: string;
  balance_before: string;
  balance_after: string;
  note: string | null;
  created_at: string;
}

export interface Transaction {
  reference: string;
  payment_method: "qris" | "va" | "emoney";
  amount: string;
  fee: string;
  net_amount: string;
  status: "pending" | "success" | "failed" | "expired";
  qr_content: string | null;
  qr_url: string | null;
  virtual_account_no: string | null;
  expired_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Settlement {
  id: number;
  total_transaction: number;
  total_amount: string;
  total_fee: string;
  net_settlement: string;
  status: "pending" | "processing" | "success" | "failed";
  scheduled_at: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface ApiKeyInfo {
  id: number;
  preview: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface GeneratedKey {
  id: number;
  key: string;
  secret: string;
  preview: string;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}
