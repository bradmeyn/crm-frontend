import { z } from "zod";

export const clientFormSchema = z.object({
  salutation: z.enum(["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."], {
    required_error: "Please select a salutation",
  }),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  preferred_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export type ClientForm = z.infer<typeof clientFormSchema>;
