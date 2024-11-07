import { type Traveler } from '@widgets/TravelersModal/ui/types.ts'

export const validateTraveler = (traveler: Traveler) =>
  traveler.firstName?.length >= 2 &&
  traveler.lastName?.length >= 2 &&
  traveler.dateOfBirth
