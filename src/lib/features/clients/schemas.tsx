import { z } from "zod";

export const clientSchema = z.object({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr", "Prof"], {
    required_error: "Please select a title",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  preferredName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export type NewClient = z.infer<typeof clientSchema>;
