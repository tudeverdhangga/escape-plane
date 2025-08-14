import { dateFormat } from '@/lib/utils';
import { Flight } from '@/generated/prisma';
import { ArrowRight } from 'lucide-react';
import React from 'react'

interface ColumnsRouteFlightProps {
	flight: Flight;
}

export default function ColumnsRouteFlight({ flight }: ColumnsRouteFlightProps) {
	return (
		<div className='text-center'>
			<div className="inline-flex items-center">
				<div className="flex flex-col items-center justify-center">
					<div className="font-bold">
						{flight.departureCityCode}
					</div>
					<div className="font-semibold">
						{flight.departureCity}
					</div>
					<div>
						{dateFormat(flight.departureDate)}
					</div>
				</div>
				<ArrowRight className='h-5 w-5' />
				<div className="flex flex-col items-center justify-center">
					<div className="font-bold">
						{flight.destinationCityCode}
					</div>
					<div className="font-semibold">
						{flight.destinationCity}
					</div>
					<div>
						{dateFormat(flight.arrivalDate)}
					</div>
				</div>
			</div>
		</div>
	);
}
