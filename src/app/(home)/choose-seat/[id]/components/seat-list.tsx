"use client";

import React, { useMemo } from "react";
import SeatItem from "./seat-item";
import useCheckoutData from "@/hooks/useCheckoutData";
import type { FlightSeat } from "@/generated/prisma";

interface SeatListProps {
	seats: FlightSeat[];
}

export default function SeatList({ seats }: SeatListProps) {
	const checkout = useCheckoutData();

	const { seatA, seatB, seatC, seatD, seatE, seatF } = useMemo(() => {
		const rawSeats = seats.filter(
			(seat) => seat.type === checkout.data?.seat
		);

		const seatA = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("A")
		);
		const seatB = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("B")
		);
		const seatC = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("C")
		);
		const seatD = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("D")
		);
		const seatE = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("E")
		);
		const seatF = rawSeats.filter((seat) =>
			seat.seatNumber.startsWith("F")
		);

		return { seatA, seatB, seatC, seatD, seatE, seatF };
	}, [checkout, seats]);

	return (
		<form className="flex flex-row justify-between gap-5">
			<div className="flex gap-5">
				<div className="flex flex-col gap-[19px]">
					{seatA.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
				<div className="flex flex-col gap-[19px]">
					{seatB.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
				<div className="flex flex-col gap-[19px]">
					{seatC.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
			</div>
			<div className="flex gap-5">
				<div className="flex flex-col gap-[19px]">
					{seatD.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
				<div className="flex flex-col gap-[19px]">
					{seatE.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
				<div className="flex flex-col gap-[19px]">
					{seatF.map((seat) => (
						<SeatItem key={seat.id} seat={seat} />
					))}
				</div>
			</div>
		</form>
	);
}
