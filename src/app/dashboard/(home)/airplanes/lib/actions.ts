"use server"

import { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { airplaneFormSchema } from "./validation";
import { redirect } from "next/navigation";
import { deleteFile, uploadFile } from '@/lib/supabase';
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAirplaneById(id: string) {
	try {
		const airplane = await prisma.airplane.findFirst({
			where: { id }
		});
		if (!airplane) {
			throw new Error("Airplane not found");
		}
		return airplane;
	} catch (error) {
		console.error("Error fetching airplane:", error);
		throw new Error("Failed to fetch airplane");
	}
}

export async function saveAirplane(formData: FormData): Promise<ActionResult> {
	const values = airplaneFormSchema.safeParse({
		code: formData.get("code"),
		name: formData.get("name"),
		image: formData.get("image"),
	});
	
	if (!values.success) {
		return {
			errorTitle: "Invalid form data",
			errorDesc: values.error.issues.map(issue => issue.message) || [],
		};
	}

	const uploadedFile = await uploadFile(values.data.image)

	if (!uploadedFile) {
		return {
			errorTitle: "File upload failed",
			errorDesc: ['Terjadi masalah saat mengunggah file. Pastikan file yang diunggah adalah gambar dengan ukuran maksimal 2MB.'],
		};
	}

	try {
		await prisma.airplane.create({
			data: {
				code: values.data.code,
				name: values.data.name,
				image: uploadedFile as string
			}
		});
	} catch {
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menyimpan data pesawat."],
		};
	}
	
	revalidatePath("/dashboard/airplanes");
	redirect("/dashboard/airplanes");
}

export async function updateAirplane(id: string, formData: FormData): Promise<ActionResult> {
	const image = formData.get("image") as File;
	let airplaneFormSchemaUpdate = null
	if (image.size === 0) {
		airplaneFormSchemaUpdate = airplaneFormSchema.omit({image: true})
	} else {
		airplaneFormSchemaUpdate = airplaneFormSchema
	}
	
	const values = airplaneFormSchemaUpdate.safeParse({
		code: formData.get("code"),
		name: formData.get("name"),
		image: formData.get("image"),
	});

	if (!values.success) {
		return {
			errorTitle: "Invalid form data",
			errorDesc: values.error.issues.map(issue => issue.message) || [],
		};
	}

	let filename = null
	if (image.size > 0) {
		const uploadedFile = await uploadFile(image)
		if (!uploadedFile) {
			return {
				errorTitle: "File upload failed",
				errorDesc: ['Terjadi masalah saat mengunggah file. Pastikan file yang diunggah adalah gambar dengan ukuran maksimal 2MB.'],
			};
		}
		filename = uploadedFile as string;
	} else {
		const existingAirplane = await prisma.airplane.findFirst({
			where: { id },
			select: { image: true },
		});
		if (!existingAirplane) {
			return {
				errorTitle: "Airplane not found",
				errorDesc: [],
			};
		}
		filename = existingAirplane.image;
	}

	try {
		await prisma.airplane.update({
			where: { id },
			data: {
				code: values.data.code,
				name: values.data.name,
				image: filename as string
			},
		});
	} catch {
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat memperbarui data pesawat."],
		};
	}

	revalidatePath("/dashboard/airplanes");
	redirect("/dashboard/airplanes");
}

export async function deleteAirplane(id: string): Promise<ActionResult> {
	const airplane = await prisma.airplane.findFirst({
		where: { id }
	});
	if (!airplane) {
		return {
			errorTitle: "Airplane not found",
			errorDesc: [],
		};
	}
	
	try {
		await deleteFile(airplane?.image || "");
	} catch {
		return {
			errorTitle: "File deletion failed",
			errorDesc: ['Terjadi masalah saat menghapus file.'],
		};
	}

	try {
		await prisma.airplane.delete({
			where: { id },
		});
	} catch (error) {
		console.error("Error deleting airplane:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menghapus data pesawat."],
		};
	}

	revalidatePath("/dashboard/airplanes");
	
	return {
		errorTitle: "",
		errorDesc: [],
	};
}