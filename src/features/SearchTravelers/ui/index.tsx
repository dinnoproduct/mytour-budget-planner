import { Box, Flex, Menu, MenuButton, MenuList, Portal, useMediaQuery, VStack } from '@chakra-ui/react'
import { AlertCardMessage, Button, Icon, Input, Text } from '@ui'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChildAge, SearchTravelersProps } from './types.ts'
import { getPluralForm } from '@shared/helpers'
import { FormState } from '@components/Form'

const MAX_TRAVELERS = 6

export const SearchTravelers = ({ defaultData, onChange, CustomButton, menuProps = {} }: SearchTravelersProps) => {
	const { t } = useTranslation()

	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const [tempAdultsCount, setTempAdultsCount] = useState(1)
	const [tempChildrenCount, setTempChildrenCount] = useState(0)
	const [tempChildrenAges, setTempChildrenAges] = useState<ChildAge[]>([])
	const [adultsCount, setAdultsCount] = useState(2)
	const [childrenCount, setChildrenCount] = useState(0)
	const [childrenAges, setChildrenAges] = useState<number[]>([])

	useEffect(() => {
		if (defaultData) {
			if (defaultData.adultsCount !== undefined) setAdultsCount(defaultData.adultsCount)
			if (defaultData.childrenCount !== undefined) setChildrenCount(defaultData.childrenCount)
			if (defaultData.childrenAges !== undefined) setChildrenAges(defaultData.childrenAges)
		}
	}, [JSON.stringify(defaultData)])

	const handleConfirm = () => {
		let hasError = false
		const newChildrenAges = tempChildrenAges.slice(0, tempChildrenCount)


		newChildrenAges.forEach((child, index) => {
			if (!child.age) {
				setTempChildrenAges(prev => {
					const newAges = [...prev]
					newAges[index] = { age: null, isRequiredError: true }
					return newAges
				})
				hasError = true
			}
		})

		if (hasError) return

		setChildrenAges(newChildrenAges.map(item => item.age as number))
		setAdultsCount(tempAdultsCount)
		setChildrenCount(tempChildrenCount)
		setDropdownOpen(false)

		onChange && onChange({
			adultsCount: tempAdultsCount,
			childrenCount: tempChildrenCount,
			childrenAges: newChildrenAges.map(item => item.age as number)
		})
	}

	const handleAgeChange = (index: number, age: number) => {
		const newAges = [...tempChildrenAges]
		newAges[index] = { age, isRequiredError: false }
		setTempChildrenAges(newAges)
	}

	const handleChildrenCountChange = (count: number) => {
		setTempChildrenCount(count);
		setTempChildrenAges(prev => {
			const newAges = [...prev];
			if (count > prev.length) {
				// Add new elements if count is increased
				for (let i = prev.length; i < count; i++) {
					newAges.push({ age: null, isRequiredError: false });
				}
			} else {
				// Remove elements if count is decreased
				newAges.length = count;
			}
			return newAges;
		});
	};

	const totalTravelers = useMemo(
		() => adultsCount + childrenCount,
		[adultsCount, childrenCount]
	)

	const tempTotalTravelers = useMemo(
		() => tempAdultsCount + tempChildrenCount,
		[tempAdultsCount, tempChildrenCount]
	)

	const isMaxTravelersReached = useMemo(
		() => tempTotalTravelers >= MAX_TRAVELERS,
		[tempTotalTravelers]
	)

	const maxTempAdultsCount = useMemo(
		() => MAX_TRAVELERS - tempChildrenCount,
		[tempChildrenCount]
	)

	const maxTempChildrenCount = useMemo(
		() => MAX_TRAVELERS - tempAdultsCount,
		[tempAdultsCount]
	)

	const isMobile = useMediaQuery('(max-width: 1280px)')[0]

	useEffect(() => {
		if (isDropdownOpen) {
			if (isMobile) {
				document.body.style.overflow = 'hidden'
			}
		} else {
			// Re-enable body scroll when calendar is closed
			document.body.style.overflow = ''
		}
	}, [isMobile, isDropdownOpen])

	const handleMenuOpen = () => {
		setTempAdultsCount(adultsCount)
		setTempChildrenCount(childrenCount)
		setTempChildrenAges(childrenAges.map(age => ({ age, isRequiredError: false })))
		setDropdownOpen(!isDropdownOpen)
	}

	return (
		<Menu
			offset={[0, 4]}
			isOpen={isDropdownOpen}
			onClose={() => {
				setTempAdultsCount(adultsCount)
				setTempChildrenCount(childrenCount)
				setTempChildrenAges(childrenAges.map(age => ({ age, isRequiredError: false })))
				setDropdownOpen(false)
			}}
			{...menuProps}
		>
			{CustomButton ? (
				<MenuButton
					as={Box}
					sx={{
						'span': {
							pointerEvents: 'auto'
						}
					}}
				>
					<CustomButton
						travelersCount={totalTravelers}
						roomsCount={1}
						isFocused={isDropdownOpen}
						onClick={handleMenuOpen}
					/>
				</MenuButton>
			) : (
				<MenuButton
					as={Box}
					width={{
						base: 'full',
						md: '320px'
					}}
					onClick={handleMenuOpen}
					cursor="pointer"
				>
					<SearchInput
						travelersCount={totalTravelers}
						roomsCount={1}
						isFocused={isDropdownOpen}
					/>
				</MenuButton>
			)}

			<Portal>
				<MenuList
					p={0}
					minWidth="fit-content"
					borderRadius={{ base: '0', md: 'xl' }}
					width={{ base: 'full', md: '406px' }}
					height="full"
					rootProps={isMobile ? {
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
					<Box pt={{ base: 'none', md: 4 }} height="full">
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
							<Text size="md" fontWeight="semibold">{t`travelers`}</Text>

							<Button
								icon="close"
								aria-label="Close calendar"
								variant="solid-gray"
								size="sm"
								onClick={() => setDropdownOpen(false)}
							/>
						</Flex>

						<Box
							px="4"
							overflowY={{ base: 'scroll', md: 'unset' }}
							height={{ base: 'calc(100% - 138px)', md: 'auto' }}
							pb={{ base: 4, md: 0 }}
							pt={{ base: 4, md: 0 }}
						>
							<VStack
								width="full"
								spacing="4"
								align="stretch"
							>
								<PeopleCounter
									count={tempAdultsCount}
									onChange={setTempAdultsCount}
									label={t`adults`}
									subLabel={t`age14+`}
									minCount={1}
									maxCount={maxTempAdultsCount}
								/>

								<PeopleCounter
									count={tempChildrenCount}
									onChange={handleChildrenCountChange}
									label={t`children`}
									subLabel={t`age0-13`}
									minCount={0}
									maxCount={maxTempChildrenCount}
								/>

								{Array.from({ length: tempChildrenCount }).map((_, index) => (
									<ChildrenAgeSelect
										key={index}
										value={tempChildrenAges[index]?.age as number}
										onChange={(age) => handleAgeChange(index, age)}
										childrenIndex={index + 1}
										isRequiredError={tempChildrenAges[index]?.isRequiredError}
									/>
								))}
							</VStack>

							<AlertMessage show={isMaxTravelersReached}/>
						</Box>

						<Box
							p="4" borderTop="1px solid" borderColor="gray.100" mt="4"
							position={{ base: 'fixed', md: 'static' }}
							bottom={{ base: 0, md: undefined }}
							width="full"
						>
							<Button width="full" onClick={handleConfirm}>{t`confirm`}</Button>
						</Box>
					</Box>
				</MenuList>
			</Portal>
		</Menu>
	)
}

const ChildrenAgeSelect = ({ value, onChange, childrenIndex, isRequiredError }: {
	value: number | null,
	onChange: (age: number) => void,
	childrenIndex: number,
	isRequiredError: boolean
}) => {
	const { t } = useTranslation()
	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const [inputState, setInputState] = useState<FormState>('default')
	const [errorMessage, setErrorMessage] = useState('')

	const normalizedValue = useMemo(() => {
		if (value === 1) {
			return t`under2`
		}
		return value
	}, [value])

	useEffect(() => {
		if (isRequiredError) {
			setInputState('invalid')
			setErrorMessage(t`requiredField`)
		} else {
			setInputState('default')
			setErrorMessage('')
		}
	}, [isRequiredError])

	return (
		<Menu
			isOpen={isDropdownOpen} onClose={() => setDropdownOpen(false)}
			placement="bottom-end"
			offset={[0, 4]}
		>
			<MenuButton
				as={Box}
				width="full"
				onClick={() => setDropdownOpen(!isDropdownOpen)}
				cursor="pointer"
			>
				<Input
					type="text"
					value={normalizedValue as string}
					placeholder={t`ageAtReturn`}
					width="full"
					borderColor={isDropdownOpen ? 'blue.500' : undefined}
					rightIconName={isDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
					label={`${t`child`} ${childrenIndex}*`}
					helperText={errorMessage}
					state={inputState}
				/>
			</MenuButton>

			<MenuList
				p={0}
				minWidth="fit-content"
				width="128px"
				height="272px"
				overflowY="auto"
				py="4"
			>
				<Flex
					key={`children-age-under2`}
					width="full"
					align="center"
					bgColor="white"
					height="40px"
					px="4"
					_hover={{
						bgColor: 'gray.50'
					}}
					_active={{
						bgColor: 'gray.100'
					}}
					_focus={{
						bgColor: 'gray.100'
					}}
					_focusVisible={{
						bgColor: 'gray.100'
					}}
					fontSize="text-md"
					lineHeight="text-md"
					cursor="pointer"
					onClick={() => {
						onChange(1)
						setDropdownOpen(false)
					}}
				>
					<Text size="md">{t`under2`}</Text>
				</Flex>

				{Array.from({ length: 12 }, (_, i) => i + 2).map((age) => (
					<Flex
						key={age}
						width="full"
						align="center"
						bgColor="white"
						height="40px"
						px="4"
						_hover={{
							bgColor: 'gray.50'
						}}
						_active={{
							bgColor: 'gray.100'
						}}
						_focus={{
							bgColor: 'gray.100'
						}}
						_focusVisible={{
							bgColor: 'gray.100'
						}}
						fontSize="text-md"
						lineHeight="text-md"
						cursor="pointer"
						onClick={() => {
							onChange(age)
							setDropdownOpen(false)
						}}
					>
						<Text size="md">{age}</Text>
					</Flex>
				))}
			</MenuList>
		</Menu>
	)
}

const AlertMessage = ({ show = false }: {show?: boolean}) => {
	return (
		<AlertCardMessage
			show={show}
			mt="4"
			status="warning"
			message="Սենյակում ճանապարհորդողների թիվը չի կարող գերազանցել {MAX_TRAVELERS}-ը"
		/>
	)
}

const PeopleCounter = ({ count, onChange, label, subLabel, minCount, maxCount }: {
	count: number,
	onChange: (count: number) => void,
	label: string,
	subLabel: string,
	minCount: number,
	maxCount: number
}) => {
	return (
		<Flex justify="space-between">
			<Box>
				<Text size="sm" color="gray.800">{label}</Text>
				<Text size="sm" color="gray.500" mt="1">{subLabel}</Text>
			</Box>

			<Flex align="center" width="144px" justify="space-between">
				<Button
					size="md"
					icon="remove"
					variant="solid-gray"
					onClick={() => onChange(Math.max(count - 1, minCount))}
					isDisabled={count <= minCount}
				/>

				<Text color="gray.800" size="sm">{count}</Text>

				<Button
					size="md"
					icon="add"
					variant="solid-gray"
					onClick={() => onChange(Math.min(count + 1, maxCount))}
					isDisabled={count >= maxCount}
				/>
			</Flex>
		</Flex>
	)
}

const SearchInput = ({ travelersCount, isFocused, roomsCount }: {
	travelersCount: number,
	roomsCount: number,
	isFocused?: boolean
}) => {
	const { t } = useTranslation()

	return (
		<Input
			type="text"
			value={`${travelersCount} ${t(getPluralForm(travelersCount, 'travelers')).toLowerCase()}`}
			width="full"
			borderColor={isFocused ? 'blue.500' : undefined}
			leftIconName="people-alt"
		/>
	)
}