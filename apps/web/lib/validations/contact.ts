import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => {
      if (v === undefined) return undefined;
      if (v === null) return null;
      const trimmed = v.trim();
      return trimmed === "" ? null : trimmed;
    })
    .pipe(
      z
        .string()
        .max(max, `must be at most ${max} characters`)
        .nullable()
        .optional()
    );

export const createContactSchema = z.object({
  fullName: z
    .string({ error: "fullName is required" })
    .trim()
    .min(2, "fullName must be at least 2 characters")
    .max(120, "fullName must be at most 120 characters"),

  phone: z
    .string({ error: "phone is required" })
    .trim()
    .min(7, "phone must contain at least 7 digits")
    .max(32, "phone must be at most 32 characters")
    .refine(
      (v) => (v.match(/\d/g) ?? []).length >= 7,
      "phone must contain at least 7 digits"
    ),

  email: z
    .string({ error: "email is required" })
    .trim()
    .toLowerCase()
    .email("email must be a valid email address")
    .max(200, "email must be at most 200 characters"),

  service: optionalTrimmed(120),
  address: optionalTrimmed(500),
  message: optionalTrimmed(2000),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
