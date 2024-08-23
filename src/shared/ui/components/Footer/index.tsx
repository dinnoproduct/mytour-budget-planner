import { Box, Flex, HStack, ListItem, UnorderedList, Link } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { SOCIALS } from './data'
import { Icon, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
	return (
		<Layout>
			<Flex direction={{ base: 'column', md: 'row' }}>
				<Contact/>
				<AboutUs/>
			</Flex>
			<CopyRight/>
		</Layout>
	)
}

const Contact = () => {
	const {t} = useTranslation()

	return (
		<Flex
			direction="column"
			maxWidth="400px"
			width="full"
			flexShrink={0}
		>
			<HStack spacing="4" mb="4">
				{SOCIALS.map((social) => (
					<Link key={social.icon} href={social.link} isExternal>
						<Icon name={social.icon} size="32"/>
					</Link>
				))}
			</HStack>

			<ItemsList
				items={['info@mytour.am', '+374 93 24 07 32', t`officeAddress`]}
			/>
		</Flex>
	)
}
const AboutUs = () => {
	const {t} = useTranslation()

	return (
		<Box
			mt={{ base: 10, md: 0 }}
			ml={{ md: '60px' }}
			flexShrink={0}
		>
			<ItemsList
				items={[t`aboutUs`, t`termsAndConditions`]}
			/>
		</Box>
	)
}

const CopyRight = () => {
	return (
		<Box mt={{ base: 10, md: 0 }}>
			<ItemsList
				items={['© 2024 MyTour']}
			/>
		</Box>
	)
}

const ItemsList = ({ items }: {items: string[]}) => {
	return (
		<UnorderedList listStyleType="none" spacing="2" mx="0">
			{items.map((item) => (
				<ListItem key={item}>
					<Text size="md" color="white">
						{item}
					</Text>
				</ListItem>
			))}
		</UnorderedList>
	)
}


const Layout = ({ children }: {children: ReactNode | ReactNode[]}) => {
	return (
		<Box as="footer" bgColor="gray.700">
			<Flex
				px={{ base: 4, md: 6 }}
				py="10"
				direction={{ base: 'column', lg: 'row' }}
				justify={{ lg: 'space-between' }}
				width="full"
			>
				{children}
			</Flex>
		</Box>
	)
}