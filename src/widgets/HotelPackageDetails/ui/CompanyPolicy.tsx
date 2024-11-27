import { Box, Collapse, Flex, Img, Link } from '@chakra-ui/react'
import { type PackageEntity } from '@entities/package'
import { useTranslation } from 'react-i18next'
import React, { useMemo, useState } from 'react'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { Text, Button } from '@ui'
import { useBreakpoint } from '@shared/hooks'
import { type CompanyPolicyViewProps } from '@widgets/PackageDetails/ui/types.ts'

export const CompanyPolicy = ({
  tourPackage
}: {
  tourPackage: PackageEntity
}) => {
  const { i18n, t } = useTranslation()
  const { isMd } = useBreakpoint()

  const bookingPolicy = useMemo(() => {
    const key =
      `bookingPolicy${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity

    return (tourPackage[key] as string) || ''
  }, [i18n.language, tourPackage?.bookingPolicyArm])

  const cancelationPolicy = useMemo(() => {
    const key =
      `cancelationPolicy${LANGUAGE_PREFIX[i18n.language as LanguageName]}` as keyof PackageEntity

    return (tourPackage[key] as string) || ''
  }, [i18n.language, tourPackage?.cancelationPolicyArm])

  const parsedPolicy = useMemo(() => {
    const parsedBookingPolicy = JSON.parse(bookingPolicy ? bookingPolicy : '{}')

    if (!parsedBookingPolicy?.policy) {
      return { before: '', after: '', urlText: '' }
    }

    const { policy } = parsedBookingPolicy
    const pattern = /%@(.*?)%@/
    const match = pattern.exec(policy as string)!

    const [before, urlText, after] = [
      policy.substring(0, match?.index),
      match?.[1], // The URL
      policy.substring(match?.index + match?.[0].length)
    ]

    return { before, urlText, after, url: parsedBookingPolicy.url }
  }, [bookingPolicy])

  return (
    <Box px={{ base: '4', md: '0' }}>
      <Flex justify="space-between" align="center" mb="4">
        <Text size="lg" fontWeight="bold" as="h2">{t`agency`}</Text>

        <Img
          src="/assets/images/sky-tour-logo.svg"
          alt="Sky Tour"
          ml="4"
          height="24px"
        />
      </Flex>

      {isMd ? (
        <DesktopView
          parsedPolicy={parsedPolicy}
          cancelationPolicy={cancelationPolicy}
        />
      ) : (
        <MobileView
          parsedPolicy={parsedPolicy}
          cancelationPolicy={cancelationPolicy}
        />
      )}
    </Box>
  )
}

const DesktopView = ({
  parsedPolicy,
  cancelationPolicy
}: CompanyPolicyViewProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Text size="sm" fontWeight="semibold" as="h3">
        {t`bookingAndPaymentTerms`}
      </Text>

      <Text size="sm" fontWeight="normal" mt="2">
        {parsedPolicy.before}{' '}
        <Link
          href={parsedPolicy.url}
          isExternal
          textDecoration="underline"
          color="blue.500"
        >
          {parsedPolicy.urlText}
        </Link>
        {parsedPolicy.after}
      </Text>

      <Text size="sm" fontWeight="semibold" mt="4">
        {t`cancellationPolicy`}
      </Text>

      <Text size="sm" fontWeight="normal" mt="2">
        {cancelationPolicy}
      </Text>
    </>
  )
}

const MobileView = ({
  parsedPolicy,
  cancelationPolicy
}: CompanyPolicyViewProps) => {
  const { t } = useTranslation()

  const [isBookingPolicyOpen, setBookingPolicyOpen] = useState(false)
  const [isCancelationPolicyOpen, setCancelationPolicyOpen] = useState(false)

  const toggleBookingPolicy = () => setBookingPolicyOpen(!isBookingPolicyOpen)
  const toggleCancelationPolicy = () =>
    setCancelationPolicyOpen(!isCancelationPolicyOpen)

  return (
    <>
      <Box mb="4">
        <Text size="sm" fontWeight="semibold" mb="2" as="h3">
          {t`bookingAndPaymentTerms`}
        </Text>

        <Collapse in={isBookingPolicyOpen} startingHeight={128} animateOpacity>
          <Text size="sm" fontWeight="normal">
            {parsedPolicy.before}{' '}
            <Link
              href={parsedPolicy.url}
              isExternal
              textDecoration="underline"
              color="blue.500"
            >
              {parsedPolicy.urlText}
            </Link>
            {parsedPolicy.after}
          </Text>
        </Collapse>

        <Flex width="full" justify="end">
          <Button
            onClick={toggleBookingPolicy}
            mt="2"
            size="sm"
            variant="text-blue"
          >
            {isBookingPolicyOpen ? t`close` : t`readMore`}
          </Button>
        </Flex>
      </Box>

      <Box>
        <Text
          size="sm"
          fontWeight="semibold"
          mb="2"
        >{t`cancellationPolicy`}</Text>

        <Collapse
          in={isCancelationPolicyOpen}
          startingHeight={128}
          animateOpacity
        >
          <Text size="sm" fontWeight="normal">
            {cancelationPolicy}
          </Text>
        </Collapse>

        <Flex width="full" justify="end">
          <Button
            onClick={toggleCancelationPolicy}
            mt="2"
            size="sm"
            variant="text-blue"
          >
            {isCancelationPolicyOpen ? t`close` : t`readMore`}
          </Button>
        </Flex>
      </Box>
    </>
  )
}
