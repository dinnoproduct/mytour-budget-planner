import { Flex, Text } from '@chakra-ui/react'

type CardDatesProps = {
  monthName: string
  dayRange: string
  isActive: boolean
  onClick: () => void
}

export const CardDates = ({ monthName, dayRange, isActive, onClick }: CardDatesProps) => (
  <Flex
    direction="column"
    gap={.5}
    flexShrink={0}
    onClick={onClick}
    rounded={'lg'}
    sx={{
      cursor: 'pointer',
      _hover: { bgColor: isActive ? 'blue.600' : 'gray.100' },
      padding: '8px 0',
      width: '100px',
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
      {monthName}
    </Text>
    <Text fontSize="12px" color={isActive ? 'gray.200' : 'gray.500'} fontWeight={'semibold'} sx={{
        transition: 'all 0.2s ease-in-out',
    }}>
      {dayRange}
    </Text>
  </Flex>
)
