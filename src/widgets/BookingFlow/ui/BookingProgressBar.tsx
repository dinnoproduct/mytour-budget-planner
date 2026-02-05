import { Progress } from '@ui'

const STEP_COUNT = 4
const STEP_PERCENT = 25

export const BookingProgressBar = ({ step }: { step: number }) => {
  const value = Math.min(Math.max(step, 1), STEP_COUNT) * STEP_PERCENT

  return (
    <Progress
      value={value}
      size="sm"
      colorScheme="blue"
      borderRadius="full"
      max={100}
    />
  )
}
