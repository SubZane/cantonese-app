import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ExploreIcon from "@mui/icons-material/Explore";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import LanguageIcon from "@mui/icons-material/Language";
import PetsIcon from "@mui/icons-material/Pets";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";

interface IconsRadioProps {
	value?: string;
	onChange?: (value: string) => void;
	options: Array<{
		value: string;
		label: string;
		icon: string;
	}>;
}

// Map icon names to MUI icon components
const getIconComponent = (iconName: string) => {
	switch (iconName) {
		case "globe":
			return <LanguageIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "dog":
			return <PetsIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "utensils":
			return <RestaurantIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "users":
			return <FamilyRestroomIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "running":
			return <DirectionsRunIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "cube":
			return <CategoryIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "gamepad":
			return <SportsEsportsIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "clock":
			return <AccessTimeIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		case "compass":
			return <ExploreIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
		default:
			return <CategoryIcon sx={{ fontSize: "1.5rem", color: "#333" }} />;
	}
};

export default function IconsRadio({ value, onChange, options }: IconsRadioProps) {
	return (
		<RadioGroup
			aria-label="category"
			value={value}
			onChange={(event) => onChange?.(event.target.value)}
			overlay
			name="category"
			sx={{
				flexDirection: "row",
				gap: 2,
				flexWrap: "wrap",
				[`& .${radioClasses.checked}`]: {
					[`& .${radioClasses.action}`]: {
						inset: -1,
						border: "3px solid",
						borderColor: "primary.500",
					},
				},
				[`& .${radioClasses.radio}`]: {
					display: "contents",
					"& > svg": {
						zIndex: 2,
						position: "absolute",
						top: "-8px",
						right: "-8px",
						bgcolor: "background.surface",
						borderRadius: "50%",
					},
				},
			}}
		>
			{options.map((option) => (
				<Sheet
					key={option.value}
					variant="outlined"
					sx={{
						borderRadius: "md",
						boxShadow: "sm",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "flex-start",
						gap: 1,
						p: 2,
						width: 120,
						height: 135,
						minWidth: 120,
						minHeight: 120,
					}}
				>
					<Radio id={option.value} value={option.value} checkedIcon={<CheckCircleRoundedIcon />} />
					<Avatar variant="soft" size="lg" sx={{ bgcolor: "primary.100" }}>
						{getIconComponent(option.icon)}
					</Avatar>
					<FormLabel
						htmlFor={option.value}
						sx={{
							textAlign: "center",
							fontSize: "sm",
							lineHeight: 1.2,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							width: "100%",
						}}
					>
						{option.label}
					</FormLabel>
				</Sheet>
			))}
		</RadioGroup>
	);
}
