export const sv = {
	// Header
	appName: "Kantonesiska Appen",
	jyutping: "Jyutping",
	showJyutping: "Visa Uttal",
	difficulty: "Svårighet",
	category: "Kategori",

	// Navigation
	navigation: {
		home: "Hem",
		lessons: "Lektioner",
		quiz: "Quiz",
		vocabulary: "Ordförråd",
		profile: "Profil",
		settings: "Inställningar",
		menu: "Meny",
		showJyutping: "Visa Uttal",
		hkVariant: "HK Variant",
	},

	// Common buttons
	buttons: {
		start: "Starta",
		next: "Nästa",
		previous: "Föregående",
		finish: "Avsluta",
		tryAgain: "Försök igen",
		home: "Hem",
		back: "Tillbaka",
		backToSetup: "Tillbaka till inställningar",
		save: "Spara",
		cancel: "Avbryt",
		submit: "Skicka",
		reset: "Återställ",
		close: "Stäng",
		open: "Öppna",
		edit: "Redigera",
		delete: "Ta bort",
		confirm: "Bekräfta",
	},

	// Common labels
	labels: {
		score: "Poäng",
		correct: "Rätt",
		incorrect: "Fel",
		total: "Totalt",
		percentage: "Procent",
		time: "Tid",
		difficulty: "Svårighetsgrad",
		category: "Kategori",
		search: "Sök",
		filter: "Filtrera",
		sort: "Sortera",
		language: "Språk",
		pronunciation: "Uttal",
		translation: "Översättning",
		example: "Exempel",
		hint: "Tips",
		loading: "Laddar",
		error: "Fel",
		success: "Framgång",
		warning: "Varning",
		info: "Information",
		settings: "Inställningar",
		swedish: "Svenska",
		english: "Engelska",
	},

	// Home page
	home: {
		welcome: "Välkommen till din kantonesiska språkträning! 🇭🇰",
		subtitle: "Träna ditt kantonesiska ordförråd med denna interaktiva quiz",
		quickQuiz: {
			title: "Snabbquiz",
			description: "Testa dina kunskaper med frågor där du översätter från svenska till kantonesiska",
			button: "Starta quiz",
		},
		lessons: {
			title: "Lektioner",
			description: "Strukturerade kurser som täcker djur, mat, familj och mycket mer",
			button: "Kommer snart",
		},
		progress: {
			title: "Framsteg",
			description: "Följ din utveckling och se hur du förbättras över tid",
			button: "Kommer snart",
		},
		achievements: {
			title: "Prestationer",
			description: "Lås upp märken när du bemästrar fler ord och kategorier",
			button: "Kommer snart",
		},
		categories: {
			title: "Tillgängliga kategorier",
			animals: "Djur",
			food: "Mat",
			family: "Familj",
			actions: "Handlingar",
			items: "Föremål",
			funPlay: "Lek & Nöje",
			time: "Tid",
			movementDirections: "Rörelse & Riktningar",
		},
	},

	// Quiz filters
	filters: {
		difficulty: {
			all: "Alla nivåer",
			easy: "Lätt",
			medium: "Medel",
			hard: "Svår",
			1: "Lätt",
			2: "Medel",
			3: "Svår",
		},
		category: {
			all: "Alla kategorier",
			animals: "Djur",
			food: "Mat",
			family: "Familj",
			actions: "Handlingar",
			items: "Föremål",
			funPlay: "Lek & Roligt",
			time: "Tid",
			movementDirections: "Rörelse & Riktningar",
		},
	},

	// Quiz
	quiz: {
		setup: {
			title: "Quiz-inställningar",
			description: "Välj kategori och svårighetsgrad för ditt quiz",
			category: "Välj kategori",
			difficultyAndQuestions: "Svårighet och antal frågor",
			difficulty: "Svårighetsgrad",
			questionCount: "Antal frågor",
			questionPlural: "frågor",
			startButton: "Starta quiz",
		},
		question: "Fråga",
		questionNumber: "Fråga {current} av {total}",
		cancelQuiz: "Avbryt quiz",
		confirmCancel: "Är du säker på att du vill avbryta quizet? Din framsteg kommer att förloras.",
		nextQuestion: "Nästa fråga",
		viewResults: "Visa resultat",
		complete: {
			title: "Quiz slutfört!",
			score: "Du fick {score} av {total} rätt!",
			percentage: "Det är {percentage}%",
			excellent: "Utmärkt arbete! Du behärskar verkligen kantonesiska!",
			good: "Bra jobbat! Du gör stora framsteg.",
			keepPracticing: "Fortsätt träna, du blir bättre och bättre!",
			tryAgain: "Prova igen, du kommer att klara dig bättre nästa gång!",
			restartButton: "Starta nytt quiz",
		},
		results: {
			title: "Resultat",
			summary: "Du fick {correct} av {total} rätt ({percentage}%)",
			yourAnswer: "Ditt svar",
			correctAnswer: "Rätt svar",
		},
		errors: {
			notEnoughWords: "Det finns inte tillräckligt med unika ord. Hittade {found} ord men behöver {needed}. Välj färre frågor eller ändra dina filter.",
			noMatchingFilters: "Det finns inte tillräckligt med ordförråd som matchar dina valda filter. Prova andra inställningar.",
		},
		loading: "Laddar ordförråd...",
	},

	// General
	general: {
		comingSoon: "Kommer snart",
		underDevelopment: "Den här funktionen är under utveckling",
	},

	// Vocabulary page
	vocabulary: {
		title: "Ordförråd",
		filterByCategory: "Filtrera efter kategori",
		searchPlaceholder: "Sök ord",
		searchDescription: "Sök på svenska, kinesiska eller jyutping...",
		showingResults: "Visar {count} ord",
		noResults: "Inga ord hittades med de valda filtren.",
		swedish: "Svenska",
		cantonese: "Kantonesiska",
		pronunciation: "Uttal",
		difficulty: "Svårighet",
		category: "Kategori",
	},
};

export default sv;
