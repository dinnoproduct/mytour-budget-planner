import { type PackageEntity } from '@entities/package'
import { type LinkProps } from '@chakra-ui/react'
import { type EmptyObject } from 'react-hook-form'
import { type Moment } from 'moment'

export type PackageCardBasicProps = {
  tourPackage: PackageEntity | EmptyObject
  link: string
} & LinkProps

export type PackageCardHorizontalProps = {
  nights: number
  isHotelPackage?: boolean
  showCompare?: boolean
  isCompareSelected?: boolean
  isCompareDisabled?: boolean
  onCompareToggle?: (isChecked: boolean) => void
} & PackageCardBasicProps

export type PackageCardHorizontalDetailProps = {
  tourPackage: PackageEntity | EmptyObject
  childrenTravelers: string
  isHotelPackage: boolean
  nights: number
  showCompare?: boolean
  isCompareSelected?: boolean
  isCompareDisabled?: boolean
  onCompareToggle?: (isChecked: boolean) => void
}

export type DateTagProps = {
  tourPackage: PackageEntity | EmptyObject
  nights: number
  fromDate: Moment
  toDate: Moment
}
