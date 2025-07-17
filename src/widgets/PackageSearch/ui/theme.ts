import { type PackageSearchVariant } from './types.ts'

export const packageSearchVariants: Record<PackageSearchVariant, any> = {
  centered: {
    container: {
      bgImage: '/assets/images/search-hero-image.jpg',
      height: { base: '432px', md: '240px' },
      px: { base: 4, md: '6' }
    },
    contentWrapper: {
      maxWidth: { base: '362px', md: '1140px' },
      width: 'full',
      mx: 'auto',
      align: 'center'
    },
    content: {
      width: 'full',
      background: 'white',
      border: '2px solid',
      borderColor: 'gray.200',
      pt: { base: 4, md: '4' },
      pb: { base: 4, md: '10' }
    }
  },
  fixed: {
    wrapper: {
      height: { base: '80px', md: '148px' },
      width: 'full'
    },
    container: {
      height: { base: 'auto', md: '148px' },
      position: 'fixed',
      borderBottom: '1px solid',
      borderColor: 'gray.100'
    },
    contentWrapper: {
      maxWidth: 'full',
      pt: { md: 4 },
      justify: 'center'
    },
    content: {
      p: { base: 3, md: 0 },
      width: 'full'
    }
  },
  fixedWithoutTabs: {
    wrapper: {
      height: { base: 'auto', md: '96px' },
      width: 'full'
    },
    container: {
      height: { base: 'auto', md: '96px' },
      position: 'fixed',
      borderBottom: '1px solid',
      borderColor: 'gray.100'
    },
    contentWrapper: {
      maxWidth: 'full',
      pb: { md: 6 },
      justify: 'center'
    },
    content: {
      p: { base: 3, md: 0 },
      width: 'full'
    }
  }
}
