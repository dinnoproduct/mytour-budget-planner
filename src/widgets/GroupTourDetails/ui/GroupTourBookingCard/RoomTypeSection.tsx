import { Flex, FormControl, Text } from '@chakra-ui/react'
import type { GroupTourRoomType } from '@entities/package'
import { getLocalized } from '../../lib/utils'
import { SectionTitle } from './SectionTitle'

type RoomTypeSectionProps = {
  roomTypes: GroupTourRoomType[]
  selectedRoomTypeId: number | ''
  onChangeRoomTypeId: (id: number | '') => void
  disabled: boolean
  label: string
  languageSuffix: string
}

export const RoomTypeSection = ({
  roomTypes,
  selectedRoomTypeId,
  onChangeRoomTypeId,
  disabled,
  label,
  languageSuffix,
}: RoomTypeSectionProps) => {
  if (!roomTypes.length) return null

  return (
    <FormControl>
      <SectionTitle title={label} />
      <Flex
        mt={2}
        flexWrap="nowrap"
        overflowX="auto"
        gap={2}
        sx={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {roomTypes.map((room) => {
          const isActive = room.id === selectedRoomTypeId
          const handleClick = () => {
            if (disabled) return
            onChangeRoomTypeId(room.id)
          }

          return (
            <Flex
              key={room.id}
              as="button"
              type="button"
              flexShrink={0}
              align="center"
              justify="center"
              px={4}
              py={2}
              borderRadius="full"
              bgColor={isActive ? 'blue.500' : 'blue.50'}
              _hover={{
                bgColor: isActive ? 'blue.600' : 'blue.100',
              }}
              transition="all 0.2s ease-in-out"
              onClick={handleClick}
            >
              <Text
                fontSize="12px"
                fontWeight="semibold"
                color={isActive ? 'white' : 'blue.500'}
                whiteSpace="nowrap"
              transition="all 0.2s ease-in-out"
              >
                {getLocalized(room.name, languageSuffix) || label}
              </Text>
            </Flex>
          )
        })}
      </Flex>
    </FormControl>
  )
}

