export type CreateVisaRequestPayload = {
  startDate: string
  city: string
  country: string
  travelersCount: number
  platform: string
}

export type CreateVisaRequestResponse = {
  id: number
  leadId: number
  status: string
  platform: string
  city: string
  country: string
  startDate: string
  travelersCount: number
}
