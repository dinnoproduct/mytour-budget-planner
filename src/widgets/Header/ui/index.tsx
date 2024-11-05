import { Box, Flex, Grid, HStack } from '@chakra-ui/react'
import { LayoutProps } from './types.ts'
import { Logo, Text } from '@ui'
import { LanguageMenu } from './LanguageMenu.tsx'
import { useTranslation } from 'react-i18next'
import { LanguageName } from 'shared/model'
import { AccountMenu } from './AccountMenu.tsx'
import { Link } from 'react-router-dom'


export const Header = () => {
	const { i18n, t } = useTranslation()

	const handleChangeLanguage = async (lang: LanguageName) => {
		await i18n.changeLanguage(lang)
	}

	return (
		<Layout>
			<Link to="/">
				<Logo height={{ base: '16px', md: '20px' }}/>
			</Link>

			<HStack spacing="2">
				<LanguageMenu
					activeLanguage={i18n.language as LanguageName}
					onChange={handleChangeLanguage}
				/>

				<AccountMenu/>
			</HStack>
		</Layout>
	)
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<Box height="80px">
			<Box
				as="header" height="80px" position="fixed" bgColor="white" width="full"
				zIndex={10}
				maxWidth="100dvw"
				borderBottom="1px solid" borderColor="gray.100"
			>
				<Box
					px={{ base: '4', md: '6' }}
					height="full"
				>
					<Flex width="full" height="full" align="center" justify="space-between">
						{children}
					</Flex>
				</Box>
			</Box>
		</Box>
	)
}
