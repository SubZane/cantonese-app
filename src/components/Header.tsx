import React from "react";

import { Box, FormControl, FormLabel, Switch } from "@mui/joy";

import { useT } from "../translations";

interface HeaderProps {
	showPinyin?: boolean;
	onPinyinToggle?: () => void;
	showToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showPinyin = false, onPinyinToggle, showToggle = false }) => {
	const { t } = useT();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				px: 3,
				py: 2,
				backgroundColor: "#292A37",
				borderBottom: "1px solid var(--joy-palette-divider)",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				{/* Logo */}
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						overflow: "hidden",
					}}
				>
					<img
						src="/logo.png"
						alt="Logo"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				</Box>
			</Box>
			{showToggle && onPinyinToggle && (
				<FormControl orientation="horizontal" sx={{ gap: 1 }}>
					<FormLabel sx={{ color: "#ffffff", fontSize: "0.9rem", mb: 0 }}>{t.showPinyin}</FormLabel>
					<Switch checked={showPinyin} onChange={onPinyinToggle} />
				</FormControl>
			)}
		</Box>
	);
};

export default Header;
