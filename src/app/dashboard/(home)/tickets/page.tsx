import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import { columns } from "./components/columns-table";
import { getTickets } from "./lib/data";

export const metadata: Metadata = {
	title: "Dashboard | Tickets",
}

export default async function Tickets() {
	const tickets = await getTickets()
	return (
		<>
			<div className="flex flex-row items-center justify-between">
				<div className="my-5 text-2xl font-bold">Tickets</div>
			</div>
			<DataTable columns={columns} data={tickets} />
		</>
	);
}
