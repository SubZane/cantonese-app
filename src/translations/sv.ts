export const sv = {
	// Header
	appName: "Kantonesiska Appen",
	pinyin: "Pinyin",
	showPinyin: "Visa Uttal",
	difficulty: "Svårighet",
	category: "Kategori",

	// Navigation
	navigation: {
		home: "Hem",
		lessons: "Lektioner",
		quiz: "Quiz",
		profile: "Profil",
		settings: "Inställningar",
	},

	// Home page
	home: {
		welcome: "Välkommen till kantonesisk inlärning! 🇭🇰",
		subtitle: "Öva din kantonesiska ordförråd med interaktiva quiz",
		quickQuiz: {
			title: "Snabbt Quiz",
			description: "Testa dina kunskaper med svenska till kantonesiska översättningsfrågor",
			button: "Starta Quiz",
		},
		lessons: {
			title: "Lektioner",
			description: "Strukturerade inlärningsmoduler som täcker djur, mat, familj och mer",
			button: "Kommer snart",
		},
		progress: {
			title: "Framsteg",
			description: "Spåra din inlärningsresa och se hur mycket du har förbättrats",
			button: "Kommer snart",
		},
		achievements: {
			title: "Prestationer",
			description: "Lås upp märken och prestationer när du bemästrar kantonesisk ordförråd",
			button: "Kommer snart",
		},
		categories: {
			title: "Tillgängliga ordförrådskategorier",
			animals: "Djur",
			food: "Mat",
			family: "Familj",
			actions: "Handlingar",
			items: "Föremål",
		},
	},

	// Quiz filters
	filters: {
		difficulty: {
			all: "Alla nivåer",
			easy: "Lätt (1)",
			medium: "Medel (2-3)",
			hard: "Svår (4-5)",
		},
		category: {
			all: "Alla kategorier",
			animals: "Djur",
			food: "Mat",
			family: "Familj",
			actions: "Handlingar",
			items: "Föremål",
		},
	},

	// Quiz
	quiz: {
		setup: {
			title: "Konfigurera Quiz",
			description: "Välj kategori, svårighetsgrad och antal frågor för ditt quiz.",
			category: "Kategori",
			difficulty: "Svårighetsgrad",
			questionCount: "Antal frågor",
			questionPlural: "frågor",
			startButton: "Starta Quiz",
		},
		question: 'Vad är "{word}" på kantonesiska?',
		score: "Poäng",
		questionNumber: "Fråga {current} av {total}",
		correct: "✅ Rätt!",
		incorrect: "❌ Fel. Rätt svar är: {answer}",
		nextQuestion: "Nästa fråga",
		viewResults: "Visa resultat",
		yourChoice: "Ditt val",
		complete: {
			title: "Quiz slutfört! 🎉",
			score: "Din poäng: {score}/{total}",
			excellent: "Utmärkt arbete!",
			good: "Bra jobbat!",
			keepPracticing: "Fortsätt öva!",
			tryAgain: "Ge inte upp, försök igen!",
			retakeButton: "Ta quiz igen",
			restartButton: "Starta nytt quiz",
		},
		results: {
			title: "Detaljerade resultat",
			summary: "Du svarade rätt på {correct} av {total} frågor ({percentage}%)",
			correct: "Rätt",
			incorrect: "Fel",
			yourAnswer: "Ditt svar",
			correctAnswer: "Rätt svar",
		},
		loading: "Laddar fråga...",
	},

	// General
	general: {
		comingSoon: "Kommer snart",
		underDevelopment: "Den här funktionen är under utveckling",
	},
};

export default sv;
