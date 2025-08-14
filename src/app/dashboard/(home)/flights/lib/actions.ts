"use server"

import { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { redirect } from "next/navigation";
import { flightFormSchema } from "./validation";
import prisma from "~/lib/prisma";
import { generateSeatPerClass } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function saveFlight(_state: ActionResult, formData: FormData): Promise<ActionResult> {
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
		// Convert datetime-local format to ISO DateTime during form processing
		if (key === 'departureDate' || key === 'arrivalDate') {
			const dateTime = new Date(value as string);
			formObject[key] = dateTime.toISOString();
		} else {
			formObject[key] = value;
		}
	}

	// Validate the form data
	const values = flightFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		const data = await prisma.flight.create({
			data: {
				...values.data,
				price: Number.parseInt(values.data.price)
			}
		});

		const seats = generateSeatPerClass(data.id);
		await prisma.flightSeat.createMany({
			data: seats
		});
	} catch {
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menyimpan data penerbangan."],
		};
	}
	
	revalidatePath("/dashboard/flights");
	redirect("/dashboard/flights");
}

export async function getFlightById(id: string) {
	try {
		const flight = await prisma.flight.findFirst({
			where: { id }
		})
		if (!flight) {
			throw new Error("Flight not found");
		}
		return flight;
	} catch (error) {
		console.error("Error fetching flight:", error);
		throw new Error("Failed to fetch flight");
	}
}

export async function updateFlight(id: string, formData: FormData): Promise<ActionResult> {
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
		// Convert datetime-local format to ISO DateTime during form processing
		if (key === 'departureDate' || key === 'arrivalDate') {
			const dateTime = new Date(value as string);
			formObject[key] = dateTime.toISOString();
		} else {
			formObject[key] = value;
		}
	}

	// Validate the form data
	const values = flightFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		await prisma.flight.update({
			where: { id },
			data: {
				...values.data,
				price: Number.parseInt(values.data.price)
			}
		});
	} catch {
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat memperbarui data penerbangan."],
		};
	}

	revalidatePath("/dashboard/flights");
	redirect("/dashboard/flights");
}

export async function deleteFlight(id: string): Promise<ActionResult> {
	try {
		await prisma.flightSeat.deleteMany({
			where: { flightId: id }
		});
		await prisma.flight.delete({
			where: { id }
		});
	} catch (error) {
		console.error("Error deleting flight:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menghapus data penerbangan."],
		};
	}

	revalidatePath("/dashboard/flights");

	return {
		errorTitle: "",
		errorDesc: [],
	};
}