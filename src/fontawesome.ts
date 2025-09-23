import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faBars,
	faChartLine,
	faCheck,
	faChevronLeft,
	faClipboardQuestion,
	faCog,
	faEye,
	faEyeSlash,
	faGraduationCap,
	faHome,
	faLanguage,
	faPlay,
	faRotateRight,
	faTimes,
	faTrophy,
	faUser,
	faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the library
library.add(faHome, faGraduationCap, faClipboardQuestion, faUser, faCog, faCheck, faTimes, faChevronLeft, faVolumeUp, faEye, faEyeSlash, faRotateRight, faPlay, faTrophy, faChartLine, faBars, faLanguage);

export { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
