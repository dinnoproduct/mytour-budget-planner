import { TextProps } from '@foundation/Typography/types.ts'
import { Text } from '@ui'
import { SectionLayoutProps, SectionListProps } from '@widgets/PackageDetails/ui/types.ts'
import { Box, UnorderedList, ListItem, HStack } from '@chakra-ui/react'

export const SectionLayout = ({ children, title, subtitle, listItems, ...props }: SectionLayoutProps) => {
	return (
		<Box  {...props} px={{base: '4', md: '0'}}>
			{title && <SectionHeading>{title}</SectionHeading>}
			{subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}

			<Box mt={4}>
				{children}

				{listItems?.length ? (
					<SectionList listItems={listItems} mt={4}/>
				) : null}
			</Box>
		</Box>
	)
}

const SectionHeading = (props: TextProps) => {
	return (
		<Text
			size={{ base: 'md', md: 'lg' }}
			fontWeight="bold"
			{...props}
		/>
	)
}

const SectionSubtitle = (props: TextProps) => {
	return (
		<Text
			size="sm"
			fontWeight="semibold"
			{...props}
		/>
	)
}

const SectionList = ({ listItems, ...props }: SectionListProps) => {
	return (
		<UnorderedList
			{...props}
			listStyleType="none"
			mx="0"
			width="full"
			spacing="4"
		>
			{listItems.map(({ key, value }) => (
				<ListItem
					key={key as any}
					as={HStack}
					spacing="2"
					width="full"
				>
					<Text
						fontWeight="normal"
						size="sm"
						flexShrink={0}
					>{key}</Text>

					<Box
						backgroundImage="/assets/images/border.svg"
						height="2px"
						width="full"
						backgroundRepeat="repeat-x"
						borderRadius="full"
						mt="0.5"
					/>


					<Text
						fontWeight="semibold"
						size="sm"
						flexShrink={0}
					>{value}</Text>
				</ListItem>
			))}
		</UnorderedList>
	)
}