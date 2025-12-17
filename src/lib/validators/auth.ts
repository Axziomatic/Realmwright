import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ange en giltig email"),
  password: z.string().min(1, "Lösenord krävs"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    username: z.string().min(2, "Minst 2 tecken"),
    email: z.string().email("Ange en giltig email"),
    password: z.string().min(8, "Minst 8 tecken"),
    confirmPassword: z.string().min(8, "Minst 8 tecken"),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, "Du måste acceptera villkoren"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Lösenorden matchar inte",
  });

export type SignupValues = z.infer<typeof signupSchema>;
