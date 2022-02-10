module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	purge: {
		enabled: false,
		content: [
			"./pages/**/*.{js,ts,jsx,tsx}",
			"./components/**/*.{js,ts,jsx,tsx}",
		],
		safelist: [],
	},
	theme: {
		extend: {
			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
				oswald: ["Oswald", "sans-serif"],
				"encode-sans-condense": ["Encode Sans Condense", "sans-serif"],
			},
		},
	},
	plugins: [],
}
