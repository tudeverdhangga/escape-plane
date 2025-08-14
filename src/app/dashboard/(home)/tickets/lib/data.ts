"use server"

import prisma from "~/lib/prisma"

export async function getTickets() {
	try {
		const tickets = await prisma.ticket.findMany({
			include: {
				customer: true,
				flight: true,
				seat: true,
			}
		});
		return tickets;
	} catch (error) {
		console.error("Error fetching tickets:", error);
		return [];
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

export async function getCustomers() {
	try {
		const customers = await prisma.user.findMany({
			where: {
				role: 'CUSTOMER'
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
			orderBy: {
				name: 'asc',
			}
		});
		return customers;
	} catch (error) {
		console.error("Error fetching customers:", error);
		return [];
	}
}

export async function getAvailableSeats(flightId?: string) {
	try {
		if (!flightId) return [];
		
		const seats = await prisma.flightSeat.findMany({
			where: {
				flightId: flightId,
				isBooked: false,
			},
			orderBy: [
				{ type: 'asc' },
				{ seatNumber: 'asc' }
			]
		});
		return seats;
	} catch (error) {
		console.error("Error fetching available seats:", error);
		return [];
	}
}

export async function getFlights() {
	try {
		const flights = await prisma.flight.findMany({
			include: {
				plane: true,
			},
			orderBy: {
				departureDate: 'asc',
			}
		});
		return flights;
	} catch (error) {
		console.error("Error fetching flights:", error);
		return [];
	}
}
