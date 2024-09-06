import { Box, Flex, Grid } from '@chakra-ui/react'
import { Skeleton, Text } from '@ui'
import { PackageCard } from '@features/PackageCard'
import React, { useMemo } from 'react'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'
import { PackageEntity, usePackagesSearchContext } from '@entities/package'

export const OffersSection = ({ packages, isLoading, onMoreClick }: any) => {
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

				<Text
					size="lg"
					color="blue.500"
					mr={{ base: 0, md: 2 }}
					cursor="pointer"
					onClick={onMoreClick}
				>
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

	const generateLink = (tourPackage: PackageEntity) => {
		const queryParams = new URLSearchParams({
			city: tourPackage.city.id.toString(),
			adultsCount: tourPackage.adultTravelers.toString(),
			childrenCount: tourPackage.childrenTravelers.toString(),
			childrenAges: [].join(','),
			departureFlightId: tourPackage.destinationFlight.id.toString(),
			returnFlightId: tourPackage.returnFlight.id.toString(),
			hotelId: tourPackage.hotel.id.toString(),
			roomId: tourPackage.roomType.toString()
		})

		return `/egypt/package?${queryParams.toString()}`
	}

	return (
		<>
			<Box
				display={{ base: 'block', md: 'none' }}
			>
				<Slider {...settings}>
					{packages.map((tourPackage: any) => (
						<Box
							key={tourPackage.id}
							maxWidth="342px"
							pr="4"
						>
							<PackageCard
								tourPackage={tourPackage}
								link={generateLink(tourPackage)}
								maxWidth="326px"
							/>
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
					<PackageCard
						tourPackage={tourPackage}
						key={tourPackage.id}
						link={generateLink(tourPackage)}
						maxWidth="326px"
					/>
				))}
			</Grid>
		</>
	)
}
