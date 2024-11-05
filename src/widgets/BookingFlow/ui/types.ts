export type BookingFlowProps = {
  currentOfferPackage: any
  initialView: 'travelers' | 'payment'
  isOpen?: boolean
  onClose?: () => void
  childrenAges?: number[]
}
