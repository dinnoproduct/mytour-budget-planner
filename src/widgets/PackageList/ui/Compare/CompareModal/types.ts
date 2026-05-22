import { type PackageCity, type PackageEntity } from '@entities/package'

export type CompareModalProps = {
  isOpen: boolean
  onClose: () => void
  packages: PackageEntity[]
  cities: PackageCity[]
  selectedCityIds: number[]
  maxCompareItems: number
  itemTypeLabel: string
  onRemove: (pack: PackageEntity) => void
  getLink: (pack: PackageEntity) => string
}

export type CompareRow = {
  key: string
  label: string
  filterTitle: string
  filterId: number
  valueId: number
}

export type CompareFilterGroup = {
  id: number
  title: string
  rows: CompareRow[]
}

export type LocalizedName = {
  hy?: string
  en?: string
  ru?: string
  arm?: string
  eng?: string
  rus?: string
}
