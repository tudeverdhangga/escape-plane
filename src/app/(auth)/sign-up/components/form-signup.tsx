"use client";

import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import Link from "next/link";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signUpUser } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			disabled={pending}
			variant="escapeplane"
			size="xl"
		>
			Create New Account
		</Button>
	);
}

export default function FormSignUp() {
	const [state, formAction] = useFormState(signUpUser, initialState);

	return (
		<form
			action={formAction}
			className="bg-white text-escapeplane-black w-[500px] flex flex-col rounded-[20px] gap-5 p-5"
		>
			{state.errorTitle !== null && (
				<div className=" bg-red-500 w-full p-4 rounded-lg text-white">
					<div className="font-bold mb-4">{state.errorTitle}</div>

					<ul className="list-disc list-inside">
						{state.errorDesc?.map((value, index) => (
							<li key={index + value}>{value}</li>
						))}
					</ul>
				</div>
			)}

			<div className="flex gap-5">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name" className="font-medium">
						Complete Name
					</Label>
					<Input
						type="text"
						name="name"
						id="name"
						placeholder="Write your name"
						className="rounded-full h-[48px] w-full p-[12px_20px] bg-[#EDE8F5] appearance-none outline-none font-semibold focus:ring-2 focus:ring-escapeplane-light-purple"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="passport" className="font-medium">
						No. Passport
					</Label>
					<Input
						type="text"
						name="passport"
						id="passport"
						placeholder="Write passport number"
						className="rounded-full h-[48px] w-full p-[12px_20px] bg-[#EDE8F5] appearance-none outline-none font-semibold focus:ring-2 focus:ring-escapeplane-light-purple"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="email" className="font-medium">
					Email Address
				</Label>
				<Input
					type="email"
					name="email"
					id="email"
					placeholder="Write your email"
					className="rounded-full h-[48px] w-full p-[12px_20px] bg-[#EDE8F5] appearance-none outline-none font-semibold focus:ring-2 focus:ring-escapeplane-light-purple"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<Label htmlFor="password" className="font-medium">
					Password
				</Label>
				<Input
					type="password"
					name="password"
					id="password"
					placeholder="Type your password"
					className="rounded-full h-[48px] w-full p-[12px_20px] bg-[#EDE8F5] appearance-none outline-none font-semibold focus:ring-2 focus:ring-escapeplane-light-purple"
				/>
			</div>
			<SubmitButton />
			<Button asChild variant="outline" size="lg" className="text-center text-escapeplane-black hover:text-white rounded-full bg-white hover:bg-escapeplane-black font-semibold w-full p-[12px_30px] border border-escapeplane-black transition-all duration-300">
				<Link href="/sign-in">
					Sign In
				</Link>
			</Button>
		</form>
	);
}
