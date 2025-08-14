"use client"

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUser } from "../lib/actions";
import { useTransition } from "react";

interface DeleteUserProps {
	userId: string;
}

export default function DeleteUser({ userId }: DeleteUserProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		if (confirm("Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.")) {
			startTransition(async () => {
				const result = await deleteUser(userId);
				if (result.errorTitle) {
					alert(`Error: ${result.errorDesc?.join(", ") || "Terjadi kesalahan"}`);
				} else {
					alert("User berhasil dihapus");
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
			<Trash2 className="h-4 w-4" />
		</Button>
	);
}
