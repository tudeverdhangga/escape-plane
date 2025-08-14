"use server"

import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { userFormSchema, userUpdateFormSchema } from "./validation";
import type { RoleUser } from "@/generated/prisma";

export interface ActionResult {
	errorTitle: string | null;
	errorDesc: string[] | null;
}

export async function saveUser(_state: ActionResult, formData: FormData): Promise<ActionResult> {	
	// Ensure formData is actually a FormData object
	if (!(formData instanceof FormData)) {
		console.error("❌ FormData is not an instance of FormData:", formData);
		return {
			errorTitle: "Form Error",
			errorDesc: ["Invalid form data received"],
		};
	}
	
	const formObject: Record<string, string | File> = {};
	for (const [key, value] of formData.entries()) {
		formObject[key] = value;
	}

	// Validate the form data
	const values = userFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		// Check if email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: values.data.email }
		});

		if (existingUser) {
			return {
				errorTitle: "Email Error",
				errorDesc: ["Email sudah digunakan oleh pengguna lain"],
			};
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(values.data.password!, 10);

		// Create the user
		await prisma.user.create({
			data: {
				name: values.data.name,
				email: values.data.email,
				password: hashedPassword,
				role: values.data.role,
				passport: values.data.passport || null,
			}
		});

	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menyimpan data pengguna."],
		};
	}
	
	revalidatePath("/dashboard/users");
	redirect("/dashboard/users");
}

export async function updateUser(id: string, _state: ActionResult, formData: FormData): Promise<ActionResult> {
	const formObject: Record<string, string | File> = {};
	for (const [key, value] of formData.entries()) {
		formObject[key] = value;
	}

	const values = userUpdateFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		// Check if email already exists (excluding current user)
		const existingUser = await prisma.user.findFirst({
			where: { 
				email: values.data.email,
				NOT: { id: id }
			}
		});

		if (existingUser) {
			return {
				errorTitle: "Email Error",
				errorDesc: ["Email sudah digunakan oleh pengguna lain"],
			};
		}

		// Prepare update data
		const updateData: {
			name: string;
			email: string;
			role: RoleUser;
			passport: string | null;
			password?: string;
		} = {
			name: values.data.name,
			email: values.data.email,
			role: values.data.role,
			passport: values.data.passport || null,
		};

		// Only hash and update password if provided
		if (values.data.password && values.data.password.trim() !== "") {
			updateData.password = await bcrypt.hash(values.data.password, 10);
		}

		// Update the user
		await prisma.user.update({
			where: { id },
			data: updateData
		});

	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat mengupdate data pengguna."],
		};
	}

	revalidatePath("/dashboard/users");
	redirect("/dashboard/users");
}

export interface ActionResult {
	errorTitle: string | null;
	errorDesc: string[] | null;
}

export async function deleteUser(id: string): Promise<ActionResult> {
	try {
		// Check if user has any tickets
		const userTickets = await prisma.ticket.findFirst({
			where: { customerId: id }
		});

		if (userTickets) {
			return {
				errorTitle: "Error",
				errorDesc: ["Tidak dapat menghapus pengguna yang memiliki tiket"],
			};
		}

		// Delete the user
		await prisma.user.delete({
			where: { id }
		});

		revalidatePath("/dashboard/users");
		return {
			errorTitle: null,
			errorDesc: null,
		};
	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menghapus data pengguna."],
		};
	}
}

export async function getUserById(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				passport: true,
			},
		});
		return user;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}
