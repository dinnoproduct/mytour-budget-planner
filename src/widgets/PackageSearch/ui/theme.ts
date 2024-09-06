import { PackageSearchVariant } from './types.ts'

export const packageSearchVariants: Record<PackageSearchVariant, any> = {
	'centered': {
		container: {
			bgImage: '/assets/images/search-hero-image.jpg',
			height: { base: '352px', md: '240px' },
			px: { base: 4, md: '6' }
		},
		content: {
			width: { base: '362px', md: 'auto' },
			sx: {
				backgroundBlendMode: 'color-dodge, normal',
				backdropFilter: 'blur(10px)',
				background: 'rgba(241,241,241,0.55)'
			},
			py: { base: 4, md: '10' },
			px: { base: 4, md: '6' }
		}
	},
	'fixed': {
		wrapper: {
			height: { base: '80px', md: '98px' },
			width: 'full'
		},
		container: {
			height: { base: 'auto', md: '98px' },
			position: 'fixed',
			borderBottom: '1px solid',
			borderColor: 'gray.100'
		},
		content: {
			p: { base: 3, md: 0 }
		}
	}
}