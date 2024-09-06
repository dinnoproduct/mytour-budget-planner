import { LayoutProps } from './types'
import { Box, Container, Grid } from '@chakra-ui/react'
import { PackageCardSkeleton, PackageEntity, usePackagesSearchContext } from '@entities/package'
import { PackageCard } from '@features/PackageCard'

export const PackageList = () => {
	const { filteredPackages, isLoadingFilteredPackages, searchData } = usePackagesSearchContext()
	const generateLink = (tourPackage: PackageEntity) => {
		const queryParams = new URLSearchParams({
			city: tourPackage.city.id.toString(),
			adultsCount: tourPackage.adultTravelers.toString(),
			childrenCount: tourPackage.childrenTravelers.toString(),
			childrenAges: searchData.travelersData.childrenAges.join(','),
			departureFlightId: tourPackage.destinationFlight.id.toString(),
			returnFlightId: tourPackage.returnFlight.id.toString(),
			hotelId: tourPackage.hotel.id.toString(),
			roomId: tourPackage.roomType.toString()
		})

		return `/egypt/package?${queryParams.toString()}`
	}

	return (
		<Layout>
			{isLoadingFilteredPackages ? <SkeletonLoading/> : null}

			{!isLoadingFilteredPackages && filteredPackages?.map((packageEntity) => (
				<PackageCard
					tourPackage={packageEntity}
					key={packageEntity.offerId}
					link={generateLink(packageEntity)}
				/>
			))}
		</Layout>
	)
}

const SkeletonLoading = ({ carsCount = 8 }) => {
	return (
		Array(carsCount).fill(1).map((_data, index) =>
			<PackageCardSkeleton key={`package-card-skeleton-${1}`}/>
		)
	)
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<Box py={{ base: 6, md: 10 }}>
			<Container
				px={{ base: 4, md: 6, lg: 8 }}
				maxWidth="1440px"
			>
				<Grid
					templateColumns={{
						base: '1fr',
						md: 'repeat(4, minmax(0, 1fr))'
					}}
					columnGap={{ base: 4, lg: 6 }}
					rowGap="4"
					justifyItems={{ base: 'center', md: 'stretch' }}
				>
					{children}
				</Grid>
			</Container>
		</Box>
	)
}
