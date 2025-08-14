import React from "react";

export default function FilterFlight() {
	return (
		<div className="flex flex-col gap-4">
			<p className="font-semibold">Flight</p>
			<label
				htmlFor="direct"
				className="font-semibold flex items-center gap-[10px] has-[:checked]:text-white"
			>
				<input
					type="radio"
					name="flight"
					id="direct"
					className="w-[18px] h-[18px] appearance-none checked:border-[3px] checked:border-solid checked:border-escapeplane-black rounded-full checked:bg-escapeplane-light-purple ring-2 ring-escapeplane-off-purple checked:ring-white"
				/>
				Direct
			</label>
			<label
				htmlFor="transit"
				className="font-semibold flex items-center gap-[10px] has-[:checked]:text-white"
			>
				<input
					type="radio"
					name="flight"
					id="transit"
					className="w-[18px] h-[18px] appearance-none checked:border-[3px] checked:border-solid checked:border-escapeplane-black rounded-full checked:bg-escapeplane-light-purple ring-2 ring-escapeplane-off-purple checked:ring-white"
				/>
				Transit
			</label>
			<label
				htmlFor="transits"
				className="font-semibold flex items-center gap-[10px] has-[:checked]:text-white"
			>
				<input
					type="radio"
					name="flight"
					id="transits"
					className="w-[18px] h-[18px] appearance-none checked:border-[3px] checked:border-solid checked:border-escapeplane-black rounded-full checked:bg-escapeplane-light-purple ring-2 ring-escapeplane-off-purple checked:ring-white"
				/>
				Transits ~5
			</label>
		</div>
	);
}
