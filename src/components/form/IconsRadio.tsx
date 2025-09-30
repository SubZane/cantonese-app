import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
						gap: 1.5,
						p: 2,
						minWidth: 120,
						minHeight: 100,
					}}
				>
					<Radio id={option.value} value={option.value} checkedIcon={<CheckCircleRoundedIcon />} />
					<Avatar variant="soft" size="lg" sx={{ bgcolor: "primary.100" }}>
						<FontAwesomeIcon icon={option.icon as any} style={{ fontSize: "1.5rem", color: "#333" }} />
					</Avatar>
					<FormLabel htmlFor={option.value} sx={{ textAlign: "center", fontSize: "sm" }}>
						{option.label}
					</FormLabel>
				</Sheet>
			))}
		</RadioGroup>
	);
}
