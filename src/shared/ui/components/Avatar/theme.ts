export const avatarComponentTheme = {
  Avatar: {
    baseStyle: {
      badge: {
        bgColor: 'green.500',
        transform: 'translate(0%, 0%)',
      },
      container: {
        color: 'white'
      }
    },
    sizes: {
      'xs': {
        badge: {
          boxSize: '7px',
          border: '1px solid',
        }
      },
      'sm': {
        badge: {
          boxSize: '10px',
          border: '2px solid',
        }
      },
      'md': {
        badge: {
          boxSize: '19px',
          border: '3px solid',
          transform: 'translate(18%, 18%)',
        }
      },
      'lg': {
        badge: {
          boxSize: '19px',
          border: '3px solid',
          transform: 'translate(-5%, -5%)',
        }
      },
      'xl': {
        badge: {
          boxSize: '29px',
          border: '5px solid',

        }
      },
      '2xl': {
        badge: {
          boxSize: '48px',
          border: '8px solid',
          transform: 'translate(16%, 16%)',
        }
      }
    }
  }
}
