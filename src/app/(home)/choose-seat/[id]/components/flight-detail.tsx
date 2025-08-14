"use client";

/* eslint-disable @next/next/no-img-element */
import useCheckoutData from "@/hooks/useCheckoutData";
import { getFileUrl } from "@/lib/supabase";
import {
	type Checkout,
	CHECKOUT_KEY,
	dateFormat,
	formatCurrency,
	SEAT_VALUES,
	type SeatValuesType,
} from "@/lib/utils";
import type { Airplane, Flight, FlightSeat } from "@/generated/prisma";
import React, { useContext, useMemo } from "react";
import { SeatContext, type SeatContextType } from "../providers/seat-provider";
import { toast } from "sonner";
import type { Session } from "lucia";
import { useRouter } from "next/navigation";

type FlightProps = Flight & { seats: FlightSeat[]; plane: Airplane };

interface FlightDetailProps {
	flight: FlightProps;
	session: Session | null;
}

export default function FlightDetail({ flight, session }: FlightDetailProps) {
	const data = useCheckoutData();

	const { seat } = useContext(SeatContext) as SeatContextType;

	const router = useRouter();

	const selectedSeat = useMemo(() => {
		return SEAT_VALUES[(data.data?.seat as SeatValuesType) ?? "ECONOMY"];
	}, [data.data?.seat]);

	const continueBook = () => {
		if (seat === null) {
			toast.error("Select seat first", {
				description: "Please select a seat before continuing with your booking",
			});
			return;
		}

		if (session === null) {
			router.replace("/sign-in");
			return;
		}

		const checkoutData: Checkout = {
			id: data.data?.id,
			seat: data.data?.seat,
			flightDetail: flight,
			seatDetail: seat,
		};

		const serializedData = JSON.stringify(checkoutData, (key, value) =>
			typeof value === 'bigint' ? value.toString() : value
		);
		
		sessionStorage.setItem(CHECKOUT_KEY, serializedData);
		router.push("/checkout");
	};

	return (
		<div className="flex flex-col items-center gap-[30px] mt-[61px] pb-[30px]">
			<h1 className="font-bold text-[32px] leading-[48px] text-center">
				{flight.departureCity} to {flight.destinationCity}
			</h1>
			<div className="flex flex-col items-center gap-[30px] w-[335px]">
				<div className="flex flex-col gap-[10px] w-full">
					<div className="flex justify-center shrink-0">
						<img
							src="../assets/images/icons/plane-dotted-curve.svg"
							alt="icon"
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex flex-col gap-[2px] text-center">
							<p className="font-bold text-lg">
								{dateFormat(flight.departureDate, "HH:mm")}
							</p>
							<p className="text-sm text-escapeplane-off-purple">
								{flight.departureCityCode}
							</p>
						</div>
						<div className="flex flex-col gap-[2px] text-center">
							<p className="font-bold text-lg">
								{dateFormat(flight.arrivalDate, "HH:mm")}
							</p>
							<p className="text-sm text-escapeplane-off-purple">
								{flight.destinationCityCode}
							</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4 w-full">
					<div className="flex shrink-0 w-full h-[130px] rounded-[14px] overflow-hidden">
						<img
							src={getFileUrl(flight.plane.image)}
							className="w-full h-full object-cover"
							alt=" airplane"
						/>
					</div>
					<div className="flex justify-between items-center">
						<div className="flex flex-col gap-[2px]">
							<p className="font-bold text-lg">
								{flight.plane.name}
							</p>
							<p className="text-sm text-escapeplane-grey">
								{flight.plane.code} • {selectedSeat.label} Class
							</p>
						</div>
						<div className="flex h-fit">
							<img
								src="../assets/images/icons/Star.svg"
								className="w-5 h-5"
								alt="star"
							/>
							<img
								src="../assets/images/icons/Star.svg"
								className="w-5 h-5"
								alt="star"
							/>
							<img
								src="../assets/images/icons/Star.svg"
								className="w-5 h-5"
								alt="star"
							/>
							<img
								src="../assets/images/icons/Star.svg"
								className="w-5 h-5"
								alt="star"
							/>
							<img
								src="../assets/images/icons/Star.svg"
								className="w-5 h-5"
								alt="star"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-[10px] w-full">
					<div className="flex justify-between">
						<span>Date</span>
						<span className="font-semibold">
							{dateFormat(flight.departureDate)}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Seat Choosen</span>
						<span className="font-semibold">
							{seat?.seatNumber}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Passenger</span>
						<span className="font-semibold">1 Person</span>
					</div>
					<div className="flex justify-between">
						<span>Seat Price</span>
						<span className="font-semibold">
							{formatCurrency(
								Number(flight.price) + selectedSeat.additionalPrice
							)}
						</span>
					</div>
				</div>
				<button
					type="button"
					onClick={continueBook}
					className="font-bold text-escapeplane-black bg-escapeplane-light-purple rounded-full h-12 w-full transition-all duration-300 hover:shadow-[0_10px_20px_0_#B88DFF] flex justify-center items-center"
				>
					Continue to Book
				</button>
			</div>
		</div>
	);
}
