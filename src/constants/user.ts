import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 6;

export const signUpFormSchema = z.object({
  name: z.string().min(2, "Please type your name"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    ),
});

export const updateFormSchema = signUpFormSchema
  .extend({
    password: z.string().optional(),
    confirmationPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmationPassword) {
        return true;
      }

      return data.password === data.confirmationPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmationPassword"],
    }
  );

export const logInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    ),
});
