import { Box, Flex, Menu, MenuButton, MenuList, Portal, VStack } from '@chakra-ui/react'
import { Button, Icon, Input, Text } from '@ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RoomsMenuProps } from './types.ts'
import { useBreakpoint } from '@shared/hooks'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'

export const RoomsMenu = ({ defaultRoom, onChange, rooms }: RoomsMenuProps) => {
	const { t } = useTranslation()
	const { isMd } = useBreakpoint()
	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const [selectedRoom, setSelectedRoom] = useState<number>()

	useEffect(() => {
		setSelectedRoom(defaultRoom)
	}, [defaultRoom])

	const handleRoomSelect = (roomValue: number) => {
		setSelectedRoom(roomValue)
		setDropdownOpen(false)
	}

	useEffect(() => {
		if (selectedRoom && onChange) {
			onChange && onChange(selectedRoom)
		}
	}, [selectedRoom])

	const roomValue = useMemo(() => {
		const room = rooms.find((room) => room.id === selectedRoom)
		return room ? room.name : ''
	}, [selectedRoom, rooms])

	return (
		<Menu
			isOpen={isDropdownOpen}
			onClose={() => setDropdownOpen(false)}
			offset={[12, -28]}
		>
			<MenuButton
				as={Box}
				sx={{
					'span': {
						pointerEvents: 'auto'
					}
				}}
			>
				<Box px="4">
					<Flex align="center" justify="space-between">
						<Text color="gray.600" size="sm" fontWeight="400">
							{t`roomType`}
						</Text>

						<Button
							size="sm"
							icon="edit"
							variant="text-blue"
							onClick={() => setDropdownOpen(true)}
						/>
					</Flex>

					<Text fontWeight="500" size="sm" mt="1">
						{roomValue}
					</Text>
				</Box>
			</MenuButton>
			<Portal>
				<MenuList
					p={0}
					minWidth="fit-content"
					borderRadius={{ base: '0', md: 'xl' }}
					width={{ base: 'full', md: '400px' }}
					height="full"
					boxShadow="md"
					overflow="hidden"
					pt={{base: 0, md: '4'}}
					pb="4"
					rootProps={!isMd ? {
						position: { base: 'fixed !important' as any, md: undefined },
						top: { base: '80px !important', md: undefined },
						left: { base: '0 !important', md: undefined },
						right: { base: '0 !important', md: undefined },
						bottom: { base: '0 !important', md: undefined },
						height: { base: 'calc(100dvh - 80px) !important', md: undefined },
						zIndex: { base: '100000 !important', md: undefined },
						overflowY: { base: 'auto !important' as any, md: undefined },
						width: { base: '100dvw !important', md: undefined },
						transform: { base: 'translate3d(0px, 0px, 0px) !important', md: undefined },
						minWidth: { base: 'auto !important' as any, md: 'max-content' }
					} : {}}
				>
					<Box>
						<Flex
							display={{ base: 'flex', md: 'none' }}
							justify="space-between"
							px="4"
							height="64px"
							align="center"
							width="full"
							borderBottom="1px solid"
							borderColor="gray.100"
						>
							<Text size="md" fontWeight="semibold">{t`roomType`}</Text>

							<Button
								icon="close"
								aria-label="Close calendar"
								variant="solid-gray"
								size="sm"
								onClick={() => setDropdownOpen(false)}
							/>
						</Flex>

						<VStack width="full" spacing="0" align="stretch" pt={{ base: 4, md: 0 }}>
							{rooms?.map((room) => (
								<Flex
									key={room.id}
									direction="column"
									width="full"
									align="start"
									bgColor="white"
									px="4"
									py="2"
									_hover={{
										bgColor: 'gray.50'
									}}
									_active={{
										bgColor: 'gray.100'
									}}
									_focus={{
										bgColor: 'white'
									}}
									_focusVisible={{
										bgColor: 'white'
									}}
									cursor="pointer"
									onClick={() => handleRoomSelect(room.id)}
								>
									<Flex justify="space-between" width="full">
										<Text size="md" color="gray.900">
											{room.name}
										</Text>

										{selectedRoom === room.id && (
											<Icon name="check" size="20" color="blue.500" ml="2"/>
										)}
									</Flex>

									<Text size="xs" color="gray.500" mt="1">
										{t`packagePrice`}` {numberWithCommaNormalizer(room.price)} ֏
									</Text>
								</Flex>
							))}
						</VStack>
					</Box>
				</MenuList>
			</Portal>
		</Menu>
	)
}
