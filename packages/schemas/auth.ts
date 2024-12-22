import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const registerSchema = loginSchema
	.extend({
		name: z.string().min(2),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
