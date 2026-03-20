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
  guestsMax: number
  isFixedDouble: boolean
  adultsLabel: string
  childrenLabel: string
  infantsLabel: string
  adultsAgeText?: string
  childrenAgeText?: string
  infantsAgeText?: string
  controlsDisabled?: boolean
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
  guestsMax,
  isFixedDouble,
  adultsLabel,
  childrenLabel,
  infantsLabel,
  adultsAgeText,
  childrenAgeText,
  infantsAgeText,
  controlsDisabled,
}: TravelersSectionProps) => {
  const total = adults + children
  const effectiveAdultMax = isFixedDouble
    ? adultMax
    : total >= guestsMax
      ? adults
      : adultMax
  const effectiveChildMax = isFixedDouble
    ? childMax
    : total >= guestsMax
      ? children
      : childMax

  return (
    <>
      <SectionTitle title={title} />
      <VStack align="stretch" mb={6}>
        <TravelerStepper
          value={adults}
          min={adultMin}
          max={effectiveAdultMax}
          isLocked={!!controlsDisabled}
          onChange={(n) => {
            const v = Math.max(adultMin, Math.min(effectiveAdultMax, n))
            if (isFixedDouble) {
              // keep total equal to guestsMax (typically 2): adjust children complementarily
              setAdults(v)
              setChildren(Math.max(0, guestsMax - v))
            } else {
              // prevent increasing when total would exceed guestsMax
              if (v > adults && adults + children >= guestsMax) {
                return
              }
              setAdults(v)
            }
          }}
          label={adultsLabel}
          description={adultsAgeText}
        />
        {showChildSelector && (
          <TravelerStepper
            value={children}
            min={childMin}
            max={effectiveChildMax}
            isLocked={!!controlsDisabled}
            onChange={(n) => {
              const v = Math.max(childMin, Math.min(effectiveChildMax, n))
              if (isFixedDouble) {
                setChildren(v)
                setAdults(Math.max(1, guestsMax - v))
              } else {
                if (v > children && adults + children >= guestsMax) {
                  return
                }
                setChildren(v)
              }
            }}
            label={childrenLabel}
            description={childrenAgeText}
          />
        )}
        {showInfantSelector && (
          <TravelerStepper
            value={infants}
            min={0}
            max={infantMax}
            onChange={(n) => setInfants(Math.max(0, Math.min(infantMax, n)))}
            label={infantsLabel}
            description={infantsAgeText}
          />
        )}
      </VStack>
    </>
  )
}

