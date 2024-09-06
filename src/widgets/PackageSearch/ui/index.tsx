import React from 'react'
import { Box, Flex, Stack } from '@chakra-ui/react'
import { PackageSearchForm } from './PackageSearchForm.tsx'
import { PackageSearchMenu } from './PackageSearchMenu.tsx'
import { LayoutProps, PackageSearchProps } from './types.ts'
import { packageSearchVariants } from './theme.ts'
import { useBreakpoint } from '@shared/hooks'

export const PackageSearch = ({
	                              containerProps,
	                              contentProps,
	                              variant = 'centered'
                              }: PackageSearchProps) => {
	const { isMd } = useBreakpoint()

	return (
		<Layout
			containerProps={containerProps}
			contentProps={contentProps}
			variant={variant}
		>
			{variant === 'fixed' && !isMd ? (
				<PackageSearchMenu/>
			) : (
				<PackageSearchForm/>
			)}
		</Layout>
	)
}

const Layout = ({ children, contentProps, containerProps, variant }: LayoutProps) => {
	return (
		<Box
			position="relative"
			width="full"
			zIndex="1"
			{...packageSearchVariants[variant].wrapper}
		>
			<Box
				bgSize="cover"
				bgPosition="center"
				bgRepeat="no-repeat"
				width="full"
				bgColor="white"
				{...containerProps}
				{...packageSearchVariants[variant].container}
			>
				<Flex
					align="center"
					maxWidth={{
						base: '400px',
						md: '1446px'
					}}
					mx="auto"
					width={{ base: 'max-content', md: 'max-content' }}
					height="full"
				>
					<Stack
						direction={{ base: 'column', md: 'row' }}
						spacing={{ base: 4, md: 2 }}
						zIndex="1"
						width="full"
						rounded="xl"
						align="center"
						justify="center"
						{...contentProps}
						{...packageSearchVariants[variant].content}
					>
						{children}
					</Stack>
				</Flex>
			</Box>
		</Box>
	)
}