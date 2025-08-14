/* eslint-disable @next/next/no-img-element */
import { getFileUrl } from "@/lib/supabase";
import { dateFormat } from "@/lib/utils";
import type { Airplane, Flight, FlightSeat, Ticket } from "@/generated/prisma";
import Link from "next/link";
import React from "react";

type Data = Pick<Ticket, "id"> & {
	flight: Pick<
		Flight,
		| "departureDate"
		| "departureCityCode"
		| "destinationCityCode"
		| "arrivalDate"
	> & {
		plane: Airplane;
	};
} & {
	seat: Pick<FlightSeat, "type">;
};

interface TicketCardProps {
	data: Data;
}

export default function TicketCard({ data }: TicketCardProps) {
	return (
		<div className="ticket-card flex justify-between items-center rounded-[20px] p-5 bg-escapeplane-bg-purple">
			<div className="flex gap-[16px] items-center">
				<div className="flex shrink-0 w-[90px] h-[70px] rounded-[14px] overflow-hidden">
					<img
						src={getFileUrl(data.flight.plane.image)}
						className="w-full h-full object-cover"
						alt="thumbnail"
					/>
				</div>
				<div className="flex flex-col justify-center-center gap-[2px]">
					<p className="font-bold text-lg">
						{data.flight.plane.name}
					</p>
					<p className="text-sm text-escapeplane-off-purple">
						{data.seat.type}
					</p>
				</div>
			</div>
			<p className="w-fit h-fit font-bold text-lg">
				{dateFormat(data.flight.departureDate, "DD MMM YYYY")}
			</p>
			<div className="flex items-center gap-[30px]">
				<div className="flex flex-col gap-[2px] text-center">
					<p className="font-bold text-lg">
						{dateFormat(data.flight.departureDate, "HH:mm")}
					</p>
					<p className="text-sm text-escapeplane-off-purple">
						{data.flight.departureCityCode}
					</p>
				</div>
				<img src="../assets/images/icons/plane-dotted.svg" alt="icon" />
				<div className="flex flex-col gap-[2px] text-center">
					<p className="font-bold text-lg">
						{dateFormat(data.flight.arrivalDate, "HH:mm")}
					</p>
					<p className="text-sm text-escapeplane-off-purple">
						{data.flight.destinationCityCode}
					</p>
				</div>
			</div>
			<Link
				href={`/my-tickets/detail/${data.id}`}
				className="font-bold text-escapeplane-black bg-escapeplane-light-purple rounded-full p-[12px_20px] h-[48px] transition-all duration-300 hover:shadow-[0_10px_20px_0_#B88DFF]"
			>
				Details
			</Link>
		</div>
	);
}
