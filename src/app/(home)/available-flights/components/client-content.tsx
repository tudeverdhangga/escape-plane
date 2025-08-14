"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { FContext, FlightContext } from "../providers/flight-provider";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientContentProps {
	children: React.ReactNode;
}

export default function ClientContent({ children }: ClientContentProps) {
	const { flights, isLoading } = useContext(FlightContext) as FContext;
	const searchParams = useSearchParams();
	
	const departure = searchParams.get('departure') || 'Unknown';
	const arrival = searchParams.get('arrival') || 'Unknown';

	return (
		<>
			<div className="title container max-w-[1130px] mx-auto flex flex-col gap-1 pt-[50px] pb-[68px]">
				<h1 className="font-bold text-[32px] leading-[48px]">
					{departure} to {arrival}
				</h1>
				<div className="font-medium text-lg leading-[27px]">
					{isLoading ? (
						<Skeleton className="h-7 w-48" />
					) : (
						`${flights?.length || 0} flights available`
					)}
				</div>
			</div>
			{children}
		</>
	);
}
