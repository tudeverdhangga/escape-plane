import z from "zod";

export const formSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).pipe(z.email({ message: "Invalid email address" })),
	password: z.string().min(1, { message: "Password is required" }),
})
