import type { FlightSeat } from "@prisma/client";
import React, { useContext } from "react";
import { SeatContext, type SeatContextType } from "../providers/seat-provider";

interface SeatItemProps {
	seat: FlightSeat;
}

export default function SeatItem({ seat }: SeatItemProps) {
	const { setSelectedSeat } = useContext(SeatContext) as SeatContextType;

	return (
		<div className="group flex shrink-0 w-[35px] h-[35px] items-center justify-center relative">
			<label
				htmlFor={seat.seatNumber}
				className="absolute font-bold text-[15px] group-has-[:disabled]:text-[#797684] group-has-[:checked]:text-escapeplane-black"
			>
				{seat.seatNumber}
			</label>
			<input
				type="radio"
				name="seat"
				onClick={() => {
					setSelectedSeat(seat);
				}}
				id={seat.seatNumber}
				className="w-[35px] h-[35px] appearance-none rounded-[15px] checked:bg-escapeplane-light-purple ring-2 ring-white checked:ring-escapeplane-light-purple disabled:ring-0 disabled:bg-escapeplane-dark-grey"
				disabled={seat.isBooked ?? false}
			/>
		</div>
	);
}
