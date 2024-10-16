import { Header } from '@widgets/Header'
import { Box, Link, HStack, Image, Flex } from '@chakra-ui/react'
import { Footer, Text } from '@ui'
import { PackageSearch } from '@widgets/PackageSearch'
import { HotOffersSection } from '@widgets/HotOffersSection'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useModalContext } from '@app/providers'
import { useLocation } from 'react-router-dom'


export const HomePage = () => {
	const { dispatchModal } = useModalContext()
	const location = useLocation()

	useEffect(() => {
		const scriptId = 'EmbedSocialHashtagScript'
		if (document.getElementById(scriptId)) {
			return
		}

		const script = document.createElement('script')
		script.id = scriptId
		script.src = 'https://embedsocial.com/cdn/ht.js'
		document.head.appendChild(script)
	}, [])

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		// console.log('queryParams', queryParams.get('success'))
		if (queryParams.get('success')?.toLowerCase() === 'true') {
			// console.log('open payment success modal')
			setTimeout(() => {
				dispatchModal({
					type: 'open',
					modalType: 'paymentSuccess'
				})
			}, 0)
		}
	}, [JSON.stringify(location.search), dispatchModal])


	return (
		<Box overflowX="hidden">
			<Header/>
			<PackageSearch variant="centered"/>
			<HotOffersSection mt={{ base: '62px', md: '84px' }}/>
			<AppSection/>

			<div className="embedsocial-hashtag" data-ref="f348cf39b90fa99e65cfce589513e45493bd6815"></div>

			<Footer/>
		</Box>
	)
}

const AppSection = () => {
	const { t } = useTranslation()

	return (
		<Box
			height={{ base: '400px', md: '380px' }}
			bgColor="gray.100"
			pt={{ base: 10, md: 0 }}
			pr={{ base: 4, md: '10' }}
			pl={{ base: 4, md: '10' }}
			mt={{ base: '60px', md: '20' }}
			mb={{ base: '80px', md: '180px' }}
		>
			<Flex
				direction={{ base: 'column-reverse', sm: 'row' }}
				maxHeight="full"
				height="full"
				justify={{ sm: 'center' }}
			>
				<Box
					mt={{ base: '6', sm: 0 }}
				>
					<Image
						src="/assets/images/app-phone.png"
						alt="MyTour"
						height={{ base: '292px', sm: '450px' }}
						maxWidth="full"
						mb={{ base: '-56px', sm: 0 }}
						transform={{
							sm: 'translateY(30px)'
						}}
					/>
				</Box>

				<Flex width={{ base: 'full', sm: '578px' }} direction="column" height="full" justify={{ md: 'center' }}>
					<Text
						size={{
							base: 'lg',
							sm: '3xl'
						}}
					>{t`myTourApp`}</Text>

					<HStack spacing="6" mt="6">
						<Link isExternal href="https://apps.apple.com/am/app/my-ameria/id1546373103">
							<Image src="/assets/images/app-store.svg" alt="App Store"/>
						</Link>

						<Link isExternal href="https://play.google.com/store/apps/details?id=com.banqr.ameriabank&hl=en">
							<Image src="/assets/images/google-play.svg" alt="Google Play"/>
						</Link>
					</HStack>
				</Flex>
			</Flex>
		</Box>
	)
}
