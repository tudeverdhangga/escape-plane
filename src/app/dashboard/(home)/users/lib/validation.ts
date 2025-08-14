import { z } from "zod";

export const userFormSchema = z.object({
	name: z
		.string({ message: "Nama tidak boleh kosong" })
		.min(2, { message: "Nama harus memiliki minimal 2 karakter" }),
	email: z
		.string({ message: "Email tidak boleh kosong" })
		.email({ message: "Format email tidak valid" }),
	password: z
		.string({ message: "Password tidak boleh kosong" })
		.min(6, { message: "Password harus memiliki minimal 6 karakter" })
		.optional(),
	role: z
		.enum(["CUSTOMER", "ADMIN"], {
			message: "Role harus dipilih"
		}),
	passport: z
		.string()
		.optional()
});

export const userUpdateFormSchema = z.object({
	name: z
		.string({ message: "Nama tidak boleh kosong" })
		.min(2, { message: "Nama harus memiliki minimal 2 karakter" }),
	email: z
		.string({ message: "Email tidak boleh kosong" })
		.email({ message: "Format email tidak valid" }),
	password: z
		.string()
		.min(6, { message: "Password harus memiliki minimal 6 karakter" })
		.optional()
		.or(z.literal("")),
	role: z
		.enum(["CUSTOMER", "ADMIN"], {
			message: "Role harus dipilih"
		}),
	passport: z
		.string()
		.optional()
});
