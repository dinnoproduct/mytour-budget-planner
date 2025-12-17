import { useRef } from 'react'
import { LayoutProps } from './types'
import {
	Box, Flex,
	Modal as ChakraModal,
	ModalBody,
	ModalContent, ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react'
import { Button, Text } from '@ui'


export const Layout = (
	{
		children,
		isOpen,
		closeModal,
		title
	}: LayoutProps) => {
	const modalContentRef = useRef<HTMLDivElement>(null)

	return (
		<ChakraModal
			isOpen={isOpen}
			onClose={closeModal}
			isCentered
			size="travelers"
			initialFocusRef={modalContentRef}
		>
			<ModalOverlay/>

			<ModalContent ref={modalContentRef}>
				<ModalHeader p="4" borderBottom="1px solid" borderColor="gray.100">
					<Flex width="full" justify="space-between" align="center">
						<Text size="lg" fontWeight="medium">{title}</Text>

						<Button
							variant="text-blue"
							size="lg"
							icon="close"
							onClick={closeModal}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody p="0" height="full">
					<Flex
						width="full"
						display="flex"
						flexDirection="column"
						alignItems="center"
						mx="auto"
						height="full"
					>
						{children}
					</Flex>
				</ModalBody>
			</ModalContent>
		</ChakraModal>
	)
}
