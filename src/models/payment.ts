export interface Payment {
  id?: number;
  type?: number;
  version?: number;
  name?: string;
  merchant_id?: string;
  merchant_name?: string;
  secret?: string;
  serial?: string;
  public_key?: string;
  private_key?: string;
  platform_public_key?: string;
  platform_key_serial?: string;
  status?: number;
  created_by?: string;
  expired_at?: string;
  created_at?: string;
  updated_at?: string;
}