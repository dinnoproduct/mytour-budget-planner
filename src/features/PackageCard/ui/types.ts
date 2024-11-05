import { PackageEntity, RequestEntity } from '@entities/package'
import { LinkProps } from '@chakra-ui/react'
import { EmptyObject } from 'react-hook-form'

export type PackageCardProps = {
	tourPackage: PackageEntity | EmptyObject
	link: string
} & LinkProps