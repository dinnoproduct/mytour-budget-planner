import React, { useMemo } from 'react'
import {
  Button,
  Divider,
  MenuButton as ChakraMenuButton,
  MenuItem as ChakraMenuItem
} from '@chakra-ui/react'
import { Avatar, Icon } from '@ui'
import { Menu, MenuList } from './Menu'
import { useTranslation } from 'react-i18next'
import { useModalContext } from '@app/providers'
import { useUserContext } from '@entities/user'
import { Link as RouterLink } from 'react-router-dom'
import { useLanguageRouting } from '@/hooks/useLanguageRouting'
import { appendStoredUTMsToPath } from '@/utils/utmParams'

export const AccountMenu = ({}) => {
  const { user } = useUserContext()
  const userFullName = useMemo(() => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName}`
    }

    return ''
  }, [user?.firstName])

  return (
    <Menu offset={[0, 4]}>
      <MenuButton userFullName={userFullName} />

      <MenuList menuButtonSize={86}>
        {user ? <MenuItemsUser /> : <MenuItemsGuest />}
      </MenuList>
    </Menu>
  )
}

const MenuItemsGuest = ({}) => {
  const { t } = useTranslation()
  const { dispatchModal } = useModalContext()

  const handleSignInClick = () => {
    dispatchModal({
      type: 'open',
      modalType: 'auth',
      props: {
        view: 'signIn'
      }
    })
  }

  const handleSignUpClick = () => {
    dispatchModal({
      type: 'open',
      modalType: 'auth',
      props: {
        view: 'signUp'
      }
    })
  }

  return (
    <>
      <MenuItem onClick={handleSignInClick}>{t`sign-in`}</MenuItem>
      <MenuItem onClick={handleSignUpClick}>{t`sign-up`}</MenuItem>
    </>
  )
}

const MenuItemsUser = ({}) => {
  const { t } = useTranslation()
  const { signOut } = useUserContext()
  const { dispatchModal } = useModalContext()
  const { getPathWithLanguage } = useLanguageRouting()
  const myPackagesPath = useMemo(
    () => appendStoredUTMsToPath(getPathWithLanguage('/my-packages')),
    [getPathWithLanguage]
  )

  const handleSignOutClick = () => {
    signOut()
  }

  const handlePersonalInformationClick = () => {
    dispatchModal({
      type: 'open',
      modalType: 'profileDetails'
    })
  }

  return (
    <>
      <MenuItem to={myPackagesPath}>{t`myPackages`}</MenuItem>
      <MenuItem
        onClick={handlePersonalInformationClick}
      >{t`personalInformation`}</MenuItem>
      <Divider color="gray.100" />
      <MenuItem onClick={handleSignOutClick}>{t`signОut`}</MenuItem>
    </>
  )
}

const MenuItem = ({ children, ...props }: any) => {
  const linkProps = useMemo(() => {
    if (props.to) {
      return {
        as: RouterLink,
        to: props.to
      }
    }

    return {}
  }, [props.to])

  return (
    <ChakraMenuItem
      bgColor="white"
      height="40px"
      px="4"
      _hover={{
        bgColor: 'gray.50'
      }}
      _active={{
        bgColor: 'gray.100'
      }}
      _focus={{
        bgColor: 'gray.100'
      }}
      _focusVisible={{
        bgColor: 'gray.100'
      }}
      fontSize="text-md"
      lineHeight="text-md"
      {...props}
      {...linkProps}
    >
      {children}
    </ChakraMenuItem>
  )
}

const MenuButton = ({ isGuest = true, userFullName, ...props }: any) => (
  <ChakraMenuButton
    as={Button}
    bgColor="white"
    rounded="md"
    height="48px"
    px="2"
    border="1px solid"
    borderColor="gray.200"
    sx={{
      span: {
        display: 'flex',
        alignItems: 'center'
      }
    }}
    _hover={{
      bgColor: 'gray.50'
    }}
    _active={{
      bgColor: 'gray.100'
    }}
    _focus={{
      bgColor: 'gray.100'
    }}
    _focusVisible={{
      bgColor: 'gray.100'
    }}
    {...props}
  >
    <Icon name="menu" size="24" color="gray.500" />

    <Avatar size="sm" ml="3" name={userFullName} />
  </ChakraMenuButton>
)
