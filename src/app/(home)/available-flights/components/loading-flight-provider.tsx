import React from "react";

export default function LoadingFlightProvider() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-escapeplane-light-purple mx-auto mb-4"></div>
				<h2 className="text-xl font-semibold mb-2">Loading Flights</h2>
				<p className="text-escapeplane-off-purple">
					Please wait while we search for available flights...
				</p>
			</div>
		</div>
	);
}
