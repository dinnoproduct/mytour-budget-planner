import { ComponentType } from 'react'
import { MenuProps } from '@chakra-ui/react'

export type SearchTravelersProps = {
	defaultData?: SearchTravelersData,
	onChange?: (data: SearchTravelersData) => void
	CustomButton?: ComponentType<SearchTravelersCustomButtonProps>
	menuProps?: Omit<MenuProps, 'children'>
	portalZIndex?: number
}

export type SearchTravelersCustomButtonProps = {
	onClick: () => void,
} & SearchInputProps

export type SearchTravelersData = {
	childrenCount: number
	adultsCount: number
	childrenAges: number[]
}

export type SearchInputProps = {
	travelersCount: number,
	roomsCount?: number,
	isFocused?: boolean
}

export interface ChildAge {
	age: number | null;
	isRequiredError: boolean;
}