"use client"

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTicket } from "../lib/actions";
import { useTransition } from "react";

interface DeleteTicketProps {
	id: string;
}

export default function DeleteTicket({ id }: DeleteTicketProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		if (confirm("Apakah Anda yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan.")) {
			startTransition(async () => {
				const result = await deleteTicket(id);
				if (result.errorTitle) {
					alert(`Error: ${result.errorDesc?.join(", ") || "Terjadi kesalahan"}`);
				} else {
					alert("Tiket berhasil dihapus");
				}
			});
		}
	};

	return (
		<Button 
			variant={"destructive"} 
			size={"sm"} 
			onClick={handleDelete}
			disabled={isPending}
		>
			<Trash2 className="mr-2 h-4 w-4" />
			{isPending ? "Menghapus..." : "Delete"}
		</Button>
	);
}
