import { type PackageEntity } from '@/entities/package/model'
import { type FilterParams, type FilterOptions } from '../model'
import { useMemo, useState } from 'react'

export const useFilterPackage = (packages: PackageEntity[]) => {
  const [filterParams, setFilterParams] = useState<FilterParams>({
    priceRange: { minValue: 0, maxValue: 0 },
    packageSelectHotel: [],
    hotelRatingSelect: []
  })

  const [isFilterActive, setIsFilterActive] = useState(false)

  const filterOptions: FilterOptions = useMemo(() => {
    if (!packages.length) {
      return {
        price: { minValue: 0, maxValue: 0 },
        name: [],
        stars: []
      }
    }

    const names = packages.map(pkg => pkg.hotel.name)
    const prices = packages.map(pkg => pkg.price)
    const stars = Array.from(new Set(packages.map(pkg => pkg.hotel.stars)))

    return {
      name: names,
      price: {
        minValue: Math.min(...prices),
        maxValue: Math.max(...prices)
      },
      stars
    }
  }, [packages])

  const filteredPackages = useMemo(
    () =>
      packages.filter(pack => {
        const matchesHotel =
          filterParams.packageSelectHotel.length === 0 ||
          filterParams.packageSelectHotel.includes(pack.hotel.name)

        const matchesStars =
          filterParams.hotelRatingSelect.length === 0 ||
          filterParams.hotelRatingSelect.includes(pack.hotel.stars)

        const matchesPrice =
          (filterParams.priceRange.minValue === 0 &&
            filterParams.priceRange.maxValue === 0) ||
          (pack.price >= filterParams.priceRange.minValue &&
            pack.price <= filterParams.priceRange.maxValue)

        return matchesHotel && matchesPrice && matchesStars
      }),
    [packages, filterParams]
  )

  const checkIfFiltersAreEmpty = (params: FilterParams): boolean =>
    params.packageSelectHotel.length === 0 &&
    params.hotelRatingSelect.length === 0 &&
    params.priceRange.minValue === 0 &&
    params.priceRange.maxValue === 0

  const onFilter = (filterParams: FilterParams) => {
    setFilterParams(filterParams)

    const areFiltersEmpty = checkIfFiltersAreEmpty(filterParams)

    setIsFilterActive(!areFiltersEmpty)
  }

  return { filterOptions, filteredPackages, isFilterActive, onFilter }
}
