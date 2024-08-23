export const alertComponentTheme = {
  Alert: {
    baseStyle: {
      container: {
      },
      title: {
        mx: 0,
        fontSize: 'text-md',
        fontWeight: 'bold',
        color: 'gray.700'
      },
      description: {
        mx: 0,
        fontSize: 'text-md',
        fontWeight: 'normal',
        color: 'gray.700'
      },
    },
    variants: {
      solid: {
        title: {
          color: 'white'
        },
        description: {
          color: 'white'
        },
      }
    }
  }
}
