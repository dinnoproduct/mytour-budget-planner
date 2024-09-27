import { themeColor } from '@foundation/Colors'

const variantCommonStyles = {
	'.chakra-button__icon': {
		ml: '-spacing-02'
	},
	'.button__label+.chakra-button__icon': {
		mr: '-spacing-02'
	}
}

const variantIconCommonStyles = {
	minWidth: 'auto',
	width: 'auto',
	'.chakra-button__icon': {
		mr: 0
	}
}

const variantLinkCommonStyles = {
	_disabled: {
		background: 'transparent',
		'&[data-loading]': {
			background: 'transparent',
			_hover: {
				background: 'transparent'
			}
		}
	}
}

const variantLinkHoverCommonStyles = {
	textDecoration: 'underline',
	_disabled: {
		textDecoration: 'none'
	}
}

export const buttonComponentTheme = {
	Button: {
		baseStyle: {
			borderRadius: '6px',
			fontFamily: 'heading',
			fontWeight: 'medium',
			background: 'transparent',
			color: 'white',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			textDecoration: 'none',
			minW: '24px',

			_hover: {
				background: 'transparent'
			},
			_active: {
				_focus: {
					boxShadow: 'none'
				},
				_focusVisible: {
					boxShadow: 'none'
				}
			},
			_focusVisible: {
				outline: 'unset'
			},
			_disabled: {
				opacity: 1,
				'svg>path': {
					fill: 'text.disabled'
				},
				color: 'text.disabled',
				_hover: {
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				},
				_active: {
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				},
				_focus: {
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				}
			},
			'.chakra-button__spinner': {
				position: 'relative'
			}
		},
		variants: {
			'solid-blue': {
				...variantCommonStyles,
				background: 'blue.500',
				color: 'white',
				_hover: {
					background: 'blue.600',
					_disabled: {
						background: 'gray.300',
						color: 'white'
					}
				},
				_active: {
					background: 'blue.700',
					_disabled: {
						background: 'gray.300',
						color: 'white'
					}
				},
				_focus: {
					background: 'blue.700'
				},
				_focusVisible: {
					background: 'blue.700'
				},
				_disabled: {
					background: 'gray.300',
					color: 'white'
				},
				'svg[data-fill=true]>path': {
					fill: 'white'
				}
			},
			'solid-gray': {
				...variantCommonStyles,
				background: 'gray.100',
				color: 'gray.600',
				_hover: {
					background: 'gray.200',
					_disabled: {
						background: 'gray.100'
					}
				},
				_active: {
					background: 'gray.300',
					_disabled: {
						background: 'gray.100'
					}
				},
				_focus: {
					background: 'gray.300'
				},
				_focusVisible: {
					background: 'gray.300'
				},
				_disabled: {
					background: 'gray.100',
					color: 'gray.400'
				},
				'svg[data-fill=true]>path': {
					fill: 'gray.100'
				}
			},
			'solid-red': {
				...variantCommonStyles,
				background: 'red.500',
				color: 'white',
				_hover: {
					background: 'red.600'
				},
				_active: {
					background: 'red.700'
				},
				_focus: {
					background: 'red.700'
				},
				_focusVisible: {
					background: 'red.700'
				},
				'svg[data-fill=true]>path': {
					fill: 'gray.100'
				}
			},
			'outline-blue': {
				...variantCommonStyles,
				background: 'transparent',
				color: 'blue.500',
				border: '1px solid',
				borderColor: 'blue.500',
				_hover: {
					color: 'blue.600',
					borderColor: 'blue.600',
					background: 'transparent',
					_disabled: {
						background: 'transparent'
					}
				},
				_active: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent',
					_disabled: {
						background: 'transparent'
					}
				},
				_focus: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent'
				},
				_focusVisible: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent'
				},
				_disabled: {
					background: 'transparent',
					borderColor: 'gray.300',
					color: 'gray.300'
				},
				'svg[data-fill=true]>path': {
					fill: 'gray.300'
				}
			},
			'text-blue': {
				...variantCommonStyles,
				background: 'transparent',
				color: 'blue.500',
				border: 'none',
				borderColor: 'none',
				'svg[data-fill=true]>path': {
					fill: 'blue.500'
				},
				_hover: {
					color: 'blue.600',
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.600'
					},
					_disabled: {
						background: 'transparent'
					}
				},
				_active: {
					color: 'blue.700',
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
					_disabled: {
						background: 'transparent'
					}
				},
				_focus: {
					color: 'blue.700',
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
				},
				_focusVisible: {
					color: 'blue.700',
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
				},
				_disabled: {
					background: 'transparent',
					borderColor: 'none',
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				}
			},
			'outline-red': {
				...variantCommonStyles,
				background: 'transparent',
				color: 'red.500',
				border: '1px solid',
				borderColor: 'red.500',
				_hover: {
					color: 'red.600',
					borderColor: 'red.600',
					background: 'transparent',
					_disabled: {
						background: 'transparent'
					}
				},
				_active: {
					color: 'red.700',
					borderColor: 'red.700',
					background: 'transparent',
					_disabled: {
						background: 'transparent'
					}
				},
				_focus: {
					color: 'red.700',
					borderColor: 'red.700',
					background: 'transparent'
				},
				_focusVisible: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent'
				},
				'svg[data-fill=true]>path': {
					fill: 'red.500'
				}
			},

			'solid-blue-icon': {
				...variantCommonStyles,
				background: 'blue.500',
				color: 'white',
				_hover: {
					background: 'blue.600',
					'svg[data-fill=true]>path': {
						fill: 'white'
					},
					_disabled: {
						background: 'gray.300',
						'svg[data-fill=true]>path': {
							fill: 'white'
						}
					}
				},
				_active: {
					background: 'blue.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					},
					_disabled: {
						background: 'gray.300',
						'svg[data-fill=true]>path': {
							fill: 'white'
						}
					}
				},
				_focus: {
					background: 'blue.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				_focusVisible: {
					background: 'blue.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				_disabled: {
					background: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				'svg[data-fill=true]>path': {
					fill: 'white'
				}
			},
			'outline-blue-icon': {
				...variantCommonStyles,
				background: 'transparent',
				color: 'blue.500',
				border: '1px solid',
				borderColor: 'blue.500',
				_hover: {
					color: 'blue.600',
					borderColor: 'blue.600',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.600'
					},
					_disabled: {
						background: 'transparent',
						'svg[data-fill=true]>path': {
							fill: 'gray.300'
						}
					}
				},
				_active: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
					_disabled: {
						background: 'transparent',
						'svg[data-fill=true]>path': {
							fill: 'gray.300'
						}
					}
				},
				_focus: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					}
				},
				_focusVisible: {
					color: 'blue.700',
					borderColor: 'blue.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					}
				},
				_disabled: {
					background: 'transparent',
					borderColor: 'gray.300',
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				},
				'svg[data-fill=true]>path': {
					fill: 'blue.500'
				}
			},
			'solid-gray-icon': {
				...variantCommonStyles,
				background: 'gray.100',
				color: 'gray.600',
				_hover: {
					background: 'gray.200',
					'svg[data-fill=true]>path': {
						fill: 'gray.600'
					},
					_disabled: {
						background: 'gray.100',
						'svg[data-fill=true]>path': {
							fill: 'gray.400'
						}
					}
				},
				_active: {
					background: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.600'
					},
					_disabled: {
						background: 'gray.100',
						'svg[data-fill=true]>path': {
							fill: 'gray.400'
						}
					}
				},
				_focus: {
					background: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.600'
					}
				},
				_focusVisible: {
					background: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.600'
					}
				},
				_disabled: {
					background: 'gray.100',
					'svg[data-fill=true]>path': {
						fill: 'gray.400'
					}
				},
				'svg[data-fill=true]>path': {
					fill: 'gray.600'
				}
			},
			'solid-red-icon': {
				...variantCommonStyles,
				background: 'red.500',
				color: 'white',
				_hover: {
					background: 'red.600',
					'svg[data-fill=true]>path': {
						fill: 'white'
					},
					_disabled: {
						background: 'gray.300',
						'svg[data-fill=true]>path': {
							fill: 'white'
						}
					}
				},
				_active: {
					background: 'red.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					},
					_disabled: {
						background: 'gray.300',
						'svg[data-fill=true]>path': {
							fill: 'white'
						}
					}
				},
				_focus: {
					background: 'red.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				_focusVisible: {
					background: 'red.700',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				_disabled: {
					background: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'white'
					}
				},
				'svg[data-fill=true]>path': {
					fill: 'white'
				}
			},
			'outline-red-icon': {
				...variantCommonStyles,
				background: 'transparent',
				color: 'red.500',
				border: '1px solid',
				borderColor: 'red.500',
				_hover: {
					color: 'red.600',
					borderColor: 'red.600',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'red.600'
					},
					_disabled: {
						background: 'transparent',
						'svg[data-fill=true]>path': {
							fill: 'gray.300'
						}
					}
				},
				_active: {
					color: 'red.700',
					borderColor: 'red.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'red.700'
					},
					_disabled: {
						background: 'transparent',
						'svg[data-fill=true]>path': {
							fill: 'gray.300'
						}
					}
				},
				_focus: {
					color: 'red.700',
					borderColor: 'red.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'red.700'
					}
				},
				_focusVisible: {
					color: 'red.700',
					borderColor: 'red.700',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'red.700'
					}
				},
				_disabled: {
					background: 'transparent',
					borderColor: 'gray.300',
					color: 'gray.300',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				},
				'svg[data-fill=true]>path': {
					fill: 'red.500'
				}
			},
			'text-blue-icon': {
				...variantCommonStyles,
				background: 'transparent',
				border: 'none',
				borderColor: 'none',
				'svg[data-fill=true]>path': {
					fill: 'blue.500'
				},
				_hover: {
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.600'
					},
					_disabled: {
						background: 'transparent'
					}
				},
				_active: {
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
					_disabled: {
						background: 'transparent'
					}
				},
				_focus: {
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
				},
				_focusVisible: {
					borderColor: 'none',
					background: 'transparent',
					'svg[data-fill=true]>path': {
						fill: 'blue.700'
					},
				},
				_disabled: {
					background: 'transparent',
					borderColor: 'none',
					'svg[data-fill=true]>path': {
						fill: 'gray.300'
					}
				}
			},
		},
		sizes: {
			lg: {
				height: '12',
				px: '6',
				'.chakra-button__icon': {
					mr: 'spacing-03'
				},
				'.button__label+.chakra-button__icon': {
					ml: 'spacing-03'
				},
				fontSize: 'text-lg',
				lineHeight: 'text-lg'
			},
			md: {
				height: '10',
				px: '4',
				'.chakra-button__icon': {
					mr: 'spacing-03'
				},
				'.button__label+.chakra-button__icon': {
					ml: 'spacing-03'
				},
				fontSize: 'text-md',
				lineHeight: 'text-md'
			},
			sm: {
				height: '8',
				px: '3',
				'.chakra-button__icon': {
					mr: 'spacing-02'
				},
				'.button__label+.chakra-button__icon': {
					ml: 'spacing-02'
				},
				fontSize: 'text-sm',
				lineHeight: 'text-sm'
			},
			xs: {
				height: '6',
				px: '2',
				'.chakra-button__icon': {
					mr: 'spacing-02'
				},
				'.button__label+.chakra-button__icon': {
					ml: 'spacing-02'
				},
				fontSize: 'text-xs',
				lineHeight: 'text-xs'
			},
			'lg-icon': {
				height: '12',
				px: '3',
				svg: {
					height: '6',
					width: '6'
				}
			},
			'md-icon': {
				height: '10',
				px: '10px',
				svg: {
					height: '5',
					width: '5'
				}
			},
			'sm-icon': {
				height: '8',
				px: '9px',
				svg: {
					height: '16px',
					width: '16px'
				}
			},
			'xs-icon': {
				height: '6',
				px: '6px',
				svg: {
					height: '12px',
					width: '12px'
				}
			}
		}
	}
}
