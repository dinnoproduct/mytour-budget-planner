import { Box, Flex, HStack } from '@chakra-ui/react'
import { type LayoutProps } from './types.ts'
import { Logo } from '@ui'
import { LanguageMenu } from './LanguageMenu.tsx'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from 'shared/model'
import { AccountMenu } from './AccountMenu.tsx'
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
        <Logo width={{ base: '120px', md: '150px' }} />
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
      zIndex={10}
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
