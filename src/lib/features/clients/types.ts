export interface Client {
  id: string;
  salutation: "Mr." | "Ms." | "Mrs." | "Dr." | "Prof.";
  first_name: string;
  last_name: string;
  preferred_name?: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  business_id: string;
}
