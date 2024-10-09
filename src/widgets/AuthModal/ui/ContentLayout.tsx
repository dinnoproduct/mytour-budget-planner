import { Button } from '@ui'
import { Box, Flex, VStack } from '@chakra-ui/react'
import { ContentLayoutProps } from '@widgets/AuthModal/ui/types.ts'

export const ContentLayout = ({
	                              contentContainerProps,
	                              onSubmit,
	                              primaryButtonLabel,
	                              secondaryButtonLabel,
	                              onSecondaryButtonClick,
	                              children,
	                              isLoading
                              }: ContentLayoutProps) => {
	return (
		<Flex
			direction="column"
			justify="space-between"
			as="form"
			onSubmit={onSubmit}
			width="full"
			height="full"
		>
			<VStack
				spacing="6"
				py="6"
				px="4"
				mx="auto"
				overflowY="scroll"
				width="full"
				height={{ base: 'calc(100dvh - 160px)', md: 'calc(480px - 160px)' }}
				maxWidth="402px"
				{...contentContainerProps}
			>
				{children}
			</VStack>

			<Box p="4" width="full" borderTop="1px solid" borderColor="gray.100" backgroundColor="white" mt="auto">
				<Button variant="solid-blue" type="submit" size="lg" width="full" isLoading={isLoading}>
					{primaryButtonLabel}
				</Button>

				{secondaryButtonLabel ? (
					<Button
						onClick={onSecondaryButtonClick}
						variant="solid-gray"
						size="lg"
						width="full"
						mt="2"
					>
						{secondaryButtonLabel}
					</Button>
				) : null}
			</Box>
		</Flex>
	)
}
