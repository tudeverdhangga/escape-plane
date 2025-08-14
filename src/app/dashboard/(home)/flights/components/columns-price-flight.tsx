import { formatCurrency, mappingSeats } from '@/lib/utils';
import React, { useMemo } from 'react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { FlightColumn } from './columns-table';

interface ColumnsPriceFlightProps {
	flight: FlightColumn;
}

export default function ColumnsPriceFlight({ flight }: ColumnsPriceFlightProps) {
	const basePrice = Number(flight.price);
	const businessPrice = basePrice + 500000;
	const firstPrice = basePrice + 750000;

	const {
    totalSeatEconomy,
    totalSeatBusiness,
    totalSeatFirst,
    totalSeatEconomyBooked,
    totalSeatBusinessBooked,
    totalSeatFirstBooked
  } = useMemo(() => mappingSeats(flight.seats), [flight.seats]);

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1" className="w-full">
				<AccordionTrigger>Economy</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-2">
						<div className="font-medium">
							<span className="text-primary">Harga tiket: </span>
							{formatCurrency(basePrice)}
						</div>
						<div className="font-medium">
							<span className="text-primary">Sisa kursi: </span>
							{totalSeatEconomyBooked}/{totalSeatEconomy}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
			
			<AccordionItem value="item-2" className="w-full">
				<AccordionTrigger>Business</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-2">
						<div className="font-medium">
							<span className="text-primary">Harga tiket: </span>
							{formatCurrency(businessPrice)}
						</div>
						<div className="font-medium">
							<span className="text-primary">Sisa kursi: </span>
							{totalSeatBusinessBooked}/{totalSeatBusiness}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
			
			<AccordionItem value="item-3" className="w-full">
				<AccordionTrigger>First</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-2">
						<div className="font-medium">
							<span className="text-primary">Harga tiket: </span>
							{formatCurrency(firstPrice)}
						</div>
						<div className="font-medium">
							<span className="text-primary">Sisa kursi: </span>
							{totalSeatFirstBooked}/{totalSeatFirst}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
