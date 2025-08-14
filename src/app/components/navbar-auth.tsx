import { Button } from "@/components/ui/button"; // UNUSED: commented out
import { getUser } from "@/lib/auth";
import { LogOut } from "lucide-react"; // UNUSED: commented out
import Link from "next/link";
import React from "react";
import { logout } from "../(home)/lib/actions"; // ERROR: Cannot find module

export default async function NavbarAuth() {
	const { session, user } = await getUser();

	return (
		<div className="inline-flex items-center gap-3">
			{session && user && user.role === "CUSTOMER" ? (
				<Link
					href="/my-tickets"
					className="font-bold text-escapeplane-black bg-escapeplane-light-purple rounded-full p-[12px_30px] transition-all duration-300 hover:shadow-[0_10px_20px_0_#B88DFF]"
				>
					My Tickets
				</Link>
			) : (
				<Link
					href="/sign-in"
					className="font-bold text-escapeplane-black bg-escapeplane-light-purple rounded-full p-[12px_30px] transition-all duration-300 hover:shadow-[0_10px_20px_0_#B88DFF]"
				>
					Sign In
				</Link>
			)}

			{session && user && user.role === "CUSTOMER" && (
				<form action={logout}>
					<Button variant="destructive" className="rounded-full">
						<LogOut className="w-4 h-4" />
					</Button>
				</form>
			)}
		</div>
	);
}
