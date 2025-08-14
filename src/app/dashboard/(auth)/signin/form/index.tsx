"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionResult, handleSignIn } from "./actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialFormState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
}

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" className="w-full" disabled={pending}>
			{pending ? "Submitting..." : "Submit"}
		</Button>
	)
}

const FormSignIn = () => {
	const [state, formAction] = useActionState(
		async (state: ActionResult, formData: FormData) => {
			return await handleSignIn(formData);
		},
		initialFormState
	);

	return (
		<div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>

			{state.errorTitle && (
				<div className="mx-auto my-7 bg-red-500 text-white rounded-lg text-center">
					<h3>{state.errorTitle}</h3>
					<ul className="list-disc list-inside">
						{state.errorDesc?.map((desc, index) => (
							<li key={index}>{desc}</li>
						))}
					</ul>
				</div>
			)}

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" action={formAction}>
					<div>
						<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
							Email address
						</label>
						<div className="mt-2">
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"

							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
							Password
						</label>
						<div className="mt-2">
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"

							/>
						</div>
					</div>

					<div>
						<SubmitButton />
					</div>
				</form>
			</div>
		</div>
	)
}

export default FormSignIn;