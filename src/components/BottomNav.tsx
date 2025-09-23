import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useT } from "../translations";

interface BottomNavProps {
	currentView: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView }) => {
	const { t } = useT();

	const navItems = [
		{ key: "home", label: t.navigation.home, icon: "home", path: "/" },
		{ key: "quiz", label: t.navigation.quiz, icon: "clipboard-question", path: "/quiz" },
	];

	return (
		<Navbar
			fixed="bottom"
			className="bg-white border-top shadow-sm"
			style={{
				zIndex: 1000,
				height: "70px",
				paddingTop: "6px",
				paddingBottom: "8px",
			}}
		>
			<Nav className="w-100 justify-content-around">
				{navItems.map((item) => (
					<Nav.Link
						key={item.key}
						as={Link}
						to={item.path}
						className={`text-center px-2 ${currentView === item.key ? "text-primary" : "text-muted"}`}
						style={{
							minWidth: "auto",
							fontSize: "0.75rem",
							textDecoration: "none",
						}}
					>
						<div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>
							<FontAwesomeIcon icon={item.icon as any} />
						</div>
						<div>{item.label}</div>
					</Nav.Link>
				))}
			</Nav>
		</Navbar>
	);
};

export default BottomNav;
