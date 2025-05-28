
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				light_blue: {
					DEFAULT: '#93b7be',
					100: '#19272a',
					200: '#324f54',
					300: '#4c767e',
					400: '#699ba5',
					500: '#93b7be',
					600: '#a8c5cb',
					700: '#bed4d8',
					800: '#d4e2e5',
					900: '#e9f1f2'
				},
				mint_cream: {
					DEFAULT: '#f1fffa',
					100: '#006340',
					200: '#00c681',
					300: '#2affb4',
					400: '#8dffd7',
					500: '#f1fffa',
					600: '#f3fffb',
					700: '#f6fffc',
					800: '#f9fffd',
					900: '#fcfffe'
				},
				timberwolf: {
					DEFAULT: '#d5c7bc',
					100: '#32271f',
					200: '#634e3e',
					300: '#95755d',
					400: '#b79e8c',
					500: '#d5c7bc',
					600: '#ded3ca',
					700: '#e6ded7',
					800: '#efe9e5',
					900: '#f7f4f2'
				},
				rose_taupe: {
					DEFAULT: '#785964',
					100: '#181214',
					200: '#302428',
					300: '#48353c',
					400: '#604750',
					500: '#785964',
					600: '#997581',
					700: '#b297a1',
					800: '#ccbac0',
					900: '#e5dce0'
				},
				onyx: {
					DEFAULT: '#454545',
					100: '#0e0e0e',
					200: '#1c1c1c',
					300: '#292929',
					400: '#373737',
					500: '#454545',
					600: '#6a6a6a',
					700: '#8f8f8f',
					800: '#b5b5b5',
					900: '#dadada'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
