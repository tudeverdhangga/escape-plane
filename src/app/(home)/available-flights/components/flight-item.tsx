import Image from "next/image";
import React, { useContext, useMemo } from "react";
import {
	type FContext,
	FlightContext,
	type FlightWithPlane,
} from "../providers/flight-provider";
import { getFileUrl } from "@/lib/supabase";
import {
	CHECKOUT_KEY,
	dateFormat,
	formatCurrency,
	SEAT_VALUES,
	type SeatValuesType,
} from "@/lib/utils";
import { useRouter } from "next/navigation";

interface FlightItemProps {
	data: FlightWithPlane;
}

export default function FlightItem({ data }: FlightItemProps) {
	const { state } = useContext(FlightContext) as FContext;

	const selectedSeat = useMemo(() => {
		return SEAT_VALUES[(state.seat as SeatValuesType) ?? "ECONOMY"];
	}, [state.seat]);

	const router = useRouter();

	const bookNow = () => {
		sessionStorage.setItem(
			CHECKOUT_KEY,
			JSON.stringify({
				id: data.id,
				seat: state.seat ? state.seat : "ECONOMY",
			})
		);

		router.push(`/choose-seat/${data.id}`);
	};

	return (
		<div className="ticket-card flex justify-between items-center rounded-[20px] p-5 bg-escapeplane-bg-purple">
			<div className="flex gap-[16px] items-center">
				<div className="flex shrink-0 w-[90px] h-[70px] rounded-[14px] overflow-hidden">
					<Image
						width={60}
						height={60}
						src={getFileUrl(data.plane.image)}
						className="w-full h-full object-cover"
						alt="thumbnail"
					/>
				</div>
				<div className="flex flex-col justify-center-center gap-[2px]">
					<p className="font-bold text-lg">{data.plane.name}</p>
					<p className="text-sm text-escapeplane-off-purple">
						{selectedSeat.label} Class
					</p>
				</div>
			</div>
			<div className="flex items-center gap-[30px]">
				<div className="flex flex-col gap-[2px] text-center">
					<p className="font-bold text-lg">
						{dateFormat(new Date(data.departureDate), "HH:mm")}
					</p>
					<p className="text-sm text-escapeplane-off-purple">
						{data.departureCityCode}
					</p>
				</div>
				<Image
					width={60}
					height={60}
					src="../assets/images/icons/plane-dotted.svg"
					alt="icon"
				/>
				<div className="flex flex-col gap-[2px] text-center">
					<p className="font-bold text-lg">
						{dateFormat(new Date(data.arrivalDate), "HH:mm")}
					</p>
					<p className="text-sm text-escapeplane-off-purple">
						{data.destinationCityCode}
					</p>
				</div>
			</div>
			<p className="w-fit h-fit font-bold text-lg">
				{formatCurrency(Number(data.price) + selectedSeat.additionalPrice)}
			</p>
			<button
				type="button"
				onClick={bookNow}
				className="font-bold text-escapeplane-black bg-escapeplane-light-purple rounded-full p-[12px_20px] h-[48px] transition-all duration-300 hover:shadow-[0_10px_20px_0_#B88DFF]"
			>
				Book Flight
			</button>
		</div>
	);
}
