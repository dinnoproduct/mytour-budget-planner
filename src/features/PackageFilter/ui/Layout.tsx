import React, { useState, useEffect } from 'react'
import { useBreakpoint } from '@/shared/hooks'
import { Button, DotBadge, Icon } from '@/shared/ui'
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Show,
  Hide
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

type DesktopLayoutProps = {
  children: React.ReactNode
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => (
  <Box
    minWidth="326px"
    width="326px"
    bgColor="gray.50"
    p={6}
    borderRadius="xl"
  >
    {children}
  </Box>
)

type MobileLayoutProps = {
  children: React.ReactNode
  isActive: boolean
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  isActive = false,
  children
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isMd } = useBreakpoint()
  const { t } = useTranslation()

  useEffect(() => {
    if (isMenuOpen && !isMd) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMd, isMenuOpen])

  const onCloseMenu = () => {
    setIsMenuOpen(false)
  }

  const childrenClone = React.isValidElement(children)
    ? React.cloneElement(children, { onCloseMenu } as any)
    : undefined

  const leftIcon = (
    <DotBadge dotSize="12px" hasNotification={isActive}>
      <Icon name="filter-list" size="16" />
    </DotBadge>
  )

  return (
    <Menu isOpen={isMenuOpen} offset={[0, 4]}>
      <MenuButton
        as={Button}
        variant="outline-blue"
        isFillIconColor
        leftIcon={leftIcon}
        rounded="full"
        onClick={() => setIsMenuOpen(true)}
      >
        {t`filter`}
      </MenuButton>

      <Portal>
        <MenuList
          pt={{ base: '0', md: '10px' }}
          pb={0}
          borderRadius={{ base: '0', md: 'xl' }}
          border="none"
          minWidth="fit-content"
          height="full"
          width="full"
          rootProps={{
            position: { base: 'fixed !important' as any, md: undefined },
            top: { base: '80px !important', md: undefined },
            left: { base: '0 !important', md: undefined },
            right: { base: '0 !important', md: undefined },
            bottom: { base: '0 !important', md: undefined },
            height: {
              base: 'calc(100dvh - 80px) !important',
              md: undefined
            },
            zIndex: { base: '100000 !important', md: undefined },
            overflowY: { base: 'auto !important' as any, md: undefined },
            width: { base: '100dvw !important', md: undefined },
            transform: {
              base: 'translate3d(0px, 0px, 0px) !important',
              md: undefined
            }
          }}
        >
          {childrenClone}
        </MenuList>
      </Portal>
    </Menu>
  )
}

type LayoutProps = {
  children: React.ReactNode
  isActive?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ isActive, children }) => (
  <>
    <Show above="md">
      <DesktopLayout>{children}</DesktopLayout>
    </Show>

    <Hide above="md">
      <MobileLayout isActive={isActive as boolean}>{children}</MobileLayout>
    </Hide>
  </>
)
