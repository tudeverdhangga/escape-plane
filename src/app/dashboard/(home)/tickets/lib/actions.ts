"use server"

import { redirect } from "next/navigation";
import { ticketFormSchema } from "./validation";
import prisma from "~/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ActionResult {
	errorTitle: string | null;
	errorDesc: string[] | null;
}

export async function saveTicket(_state: ActionResult, formData: FormData): Promise<ActionResult> {
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
		if (key === 'bookingDate') {
			const dateTime = new Date(value as string);
			formObject[key] = dateTime.toISOString();
		} else {
			formObject[key] = value;
		}
	}

	// Validate the form data
	const values = ticketFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		// Check if seat is already booked
		const existingSeat = await prisma.flightSeat.findUnique({
			where: { id: values.data.seatId },
			include: { ticket: true }
		});

		if (existingSeat?.isBooked || existingSeat?.ticket) {
			return {
				errorTitle: "Seat Error",
				errorDesc: ["Kursi yang dipilih sudah dibooking oleh penumpang lain"],
			};
		}

		// Create ticket and update seat in a transaction
		await prisma.$transaction(async (tx) => {
			// Create the ticket
			await tx.ticket.create({
				data: {
					...values.data,
					price: Number(values.data.price),
					bookingDate: new Date(values.data.bookingDate),
				}
			});

			// Mark the seat as booked
			await tx.flightSeat.update({
				where: { id: values.data.seatId },
				data: { isBooked: true }
			});
		});

	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menyimpan data tiket."],
		};
	}
	
	revalidatePath("/dashboard/tickets");
	redirect("/dashboard/tickets");
}

export async function updateTicket(id: string, _state: ActionResult, formData: FormData): Promise<ActionResult> {
	const formObject: Record<string, string | File> = {};
	for (const [key, value] of formData.entries()) {
		if (key === 'bookingDate') {
			const dateTime = new Date(value as string);
			formObject[key] = dateTime.toISOString();
		} else {
			formObject[key] = value;
		}
	}

	const values = ticketFormSchema.safeParse(formObject);

	if (!values.success) {
		return {
			errorTitle: "Validation Error",
			errorDesc: values.error.issues.map(issue => issue.message),
		};
	}

	try {
		// Get current ticket to check if seat changed
		const currentTicket = await prisma.ticket.findUnique({
			where: { id },
			include: { seat: true }
		});

		if (!currentTicket) {
			return {
				errorTitle: "Error",
				errorDesc: ["Tiket tidak ditemukan"],
			};
		}

		// If seat changed, check if new seat is available
		if (currentTicket.seatId !== values.data.seatId) {
			const newSeat = await prisma.flightSeat.findUnique({
				where: { id: values.data.seatId },
				include: { ticket: true }
			});

			if (newSeat?.isBooked || newSeat?.ticket) {
				return {
					errorTitle: "Seat Error",
					errorDesc: ["Kursi yang dipilih sudah dibooking oleh penumpang lain"],
				};
			}
		}

		// Update ticket and seats in a transaction
		await prisma.$transaction(async (tx) => {
			// Update the ticket
			await tx.ticket.update({
				where: { id },
				data: {
					...values.data,
					price: Number(values.data.price),
					bookingDate: new Date(values.data.bookingDate),
				}
			});

			// If seat changed, update seat bookings
			if (currentTicket.seatId !== values.data.seatId) {
				// Free the old seat
				await tx.flightSeat.update({
					where: { id: currentTicket.seatId },
					data: { isBooked: false }
				});

				// Book the new seat
				await tx.flightSeat.update({
					where: { id: values.data.seatId },
					data: { isBooked: true }
				});
			}
		});

	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat mengupdate data tiket."],
		};
	}

	revalidatePath("/dashboard/tickets");
	redirect("/dashboard/tickets");
}

export async function deleteTicket(id: string): Promise<ActionResult> {
	try {
		// Get ticket to free the seat
		const ticket = await prisma.ticket.findUnique({
			where: { id },
			include: { seat: true }
		});

		if (!ticket) {
			return {
				errorTitle: "Error",
				errorDesc: ["Tiket tidak ditemukan"],
			};
		}

		// Delete ticket and free seat in a transaction
		await prisma.$transaction(async (tx) => {
			// Delete the ticket
			await tx.ticket.delete({
				where: { id }
			});

			// Free the seat
			await tx.flightSeat.update({
				where: { id: ticket.seatId },
				data: { isBooked: false }
			});
		});

		revalidatePath("/dashboard/tickets");
		return {
			errorTitle: null,
			errorDesc: null,
		};
	} catch (error) {
		console.error("Database Error:", error);
		return {
			errorTitle: "Database Error",
			errorDesc: ["Terjadi kesalahan saat menghapus data tiket."],
		};
	}
}

export async function getTicketById(id: string) {
	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id },
			include: {
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
					}
				},
				flight: {
					include: {
						plane: true,
					}
				},
				seat: true,
			},
		});
		return ticket;
	} catch (error) {
		console.error("Error fetching ticket:", error);
		return null;
	}
}
