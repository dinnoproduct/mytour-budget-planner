import { type PackageSearchVariant } from './types.ts'

export const packageSearchVariants: Record<PackageSearchVariant, any> = {
  centered: {
    container: {
      background: 'linear-gradient(177.92deg, #8408FF 1.7%, #93C5FF 98.21%)',
      pt: { base: 4, md: '7' },
      pb: { base: '60px', md: '7' }
    },
    contentWrapper: {
      maxWidth: { base: 'full', md: '1140px' },
      width: 'full',
      mx: 'auto',
      align: 'center'
    },
    content: {
      pt: { base: 4, md: '4' },
      pb: { base: 4, md: '10' }
    }
  },
  centeredPackage: {
    container: {
      background: 'linear-gradient(178deg, #017BFE 1.7%, #00CFFF 98.21%)',
      pt: { base: 4, md: '7' },
      pb: { base: '60px', md: '7' }
    },
    contentWrapper: {
      maxWidth: { base: 'full', md: '1140px' },
      width: 'full',
      mx: 'auto',
      align: 'center'
    },
    content: {
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
