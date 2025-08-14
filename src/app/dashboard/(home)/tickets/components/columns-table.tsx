"use client"
 
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import DeleteTicket from "./delete-ticket";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";

export type TicketColumn = {
	id: string;
	code: string;
	customerId: string;
	customer: {
		id: string;
		name: string;
		email: string;
		password: string;
		passport: string | null;
		role: "CUSTOMER" | "ADMIN";
	};
	flightId: string;
	flight: {
		id: string;
		planeId: string;
		departureCity: string;
		departureDate: Date;
		departureCityCode: string;
		destinationCity: string;
		arrivalDate: Date;
		destinationCityCode: string;
		price: bigint;
	};
	seatId: string;
	seat: {
		id: string;
		flightId: string;
		seatNumber: string;
		type: "ECONOMY" | "BUSINESS" | "FIRST";
		isBooked: boolean | null;
	};
	bookingDate: Date;
	price: bigint;
	status: "PENDING" | "SUCCESS" | "FAILED";
	tokenMidtrans?: string | null;
};

export const columns: ColumnDef<TicketColumn>[] = [
	{
		accessorKey: "code",
		header: "Kode Tiket",
		meta: {
			size: 150,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			return (
				<div className="font-medium">
					{ticket.code}
				</div>
			);
		}
	},
	{
		accessorKey: "customer",
		header: "Pelanggan",
		meta: {
			size: 250,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			return (
				<div>
					<div className="font-medium">{ticket.customer.name}</div>
					<div className="text-sm text-gray-500">{ticket.customer.email}</div>
				</div>
			);
		}
	},
	{
		accessorKey: "flight",
		header: "Penerbangan",
		meta: {
			size: 280,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			return (
				<div>
					<div className="font-medium">
						Flight {ticket.flight.planeId}
					</div>
					<div className="text-sm text-gray-500">
						{ticket.flight.departureCityCode} → {ticket.flight.destinationCityCode}
					</div>
					<div className="text-sm text-gray-500">
						{dayjs(ticket.flight.departureDate).format("DD MMM YYYY, HH:mm")}
					</div>
				</div>
			);
		}
	},
	{
		accessorKey: "seat",
		header: "Kursi",
		meta: {
			size: 120,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			const getSeatTypeColor = (type: string) => {
				switch (type) {
					case "ECONOMY":
						return "bg-blue-100 text-blue-800";
					case "BUSINESS":
						return "bg-green-100 text-green-800";
					case "FIRST":
						return "bg-purple-100 text-purple-800";
					default:
						return "bg-gray-100 text-gray-800";
				}
			};

			return (
				<div>
					<div className="font-medium">{ticket.seat.seatNumber}</div>
					<span className={`inline-block px-2 py-1 text-xs rounded-md ${getSeatTypeColor(ticket.seat.type)}`}>
						{ticket.seat.type}
					</span>
				</div>
			);
		}
	},
	{
		accessorKey: "bookingDate",
		header: "Tanggal Booking",
		meta: {
			size: 150,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			return (
				<div className="text-sm">
					{dayjs(ticket.bookingDate).format("DD MMM YYYY")}
					<br />
					<span className="text-gray-500">
						{dayjs(ticket.bookingDate).format("HH:mm")}
					</span>
				</div>
			);
		}
	},
	{
		accessorKey: "price",
		header: () => <div className="text-right">Harga</div>,
		meta: {
			size: 120,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			return (
				<div className="text-right font-medium">
					{formatCurrency(Number(ticket.price))}
				</div>
			);
		}
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Status</div>,
		meta: {
			size: 100,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			const getStatusColor = (status: string) => {
				switch (status) {
					case "SUCCESS":
						return "bg-green-100 text-green-800";
					case "PENDING":
						return "bg-yellow-100 text-yellow-800";
					case "FAILED":
						return "bg-red-100 text-red-800";
					default:
						return "bg-gray-100 text-gray-800";
				}
			};

			const getStatusText = (status: string) => {
				switch (status) {
					case "SUCCESS":
						return "Berhasil";
					case "PENDING":
						return "Pending";
					case "FAILED":
						return "Gagal";
					default:
						return status;
				}
			};

			return (
				<div className="text-center">
					<span className={`inline-block px-2 py-1 text-xs rounded-md ${getStatusColor(ticket.status)}`}>
						{getStatusText(ticket.status)}
					</span>
				</div>
			);
		}
	},
	{
		id: "actions",
		meta: {
			size: 150,
		},
		cell: ({ row }) => {
			const ticket = row.original;
			
			return (
				<div className="inline-flex gap-2 items-center">
					<Button variant={"secondary"} size={"sm"} asChild>
						<Link href={`/dashboard/tickets/edit/${ticket.id}`}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</Button>
					<DeleteTicket id={ticket.id} />
				</div>
			);
		},
	},
];
