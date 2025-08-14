"use client"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from '@/components/ui/select';
import React, { FC } from 'react';
import SubmitFormButton from '../../components/submit-form-button';
import type { Airplane, Flight } from '@prisma/client';
import { useActionState } from "react";
import { saveFlight, updateFlight } from '../lib/actions';
import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { dateFormat } from '@/lib/utils';

interface FormFlightProps {
	type?: "add" | "edit";
	defaultValues?: Flight;
	airplanes: Airplane[];
}

const initialFormState: ActionResult = {
	errorTitle: null,
	errorDesc: [],
}

const FormFlight: FC<FormFlightProps> = ({ type, defaultValues, airplanes }) => {
	const updateFlightWithId = (_state: ActionResult, formData: FormData) => {
		if (!defaultValues?.id) throw new Error("ID is required for update");
		return updateFlight(defaultValues.id, formData);
	}
	const saveFlightWithState = (_state: ActionResult, formData: FormData) => {
		return saveFlight(_state, formData);
	}
	const [state, formAction] = useActionState(type === "edit" ? updateFlightWithId : saveFlightWithState, initialFormState);

	return (
		<div className="space-y-6">
			{/* Error Display */}
			{state.errorTitle && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
					<h3 className="font-medium text-red-800">{state.errorTitle}</h3>
					{state.errorDesc && state.errorDesc.length > 0 && (
						<ul className="mt-2 text-sm list-disc list-inside space-y-1">
							{state.errorDesc.map((desc: string, index: number) => (
								<li key={index}>{desc}</li>
							))}
						</ul>
					)}
				</div>
			)}

			<form action={formAction} className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					{/* Airplane Selection */}
					<div className="space-y-2">
						<Label htmlFor="planeId">Pilih Pesawat</Label>
						<Select name="planeId" defaultValue={defaultValues?.planeId}>
							<SelectTrigger id="planeId" className='w-full'>
								<SelectValue placeholder="Pilih pesawat" />
							</SelectTrigger>
							<SelectContent>
								{airplanes.map((airplane) => (
									<SelectItem key={airplane.id} value={airplane.id}>
										{airplane.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{/* Price */}
					<div className="space-y-2">
						<Label htmlFor="price">Harga Tiket</Label>
						<Input
							id="price"
							name="price"
							type="number"
							placeholder="Contoh: 500000"
							min="0"
							required
							defaultValue={Number(defaultValues?.price || 0)}
						/>
						<span className='text-xs text-gray-90 0'>
							Harga untuk kelas business bertambah Rp 500.000 & kelas
							first bertambah Rp 750.000
						</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-6">
					{/* Departure Airport */}
					<div className="space-y-2">
						<Label htmlFor="departureCity">Kota Keberangkatan</Label>
						<Input
							id="departureCity"
							name="departureCity"
							placeholder="Contoh: Jakarta"
							required
							defaultValue={defaultValues?.departureCity}
						/>
					</div>
					{/* Departure Date */}
					<div className="space-y-2">
						<Label htmlFor="departureDate">Tanggal Keberangkatan</Label>
						<Input
							id="departureDate"
							name="departureDate"
							type="datetime-local"
							className='block'
							required
							defaultValue={defaultValues?.departureDate ? dateFormat(defaultValues.departureDate, "YYYY-MM-DDTHH:mm") : undefined}
						/>
					</div>
					{/* Departure City Code */}
					<div className="space-y-2">
						<Label htmlFor="departureCityCode">Kode Kota Keberangkatan</Label>
						<Input
							id="departureCityCode"
							name="departureCityCode"
							placeholder="Contoh: Jakarta"
							required
							defaultValue={defaultValues?.departureCityCode}
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-6">
					{/* Arrival Airport */}
					<div className="space-y-2">
						<Label htmlFor="departureCity">Kota Tujuan</Label>
						<Input
							id="destinationCity"
							name="destinationCity"
							placeholder="Contoh: Surabaya"
							required
							defaultValue={defaultValues?.destinationCity}
						/>
					</div>
					{/* Arrival Date */}
					<div className="space-y-2">
						<Label htmlFor="arrivalDate">Tanggal Tiba</Label>
						<Input
							id="arrivalDate"
							name="arrivalDate"
							type="datetime-local"
							className='block'
							required
							defaultValue={defaultValues?.arrivalDate ? dateFormat(defaultValues.arrivalDate, "YYYY-MM-DDTHH:MM") : undefined}
						/>
					</div>
					{/* Arrival City Code */}
					<div className="space-y-2">
						<Label htmlFor="destinationCityCode">Kode Kota Tujuan</Label>
						<Input
							id="destinationCityCode"
							name="destinationCityCode"
							placeholder="Contoh: Surabaya"
							required
							defaultValue={defaultValues?.destinationCityCode}
						/>
					</div>
				</div>

				{/* Submit Button */}
				<div className="pt-4">
					<SubmitFormButton />
				</div>
			</form>
		</div>
	);
}

export default FormFlight;