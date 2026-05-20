import { type PackageSearchVariant } from './types'

export const packageSearchGradients = {
  packages: 'gr_Packages',
  hotel: 'gr_Hotel',
  groupTours: 'gr_GroupTours'
} as const

export const packageSearchVariants: Record<PackageSearchVariant, any> = {
  centered: {
    container: {
      bg: packageSearchGradients.hotel,
      pt: { base: 4, md: '7' },
      pb: { base: '60px', md: '7' }
    },
    contentWrapper: {
      maxWidth: { base: 'full', md: '1140px' },
      width: 'full',
      display: 'flex',
      justifyContent: 'center',
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
      bg: packageSearchGradients.packages,
      pt: { base: 4, md: '7' },
      pb: { base: '60px', md: '7' }
    },
    contentWrapper: {
      maxWidth: { base: 'full', md: '1140px' },
      width: 'full',
      display: 'flex',
      justifyContent: 'center',
      mx: 'auto',
      align: 'center'
    },
    content: {
      pt: { base: 4, md: '4' },
      pb: { base: 4, md: '10' }
    }
  },
  centeredGroupTours: {
    container: {
      bg: packageSearchGradients.groupTours,
      pt: { base: 4, md: '7' },
      pb: { base: '60px', md: '7' }
    },
    contentWrapper: {
      maxWidth: { base: 'full', md: '1140px' },
      display: 'flex',
      justifyContent: 'center',
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
      width: 'full',
      zIndex: 1,
    },
    container: {
      height: { base: 'auto', md: '96px' },
      position: 'fixed',
      borderBottom: '1px solid',
      borderColor: 'gray.100'
    },
    packagesContainer: {
      bg: packageSearchGradients.packages
    },
    hotelContainer: {
      bg: packageSearchGradients.hotel
    },
    groupToursContainer: {
      bg: packageSearchGradients.groupTours
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
