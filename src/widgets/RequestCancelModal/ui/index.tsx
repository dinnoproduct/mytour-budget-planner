import { Layout } from './Layout.tsx'
import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from '@ui'
import { type RequestCancelModalProps } from '@widgets/RequestCancelModal/ui/types.ts'
import {
  useCancelRequest,
  useRequestCancellationMessage
} from '@entities/package'

export const RequestCancelModal = ({
  closeModal,
  requestId,
  onSuccess
}: RequestCancelModalProps) => {
  const { t } = useTranslation()
  const { data: cancellationMessage } = useRequestCancellationMessage(requestId)
  const { mutate: cancelRequest, isPending: isLoadingCancelRequest } =
    useCancelRequest({
      onSuccess: () => {
        onSuccess && onSuccess()
        closeModal()
      }
    })

  return (
    <Layout isOpen={true} closeModal={closeModal}>
      <Flex
        width="full"
        pt="10"
        pb="6"
        px="4"
        overflowY="scroll"
        height={{ base: 'calc(100dvh - 160px)', md: 'calc(320px - 160px)' }}
        direction="column"
        maxWidth="402px"
        mx="auto"
        align="center"
        sx={{
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}
      >
        <Text size="sm" align="center">
          {cancellationMessage}
        </Text>
      </Flex>

      <Box
        p="4"
        width="full"
        borderTop="1px solid"
        borderColor="gray.100"
        backgroundColor="white"
        mt="auto"
      >
        <Button
          variant="solid-red"
          type="submit"
          size="lg"
          width="full"
          onClick={() => cancelRequest(requestId)}
          isLoading={isLoadingCancelRequest}
        >
          {t`cancel`}
        </Button>
      </Box>
    </Layout>
  )
}
