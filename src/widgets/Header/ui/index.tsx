import { Box, Flex, HStack } from '@chakra-ui/react'
import { type LayoutProps } from './types'
import { Logo } from '@ui'
import { LanguageMenu } from './LanguageMenu'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from 'shared/model'
import { AccountMenu } from './AccountMenu'
import { LanguageLink } from '../../../components/LanguageLink/LanguageLink'
import { useLanguageRouting } from '../../../hooks/useLanguageRouting'

export const Header = () => {
  const { i18n, t } = useTranslation()
  const { changeLanguage, currentLanguage } = useLanguageRouting()

  const handleChangeLanguage = async (lang: LanguageName) => {
    await changeLanguage(lang)
  }

  return (
    <Layout>
      <LanguageLink to="/">
        <Logo />
      </LanguageLink>

      <HStack spacing="2">
        <LanguageMenu
          activeLanguage={currentLanguage as LanguageName}
          onChange={handleChangeLanguage}
        />

        <AccountMenu />
      </HStack>
    </Layout>
  )
}

const Layout = ({ children }: LayoutProps) => (
  <Box height="80px">
    <Box
      as="header"
      height="80px"
      position="fixed"
      bgColor="white"
      width="full"
      zIndex={11}
      maxWidth="100dvw"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Box px={{ base: '4', md: '6' }} height="full">
        <Flex width="full" height="full" align="center" justify="space-between">
          {children}
        </Flex>
      </Box>
    </Box>
  </Box>
)
