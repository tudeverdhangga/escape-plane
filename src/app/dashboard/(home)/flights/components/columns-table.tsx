"use client"
 
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/supabase";
import { Airplane, Flight, FlightSeat } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ColumnsRouteFlight from "./columns-route-flight";
import ColumnsPriceFlight from "./columns-price-flight";
import DeleteFlight from "./delete-airplane";

export type FlightColumn = Flight & {
	plane: Airplane;
	seats: FlightSeat[];
};

export const columns: ColumnDef<FlightColumn>[] = [
	{
		accessorKey: "planeId",
		header: "Pesawat",
		meta: {
			size: 340,
		},
		cell: ({ row }) => {
			const flight = row.original;

			return (
				<div className="inline-flex items-center">
					<Image
						src={getFileUrl(flight.plane.image)}
						alt="Image Airplane"
						height={180}
						width={180}
						className="rounded-md"
					/>
					<div className="font-bold ml-2">
						{flight.plane.name || flight.planeId}
					</div>
				</div>
			)
		}
	},
	{
		accessorKey: "departureCity",
		header: () => <div className="text-center">Rute</div>,
		cell: ({ row }) => {
			const flight = row.original;

			return (
				<ColumnsRouteFlight flight={flight} />
			)
		}
	},
	{
		accessorKey: "price",
		header: () => <div className="text-center">Harga / Kursi</div>,
		meta: {
			size: 270,
		},
		cell: ({ row }) => {
			const flight = row.original;

			return (
				<ColumnsPriceFlight flight={flight} />
			);
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const flight = row.original;
			
			return (
				<div className="inline-flex gap-5 items-center">
					<Button variant={"secondary"} size={"sm"} asChild>
						<Link href={`/dashboard/flights/edit/${flight.id}`}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</Button>
					<DeleteFlight id={flight.id} />
				</div>
			);
		},
	},
]; 