import { DataTable } from "@/components/ui/data-table";
import { Metadata } from "next";
import { columns } from "./components/columns-table";
import { getUsers } from "./lib/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Dashboard | Users",
}

export default async function Users() {
	const users = await getUsers()
	return (
		<>
			<div className="flex flex-row items-center justify-between">
				<div className="my-5 text-2xl font-bold">Users</div>
				<Button asChild>
					<Link href="/dashboard/users/create">
						<Plus className="mr-2 h-4 w-4" />
						Tambah User
					</Link>
				</Button>
			</div>
			<DataTable columns={columns} data={users} />
		</>
	);
}
