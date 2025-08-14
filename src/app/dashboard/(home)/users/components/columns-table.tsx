"use client"
 
import type { ColumnDef } from "@tanstack/react-table";
import DeleteUser from "@/app/dashboard/(home)/users/components/delete-user";
import type { RoleUser } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export type UserColumn = {
	id: string;
	name: string;
	email: string;
	passport: string | null;
	role: RoleUser;
};

export const columns: ColumnDef<UserColumn>[] = [
	{
		accessorKey: "name",
		header: "Nama",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="font-medium">
					{user.name}
				</div>
			);
		}
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="text-sm">
					{user.email}
				</div>
			);
		}
	},
	{
		accessorKey: "passport",
		header: "Paspor",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="text-sm">
					{user.passport || "-"}
				</div>
			);
		}
	},
	{
		id: "actions",
		header: "Aksi",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						asChild
					>
						<Link href={`/dashboard/users/edit/${user.id}`}>
							<Pencil className="h-4 w-4" />
						</Link>
					</Button>
					<DeleteUser userId={user.id} />
				</div>
			);
		}
	}
];
