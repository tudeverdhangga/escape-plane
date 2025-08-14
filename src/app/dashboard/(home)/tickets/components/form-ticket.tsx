"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from '@/components/ui/select';
import React, { FC, useState } from 'react';
import SubmitFormButton from '../../components/submit-form-button';
import { useActionState } from "react";
import { saveTicket, updateTicket } from '../lib/actions';
import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { dateFormat } from '@/lib/utils';

interface FormTicketProps {
	type?: "add" | "edit";
	defaultValues?: {
		id?: string;
		code?: string;
		customerId?: string;
		flightId?: string;
		seatId?: string;
		bookingDate?: Date;
		price?: number;
		status?: "PENDING" | "SUCCESS" | "FAILED";
		tokenMidtrans?: string;
	};
	customers: Array<{
		id: string;
		name: string;
		email: string;
	}>;
	flights: Array<{
		id: string;
		departureCity: string;
		destinationCity: string;
		departureCityCode: string;
		destinationCityCode: string;
		departureDate: Date;
		price: bigint;
		plane: {
			id: string;
			name: string;
			code: string;
		};
	}>;
	availableSeats?: Array<{
		id: string;
		seatNumber: string;
		type: "ECONOMY" | "BUSINESS" | "FIRST";
		isBooked: boolean | null;
	}>;
}

const initialFormState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
}

const FormTicket: FC<FormTicketProps> = ({ type, defaultValues, customers, flights, availableSeats = [] }) => {
	const [selectedFlightId, setSelectedFlightId] = useState<string>(defaultValues?.flightId || "");
	const [selectedSeat, setSelectedSeat] = useState<string>(defaultValues?.seatId || "");

	const updateTicketWithId = (_state: ActionResult, formData: FormData) => {
		if (!defaultValues?.id) throw new Error("ID is required for update");
		return updateTicket(defaultValues.id, _state, formData);
	}
	const saveTicketWithState = (_state: ActionResult, formData: FormData) => {
		return saveTicket(_state, formData);
	}
	const [state, formAction] = useActionState(type === "edit" ? updateTicketWithId : saveTicketWithState, initialFormState);

	// Calculate ticket price based on flight and seat
	const calculatePrice = () => {
		const flight = flights.find(f => f.id === selectedFlightId);
		const seat = availableSeats.find(s => s.id === selectedSeat);
		
		if (!flight || !seat) return 0;
		
		// Convert bigint to number and add seat price based on type
		const basePrice = Number(flight.price);
		let seatPrice = 0;
		
		switch (seat.type) {
			case "BUSINESS":
				seatPrice = 500000;
				break;
			case "FIRST":
				seatPrice = 750000;
				break;
			default: // ECONOMY
				seatPrice = 0;
				break;
		}
		
		return basePrice + seatPrice;
	};

	const ticketPrice = calculatePrice();

	return (
		<div className="space-y-6">
			{/* Error Display */}
			{state.errorTitle && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
					<h3 className="font-medium text-red-800">{state.errorTitle}</h3>
					{state.errorDesc && state.errorDesc.length > 0 && (
						<ul className="mt-2 text-sm list-disc list-inside space-y-1">
							{state.errorDesc.map((desc: string, index: number) => (
								<li key={index}>{desc}</li>
							))}
						</ul>
					)}
				</div>
			)}

			<form action={formAction} className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					{/* Ticket Code */}
					<div className="space-y-2">
						<Label htmlFor="code">Kode Tiket</Label>
						<Input
							id="code"
							name="code"
							placeholder="Contoh: TKT001"
							required
							defaultValue={defaultValues?.code}
						/>
					</div>
					{/* Customer Selection */}
					<div className="space-y-2">
						<Label htmlFor="customerId">Pilih Pelanggan</Label>
						<Select name="customerId" defaultValue={defaultValues?.customerId}>
							<SelectTrigger id="customerId" className='w-full'>
								<SelectValue placeholder="Pilih pelanggan" />
							</SelectTrigger>
							<SelectContent>
								{customers.map((customer) => (
									<SelectItem key={customer.id} value={customer.id}>
										{customer.name} ({customer.email})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Hidden input for form submission */}
						<input type="hidden" name="customerId" value={defaultValues?.customerId || ""} />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6">
					{/* Flight Selection */}
					<div className="space-y-2">
						<Label htmlFor="flightId">Pilih Penerbangan</Label>
						<Select 
							name="flightId" 
							defaultValue={defaultValues?.flightId}
							onValueChange={(value) => {
								setSelectedFlightId(value);
								setSelectedSeat(""); // Reset seat selection
							}}
						>
							<SelectTrigger id="flightId" className='w-full'>
								<SelectValue placeholder="Pilih penerbangan" />
							</SelectTrigger>
							<SelectContent>
								{flights.map((flight) => (
									<SelectItem key={flight.id} value={flight.id}>
										{flight.plane.name} - {flight.departureCityCode} → {flight.destinationCityCode}
										<br />
										<span className="text-sm text-gray-500">
											{dateFormat(flight.departureDate, "DD MMM YYYY, HH:mm")}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* Hidden input for form submission */}
						<input type="hidden" name="flightId" value={selectedFlightId} />
					</div>

					{/* Seat Selection */}
					<div className="space-y-2">
						<Label htmlFor="seatId">Pilih Kursi</Label>
						<Select 
							name="seatId" 
							defaultValue={defaultValues?.seatId}
							onValueChange={setSelectedSeat}
						>
							<SelectTrigger id="seatId" className='w-full'>
								<SelectValue placeholder="Pilih kursi" />
							</SelectTrigger>
							<SelectContent>
								{availableSeats.map((seat) => {
									const getSeatPrice = (type: string) => {
										switch (type) {
											case "BUSINESS": return 500000;
											case "FIRST": return 750000;
											default: return 0;
										}
									};
									
									return (
										<SelectItem key={seat.id} value={seat.id}>
											{seat.seatNumber} ({seat.type}) - +{getSeatPrice(seat.type).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
						{/* Hidden input for form submission */}
						<input type="hidden" name="seatId" value={selectedSeat} />
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6">
					{/* Booking Date */}
					<div className="space-y-2">
						<Label htmlFor="bookingDate">Tanggal Booking</Label>
						<Input
							id="bookingDate"
							name="bookingDate"
							type="datetime-local"
							className='block'
							required
							defaultValue={defaultValues?.bookingDate ? dateFormat(defaultValues.bookingDate, "YYYY-MM-DDTHH:mm") : dateFormat(new Date(), "YYYY-MM-DDTHH:mm")}
						/>
					</div>

					{/* Status */}
					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select name="status" defaultValue={defaultValues?.status || "PENDING"}>
							<SelectTrigger id="status" className='w-full'>
								<SelectValue placeholder="Pilih status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">Pending</SelectItem>
								<SelectItem value="SUCCESS">Berhasil</SelectItem>
								<SelectItem value="FAILED">Gagal</SelectItem>
							</SelectContent>
						</Select>
						{/* Hidden input for form submission */}
						<input type="hidden" name="status" value={defaultValues?.status || "PENDING"} />
					</div>
				</div>

				{/* Price Display and Hidden Input */}
				<div className="space-y-2">
					<Label htmlFor="price">Harga Total</Label>
					<div className="p-3 bg-gray-50 rounded-md">
						<span className="text-lg font-semibold">
							{ticketPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
						</span>
					</div>
					<input type="hidden" name="price" value={ticketPrice} />
				</div>

				{/* Token Midtrans (Optional) */}
				<div className="space-y-2">
					<Label htmlFor="tokenMidtrans">Token Midtrans (Opsional)</Label>
					<Input
						id="tokenMidtrans"
						name="tokenMidtrans"
						placeholder="Token dari Midtrans"
						defaultValue={defaultValues?.tokenMidtrans || ""}
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<SubmitFormButton />
				</div>
			</form>
		</div>
	);
}

export default FormTicket;
