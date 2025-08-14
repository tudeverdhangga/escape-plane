"use client";

import React, { type FC, type ReactNode } from "react";
import SeatProvider from "./providers/seat-provider";
import { Toaster } from "sonner";

interface LayoutProps {
	children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
	return (
		<SeatProvider>
			{children} <Toaster />
		</SeatProvider>
	);
};

export default Layout;
