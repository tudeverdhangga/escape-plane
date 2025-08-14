import React, { Suspense, type FC, type ReactNode } from "react";
import QCProvider from "./providers/query-provider";
import FlightProvider from "./providers/flight-provider";
import LoadingFlightProvider from "./components/loading-flight-provider";

interface LayoutProps {
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<QCProvider>
			<Suspense fallback={<LoadingFlightProvider />}>
				<FlightProvider>{children}</FlightProvider>
			</Suspense>
		</QCProvider>
	);
};

export default Layout;
