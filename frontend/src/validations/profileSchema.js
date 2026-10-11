import { z } from "zod";

export const personalSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name required"),

  last_name: z
    .string()
    .min(2, "Last name required"),

  age: z.coerce
    .number()
    .min(16, "Must be at least 16"),

  email: z
    .string()
    .email("Invalid email"),
});

export const academicSchema = z.object({
  preferred_university_type: z.enum(
    ["Public", "Private"],
    {
      required_error: "University preference required",
    }
  ),

  preferred_program_group: z.enum(
    [
      "Computer Science & IT",
      "Engineering & Technology",
      "Business & Management",
      "Medical & Health Sciences",
      "Arts & Humanities",
      "Law & Legal Studies",
    ],
    { required_error: "Program group required" }
  ),

  per_semester_budget: z.coerce
    .number()
    .min(10000, "Invalid amount")
    .max(1000000, "Budget too high"),

  academic_percentage: z.coerce
    .number()
    .min(0, "Invalid academic percentage")
    .max(100, "Percentage cannot exceed 100"),

  scholarship_requirement: z.boolean(),

  hostel_requirement: z.boolean(),

  transport_requirement: z.boolean(),

  entry_test_requirement: z.boolean(),

  specific_universities: z.string().optional(),
});