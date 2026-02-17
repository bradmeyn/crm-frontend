import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  type: z.string().min(1, "Type is required"),
});

export type NewNote = z.infer<typeof noteSchema>;

export const NOTE_TYPES = [
  { value: "general", label: "General" },
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "task", label: "Task" },
  { value: "follow-up", label: "Follow Up" },
] as const;
