import { Box, Flex, Grid } from '@chakra-ui/react'
import { Skeleton, Text } from '@ui'
import { Link as ReactLink } from 'react-router-dom'
import { PackageCard } from '../../../features/PackageCard'
import React from 'react'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

export const OffersSection = ({ packages, isLoading }: any) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Flex align="center" width="full" justify="space-between">
				<Text size={{
					base: 'lg',
					md: '3xl'
				}} color="gray.800" fontWeight={{ base: 'normal', md: 'bold' }}>
					{t`bestOffer`}
				</Text>

				<Text size="lg" color="blue.500" as={ReactLink as any} mr={{base: 0, md: 2}}>
					{t`more`}
				</Text>
			</Flex>

			<Box mt={{ base: '26px', md: '10' }}>
				{!isLoading ?
					(<PackagesList packages={packages}/>)
					: <Skeleton height="320px" width="full"/>
				}
			</Box>
		</Box>
	)
}

const PackagesList = ({ packages }: any) => {
	const settings = {
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		variableWidth: true,
		arrows: false
	}

	return (
		<>
			<Box
				display={{ base: 'block', md: 'none' }}

			>
				<Slider {...settings}>
					{packages.map((tourPackage: any) => (
						<Box key={tourPackage.id} minWidth="342px">
							<PackageCard tourPackage={tourPackage}/>
						</Box>
					))}
				</Slider>
			</Box>

			<Grid
				templateColumns={`repeat(4, minmax(100px, 326px))`}
				columnGap={{ md: '4', lg: '6' }}
				display={{ base: 'none', md: 'grid' }}
			>
				{packages.map((tourPackage: any) => (
					<PackageCard tourPackage={tourPackage} key={tourPackage.id}/>
				))}
			</Grid>
		</>
	)
}
