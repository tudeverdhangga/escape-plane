import { Metadata } from "next";
import FormTicket from "../../components/form-ticket";
import { getCustomers, getFlights, getAvailableSeats } from "../../lib/data";
import { getTicketById } from "../../lib/actions";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Dashboard | Edit Ticket",
}

interface EditTicketProps {
	params: Promise<{ id: string }>;
}

export default async function EditTicket({ params }: EditTicketProps) {
	const { id } = await params;
	
	const [ticket, customers, flights] = await Promise.all([
		getTicketById(id),
		getCustomers(),
		getFlights()
	]);

	if (!ticket) {
		notFound();
	}
	
	// Get available seats for the ticket's flight
	const availableSeats = await getAvailableSeats(ticket.flightId);
	// Include the current seat even if it's booked (for editing)
	if (ticket.seat && !availableSeats.find(s => s.id === ticket.seatId)) {
		availableSeats.push({
			id: ticket.seat.id,
			flightId: ticket.seat.flightId || ticket.flightId,
			seatNumber: ticket.seat.seatNumber,
			type: ticket.seat.type,
			isBooked: ticket.seat.isBooked,
		});
	}

	return (
		<>
			<div className="flex flex-row items-center justify-between">
				<div className="my-5 text-2xl font-bold">Edit Ticket</div>
			</div>
			<FormTicket 
				type="edit" 
				defaultValues={{
					id: ticket.id,
					code: ticket.code,
					customerId: ticket.customerId,
					flightId: ticket.flightId,
					seatId: ticket.seatId,
					bookingDate: ticket.bookingDate,
					price: Number(ticket.price),
					status: ticket.status,
					tokenMidtrans: ticket.tokenMidtrans || "",
				}}
				customers={customers}
				flights={flights}
				availableSeats={availableSeats}
			/>
		</>
	);
}
