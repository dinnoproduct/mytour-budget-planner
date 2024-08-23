export const typographyTheme = {
	fonts: {
		heading: '"Noto Sans Armenian", sans-serif',
		body: '"Noto Sans Armenian", sans-serif'
	},
	fontSizes: {
		'text-xs': '0.75rem',
		'text-sm': '0.875rem',
		'text-md': '1rem',
		'text-lg': '1.125rem',
		'text-xl': '1.25rem',
		'text-2xl': '1.5rem',
		'text-3xl': '1.875rem',
		'text-4xl': '2.25rem',
		'text-5xl': '3rem',
		'text-6xl': '3.75rem',

		'heading-lg-xs': '0.875rem',
		'heading-lg-sm': '1rem',
		'heading-lg-md': '1.25rem',
		'heading-lg-lg': '1.875rem',
		'heading-lg-xl': '2.25rem',
		'heading-lg-2xl': '3rem',
		'heading-lg-3xl': '3.75rem',
		'heading-lg-4xl': '4.5rem',

		'heading-sm-xs': '0.875rem',
		'heading-sm-sm': '1rem',
		'heading-sm-md': '1.25rem',
		'heading-sm-lg': '1.5rem',
		'heading-sm-xl': '1.875rem',
		'heading-sm-2xl': '2.25rem',
		'heading-sm-3xl': '3rem',
		'heading-sm-4xl': '3.75rem'
	},
	lineHeights: {
		'text-xs': '1.125rem',
		'text-sm': '1.315rem',
		'text-md': '1.5rem',
		'text-lg': '1.6875rem',
		'text-xl': '1.875rem',
		'text-2xl': '2.25rem',
		'text-3xl': '2.8125rem',
		'text-4xl': '3.375rem',
		'text-5xl': '4.5rem',
		'text-6xl': '5.625rem',

		'heading-lg-xs': '1.05rem',
		'heading-lg-sm': '1.2rem',
		'heading-lg-md': '1.5rem',
		'heading-lg-lg': '2.25rem',
		'heading-lg-xl': '2.7rem',
		'heading-lg-2xl': '3rem',
		'heading-lg-3xl': '3.75rem',
		'heading-lg-4xl': '4.5rem',

		'heading-sm-xs': '1.05rem',
		'heading-sm-sm': '1.2rem',
		'heading-sm-md': '1.5rem',
		'heading-sm-lg': '2rem',
		'heading-sm-xl': '2.5rem',
		'heading-sm-2xl': '2.7rem',
		'heading-sm-3xl': '3rem',
		'heading-sm-4xl': '3.75rem'
	}
}

export const typographyComponentTheme = {
	Text: {
		baseStyle: {
			color: 'black',
			fontWeight: 'normal'
		},
		variants: {
			'text-xs': {
				fontSize: 'text-xs',
				lineHeight: 'text-xs'
			},
			'text-sm': {
				fontSize: 'text-sm',
				lineHeight: 'text-sm'
			},
			'text-md': {
				fontSize: 'text-md',
				lineHeight: 'text-md'
			},
			'text-lg': {
				fontSize: 'text-lg',
				lineHeight: 'text-lg'
			},
			'text-xl': {
				fontSize: 'text-xl',
				lineHeight: 'text-xl'
			},
			'text-2xl': {
				fontSize: 'text-2xl',
				lineHeight: 'text-2xl'
			},
			'text-3xl': {
				fontSize: 'text-3xl',
				lineHeight: 'text-3xl'
			},
			'text-4xl': {
				fontSize: 'text-4xl',
				lineHeight: 'text-4xl'
			},
			'text-5xl': {
				fontSize: 'text-5xl',
				lineHeight: 'text-5xl',
				fontWeight: 'medium',
			},
			'text-6xl': {
				fontSize: 'text-6xl',
				lineHeight: 'text-6xl',
				fontWeight: 'medium'
			}
		}
	},
	Heading: {
		baseStyle: {
			color: 'black',
			fontWeight: 'bold'
		},
		variants: {
			'heading-sm-xs': {
				fontSize: 'heading-sm-xs',
				lineHeight: 'heading-sm-xs'
			},
			'heading-sm-sm': {
				fontSize: 'heading-sm-sm',
				lineHeight: 'heading-sm-sm'
			},
			'heading-sm-md': {
				fontSize: 'heading-sm-md',
				lineHeight: 'heading-sm-md'
			},
			'heading-sm-lg': {
				fontSize: 'heading-sm-lg',
				lineHeight: 'heading-sm-lg'
			},
			'heading-sm-xl': {
				fontSize: 'heading-sm-xl',
				lineHeight: 'heading-sm-xl'
			},
			'heading-sm-2xl': {
				fontSize: 'heading-sm-2xl',
				lineHeight: 'heading-sm-2xl'
			},
			'heading-sm-3xl': {
				fontSize: 'heading-sm-3xl',
				lineHeight: 'heading-sm-3xl'
			},
			'heading-sm-4xl': {
				fontSize: 'heading-sm-4xl',
				lineHeight: 'heading-sm-4xl'
			},
			'heading-xs': {
				fontSize: {
					base: 'heading-sm-xs',
					lg: 'heading-lg-xs'
				},
				lineHeight: {
					base: 'heading-sm-xs',
					lg: 'heading-lg-xs'
				}
			},
			'heading-sm': {
				fontSize: {
					base: 'heading-sm-sm',
					lg: 'heading-lg-sm'
				},
				lineHeight: {
					base: 'heading-sm-sm',
					lg: 'heading-lg-sm'
				}
			},
			'heading-md': {
				fontSize: {
					base: 'heading-sm-md',
					lg: 'heading-lg-md'
				},
				lineHeight: {
					base: 'heading-sm-md',
					lg: 'heading-lg-md'
				}
			},
			'heading-lg': {
				fontSize: {
					base: 'heading-sm-lg',
					lg: 'heading-lg-lg'
				},
				lineHeight: {
					base: 'heading-sm-lg',
					lg: 'heading-lg-lg'
				}
			},
			'heading-xl': {
				fontSize: {
					base: 'heading-sm-xl',
					lg: 'heading-lg-xl'
				},
				lineHeight: {
					base: 'heading-sm-xl',
					lg: 'heading-lg-xl'
				}
			},
			'heading-2xl': {
				fontSize: {
					base: 'heading-sm-2xl',
					lg: 'heading-lg-2xl'
				},
				lineHeight: {
					base: 'heading-sm-2xl',
					lg: 'heading-lg-2xl'
				}
			},
			'heading-3xl': {
				fontSize: {
					base: 'heading-sm-3xl',
					lg: 'heading-lg-3xl'
				},
				lineHeight: {
					base: 'heading-sm-3xl',
					lg: 'heading-lg-3xl'
				}
			},
			'heading-4xl': {
				fontSize: {
					base: 'heading-sm-4xl',
					lg: 'heading-lg-4xl'
				},
				lineHeight: {
					base: 'heading-sm-4xl',
					lg: 'heading-lg-4xl'
				}
			}
		}
	}
}
