export const menuComponentTheme = {
	Menu: {
		baseStyle: {
			list: {
				boxShadow: 'md',
				rounded: 'xl',
				border: 'none',
				zIndex: 10,
				bgColor:"white",
				width:"fit-content",
				minWidth:"max-content"
			},
			item: {
				px: 4,
				py: 2,
			}
		},
		defaultProps: {
			offset: [0, 4]
		}
	}
}