import { Flex, Text } from '@chakra-ui/react'

type CardDatesProps = {
  flightMonth: string
  flightDay: string
  departureMonth: string
  departureDay: string
  isActive: boolean
  onClick: () => void
}

export const CardDates = ({ flightMonth, flightDay, departureMonth, departureDay, isActive, onClick }: CardDatesProps) => (
  <Flex
    direction="column"
    gap={.5}
    flexShrink={0}
    onClick={onClick}
    rounded={'lg'}
    flexWrap={"nowrap"}
    sx={{
      cursor: 'pointer',
      _hover: { bgColor: isActive ? 'blue.600' : 'gray.100' },
      padding: '20px 16px',
      textAlign: 'center',
      border: '1px solid',
      borderColor: isActive ? 'blue.500' : 'gray.300',
      bgColor: isActive ? 'blue.500' : 'white',
      transition: 'all 0.2s ease-in-out',
    }}
  >
      
    <Text fontSize="12px" color={isActive ? 'white' : 'gray.700'} fontWeight={'semibold'} sx={{
        transition: 'all 0.2s ease-in-out',
    }}>
      {flightMonth === departureMonth ? `${flightMonth} ${flightDay}-${departureDay}` : `${flightMonth} ${flightDay} - ${departureMonth} ${departureDay}`}
    </Text>
  </Flex>
)
