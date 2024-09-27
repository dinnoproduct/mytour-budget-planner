import { Box, Flex } from '@chakra-ui/react'
import { Button, Text } from '@ui'
import { useTranslation } from 'react-i18next'
import { SearchTravelersCustomButtonProps } from '@features/SearchTravelers'

export const TravelersConfigButton = ({ travelersCount, onClick }: SearchTravelersCustomButtonProps) => {
	const { t } = useTranslation()

	return (
		<Box px="4">
			<Flex align="center" justify="space-between">
				<Text color="gray.600" size="sm" fontWeight="400">
					{t`travelers`}
				</Text>

				<Button
					size="sm"
					icon="edit"
					variant="text-blue"
					onClick={onClick}
				/>
			</Flex>

			<Text fontWeight="500" size="sm" mt="1">
				{`${travelersCount} ${t`traveler`}`}
			</Text>
		</Box>
	)
}
