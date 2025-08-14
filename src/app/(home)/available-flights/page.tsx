import Navbar from "@/app/components/navbar";
import React, { Suspense } from "react";
import FilterClass from "./components/filter-class";
import FilterFlight from "./components/filter-flight";
import FilterAirline from "./components/filter-airline";
import ListFlights from "./components/list-flights";
import LoadingFilterAirline from "./components/loading-filter-airline";

export default function AvailableFlightsPage() {
	return (
		<>
			<section
				id="Header"
				className="bg-[url('/assets/images/background/airplane.png')] bg-no-repeat bg-cover bg-left-top h-[290px] relative"
			>
				<div className="Header-content bg-gradient-to-r from-[#080318] to-[rgba(8,3,24,0)] h-[290px]">
					<Navbar />
					<div className="title container max-w-[1130px] mx-auto flex flex-col gap-1 pt-[50px] pb-[68px]">
						<h1 className="font-bold text-[32px] leading-[48px]">
							Available Flights
						</h1>
						<p className="font-medium text-lg leading-[27px]">
							Find your perfect flight
						</p>
					</div>
					<div className="w-full h-[15px] bg-gradient-to-t from-[#080318] to-[rgba(8,3,24,0)] absolute bottom-0" />
				</div>
			</section>

			<section
				id="Content"
				className="container max-w-[1130px] mx-auto -mt-[33px] z-10 relative pb-[105px]"
			>
				<div className="flex w-full">
					<form className="ticket-filter flex flex-col shrink-0 w-[230px] gap-[30px] text-escapeplane-off-purple">
						<FilterClass />
						<FilterFlight />
						<Suspense fallback={<LoadingFilterAirline />}>
							<FilterAirline />
						</Suspense>
					</form>
					<ListFlights />
				</div>
			</section>
		</>
	);
}
