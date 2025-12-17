import { useEffect, useState } from 'react'
import { Flex, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Text } from '@ui'
import QRCode from 'qrcode'

export const AmeriaPayView = ({ paymentUrl }: { paymentUrl: string }) => {
  const { t } = useTranslation()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL(paymentUrl)
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Failed to generate QR code', error)
      }
    }

    generateQrCode()
  }, [paymentUrl])

  return (
    <Flex direction="column" justify="space-between" width="full" height="full">
      <Flex
        width="full"
        pb="6"
        pt="4"
        px="4"
        overflowY="scroll"
        maxHeight={{ base: 'calc(100dvh - 80px)', md: 'calc(464px - 80px)' }}
        direction="column"
        maxWidth="402px"
        mx="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}
        align="center"
      >
        {qrCodeUrl && (
          <Image src={qrCodeUrl} alt="QR Code" width="272px" height="272px" />
        )}

        <Text size="md" color="gray.600" align="center" mt="2">
          {t`scanQRText`}
        </Text>
      </Flex>
    </Flex>
  )
}
