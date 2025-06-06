import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  VStack,
  RadioGroup,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider
} from '@chakra-ui/react'
import { Button, Text, Radio } from '@ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type RoomsMenuHotelProps } from './types.ts'
import { useBreakpoint } from '@shared/hooks'
import { getRoomPriceString } from '../helpers'
import { type RoomWithSelectedMeal, type RoomItem } from '../model'

export const RoomsMenuHotel = ({
  defaultRoomId,
  defaultMealId,
  onChange,
  rooms,
  priceType = 'package'
}: RoomsMenuHotelProps) => {
  const { t } = useTranslation()
  const { isMd } = useBreakpoint()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<number>()
  const [confirmedMealId, setConfirmedMealId] = useState<number>()
  const [roomsWithMeals, setRoomsWithMeals] = useState<RoomWithSelectedMeal[]>(
    []
  )
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  useEffect(() => {
    setRoomsWithMeals((prevRooms: RoomWithSelectedMeal[]) =>
      rooms.map((room: RoomItem) => {
        let selectedMealId = room.meals[0].mealType

        if (room.id === defaultRoomId) {
          selectedMealId =
            defaultMealId >= 0 ? defaultMealId : room.meals[0].mealType
          setConfirmedMealId(defaultMealId)
        }

        return {
          ...room,
          selectedMealId
        }
      })
    )
  }, [rooms, defaultMealId, defaultRoomId])

  useEffect(() => {
    if (defaultRoomId && !selectedRoom) {
      const defaultRoom = roomsWithMeals.find(room => room.id === defaultRoomId)
      setCurrentIndex(
        roomsWithMeals.findIndex(room => room.id === defaultRoomId)
      )

      if (defaultRoom) {
        setSelectedRoom(defaultRoom.id)
      }
    }
  }, [defaultRoomId, roomsWithMeals])

  const handleRoomSelect = (roomId: number, mealId: number) => {
    setSelectedRoom(roomId)
    onChange && onChange(roomId, mealId)
    setDropdownOpen(false)
  }

  const handleMealTypeSelect = (roomId: number, mealId: number) => {
    setRoomsWithMeals(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, selectedMealId: mealId } : room
      )
    )
  }

  const handleMealTypeConfirm = (roomId: number) => {
    const room = roomsWithMeals.find(r => r.id === roomId)

    if (room?.selectedMealId) {
      setConfirmedMealId(room.selectedMealId)
      handleRoomSelect(roomId, room.selectedMealId)
    }
  }

  const roomValue = useMemo(
    () => roomsWithMeals.find(room => room.id === selectedRoom),
    [selectedRoom, roomsWithMeals]
  )

  const confirmedMeal = useMemo(
    () => roomValue?.meals.find(meal => meal.mealType === confirmedMealId),
    [roomValue, confirmedMealId]
  )

  return (
    <Menu
      isOpen={isDropdownOpen}
      onClose={() => setDropdownOpen(false)}
      offset={[12, -56]}
    >
      <MenuButton
        as={Box}
        sx={{
          span: {
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
            {roomValue?.name}
          </Text>

          <Text fontWeight="500" size="sm" mt="1.5">
            {confirmedMeal?.mealName}
          </Text>
        </Box>
      </MenuButton>
      <Portal>
        <MenuList
          p={0}
          minWidth="fit-content"
          borderRadius={{ base: '0', md: 'xl' }}
          width={{ base: 'full', md: '400px' }}
          maxWidth={{ base: 'full', md: '400px' }}
          maxHeight={{ base: 'calc(100dvh - 80px)', md: '566px' }}
          height="full"
          boxShadow="md"
          overflowY="auto"
          pt="0"
          pb="0"
          rootProps={
            !isMd
              ? {
                  position: { base: 'fixed !important' as any, md: undefined },
                  top: { base: '80px !important', md: undefined },
                  left: { base: '0 !important', md: undefined },
                  right: { base: '0 !important', md: undefined },
                  bottom: { base: '0 !important', md: undefined },
                  height: {
                    base: 'calc(100dvh - 80px) !important',
                    md: undefined
                  },
                  zIndex: { base: '100000 !important', md: undefined },
                  overflowY: { base: 'auto' },
                  width: { base: '100dvw !important', md: undefined },
                  transform: {
                    base: 'translate3d(0px, 0px, 0px) !important',
                    md: undefined
                  },
                  minWidth: {
                    base: 'auto !important' as any,
                    md: 'max-content'
                  }
                }
              : {}
          }
        >
          <Box
            width={{ base: 'full', md: '400px' }}
            maxWidth={{ base: 'full', md: '400px' }}
          >
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

            <VStack
              width="full"
              spacing="0"
              align="stretch"
              pt={{ base: 4, md: 0 }}
            >
              <Accordion
                allowMultiple={false}
                index={currentIndex}
                onChange={index => {
                  if (typeof index === 'number') {
                    setCurrentIndex(index)
                    const room = roomsWithMeals[index]

                    if (room && !room.selectedMealId) {
                      const firstMeal = room.meals[0]

                      if (firstMeal) {
                        handleMealTypeSelect(room.id, firstMeal.mealType)
                      }
                    }
                  }
                }}
                width="full"
              >
                {roomsWithMeals?.map((room, index) => (
                  <AccordionItem
                    key={room.id}
                    border="none"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _last={{ borderBottom: 'none' }}
                    py="4"
                  >
                    <AccordionButton
                      px="4"
                      py="0"
                      _hover={{
                        bgColor: 'transparent'
                      }}
                      _expanded={{
                        bgColor: 'transparent'
                      }}
                    >
                      <Flex direction="column" width="full" align="start">
                        <Flex
                          justify="space-between"
                          width="full"
                          align="center"
                        >
                          <Text
                            size="md"
                            color="gray.900"
                            align="left"
                            noOfLines={currentIndex === index ? 2 : 1}
                          >
                            {room.name}
                          </Text>
                          <AccordionIcon color="black" />
                        </Flex>

                        <Flex
                          justify="space-between"
                          width="full"
                          mt="3"
                          align="center"
                        >
                          <Text size="xs" color="gray.500">
                            {t(`${priceType}Price`)}
                          </Text>

                          <Flex
                            align="center"
                            bgColor="gray.100"
                            px="3"
                            height="28px"
                            rounded="full"
                          >
                            <Text
                              size="sm"
                              color={
                                currentIndex === index ? 'blue.500' : 'gray.800'
                              }
                              fontWeight="semibold"
                            >
                              {getRoomPriceString(room)}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </AccordionButton>

                    <AccordionPanel px="4" py="0">
                      <Divider borderColor="gray.200" my="4" />

                      <RadioGroup
                        value={room.selectedMealId?.toString() || ''}
                        onChange={value =>
                          handleMealTypeSelect(room.id, parseInt(value))
                        }
                      >
                        <Stack spacing="3">
                          {room.meals?.map(meal => (
                            <Flex
                              key={meal.offerId}
                              justify="space-between"
                              align="center"
                            >
                              <Text size="sm" color="gray.500" align="start">
                                {meal.mealName}
                              </Text>
                              <Radio
                                value={meal.mealType.toString()}
                                size="lg"
                              />
                            </Flex>
                          ))}
                        </Stack>
                      </RadioGroup>

                      <Button
                        width="full"
                        mt="4"
                        size="lg"
                        variant="outline-blue"
                        onClick={() => handleMealTypeConfirm(room.id)}
                        isDisabled={!room.selectedMealId}
                      >
                        {t`select`}
                      </Button>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </VStack>
          </Box>
        </MenuList>
      </Portal>
    </Menu>
  )
}
