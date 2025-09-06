import { z } from "zod";

export const clientFormSchema = z.object({
  salutation: z.enum(["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."], {
    required_error: "Please select a salutation",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  preferredName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
});

export type ClientForm = z.infer<typeof clientFormSchema>;
