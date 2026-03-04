import { VStack } from '@chakra-ui/react'
import { SectionTitle } from './SectionTitle'
import { TravelerStepper } from './TravelerStepper'

type TravelersSectionProps = {
  title: string
  adults: number
  children: number
  infants: number
  setAdults: (value: number) => void
  setChildren: (value: number) => void
  setInfants: (value: number) => void
  adultMin: number
  adultMax: number
  childMin: number
  childMax: number
  infantMax: number
  showChildSelector: boolean
  showInfantSelector: boolean
  isDouble: boolean
  adultsLabel: string
  childrenLabel: string
  infantsLabel: string
}

export const TravelersSection = ({
  title,
  adults,
  children,
  infants,
  setAdults,
  setChildren,
  setInfants,
  adultMin,
  adultMax,
  childMin,
  childMax,
  infantMax,
  showChildSelector,
  showInfantSelector,
  isDouble,
  adultsLabel,
  childrenLabel,
  infantsLabel,
}: TravelersSectionProps) => {
  return (
    <>
      <SectionTitle title={title} />
      <VStack align="stretch" mb={6}>
        <TravelerStepper
          value={adults}
          min={adultMin}
          max={adultMax}
          onChange={(n) => {
            const v = Math.max(adultMin, Math.min(adultMax, n))
            setAdults(v)
            if (isDouble) setChildren(2 - v)
          }}
          label={adultsLabel}
        />
        {showChildSelector && (
          <TravelerStepper
            value={children}
            min={childMin}
            max={childMax}
            onChange={(n) => {
              const v = Math.max(childMin, Math.min(childMax, n))
              setChildren(v)
              if (isDouble) setAdults(2 - v)
            }}
            label={childrenLabel}
          />
        )}
        {showInfantSelector && (
          <TravelerStepper
            value={infants}
            min={0}
            max={infantMax}
            onChange={(n) => setInfants(Math.max(0, Math.min(infantMax, n)))}
            label={infantsLabel}
          />
        )}
      </VStack>
    </>
  )
}

