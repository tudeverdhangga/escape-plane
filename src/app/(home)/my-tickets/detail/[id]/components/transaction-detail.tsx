import { cn, formatCurrency } from "@/lib/utils";
import type {
	Airplane,
	Flight,
	FlightSeat,
	Ticket,
	User,
} from "@/generated/prisma";
import React from "react";

type Data = Ticket & {
	flight: Flight & { plane: Airplane };
	customer: User;
	seat: FlightSeat;
};

interface TransactionDetailProps {
	data: Data;
}

export default function TransactionDetail({ data }: TransactionDetailProps) {
	return (
		<div className="flex flex-col gap-[30px] w-[400px]">
			<div className="flex flex-col gap-[18px]">
				<p className="font-semibold">Payment Details</p>
				<div className="flex justify-between">
					<span>ID Transaction</span>
					<span className="font-semibold">{data.code}</span>
				</div>
				<div className="flex justify-between">
					<span>Seat Price</span>
					<span className="font-semibold">
						{formatCurrency(Number(data.price))}
					</span>
				</div>
				<div className="flex justify-between">
					<span>Insurance 24%</span>
					<span className="font-semibold">FREE</span>
				</div>
				<div className="flex justify-between">
					<span>Baggage</span>
					<span className="font-semibold">FREE</span>
				</div>
				<div className="flex justify-between">
					<span>Grand Total</span>
					<span className="font-bold text-escapeplane-light-purple">
						{formatCurrency(Number(data.price))}
					</span>
				</div>
				<div className="flex justify-between">
					<span>Status</span>
					<span
						className={cn(
							"font-bold",
							data.status === "PENDING" && "text-yellow-500",
							data.status === "SUCCESS" && "text-green-500",
							data.status === "FAILED" && "text-red-500"
						)}
					>
						{data.status}
					</span>
				</div>
			</div>
		</div>
	);
}
