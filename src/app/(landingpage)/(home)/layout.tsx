import React from "react";

interface LayoutProps {
	children: React.ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
	return <>{children}</>;
}