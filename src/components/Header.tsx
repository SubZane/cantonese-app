import React from "react";
import { Form, Navbar } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useT } from "../translations";

interface HeaderProps {
	showPinyin?: boolean;
	onPinyinToggle?: () => void;
	showToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showPinyin = false, onPinyinToggle, showToggle = false }) => {
	const { t } = useT();

	return (
		<Navbar variant="dark" className="px-3" style={{ backgroundColor: "#333" }}>
			<Navbar.Brand className="d-flex align-items-center">
				<FontAwesomeIcon icon="language" className="me-2" />
				{t.appName}
			</Navbar.Brand>
			{showToggle && onPinyinToggle && (
				<div className="ms-auto d-flex align-items-center">
					<Form.Check type="switch" id="pinyin-switch" label={t.showPinyin} checked={showPinyin} onChange={onPinyinToggle} className="text-white mb-0" style={{ fontSize: "0.9rem" }} />
				</div>
			)}
		</Navbar>
	);
};

export default Header;
