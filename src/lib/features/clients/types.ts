export interface Client {
  id: string;
  salutation: "Mr." | "Ms." | "Mrs." | "Dr." | "Prof.";
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
}
