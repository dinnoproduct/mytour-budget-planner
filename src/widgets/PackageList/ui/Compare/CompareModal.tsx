import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_PREFIX, type LanguageName } from '@shared/model'
import { GroupTourTagBadge } from '@shared/ui/components/Badge'
import { CompareAddMoreCard } from './CompareModal/CompareAddMoreCard'
import { ComparePackageCard } from './CompareModal/ComparePackageCard'
import { getCompareFilterGroups, getCompareSummary } from './CompareModal/helpers'
import { type CompareModalProps } from './CompareModal/types'

export const CompareModal = ({
  isOpen,
  onClose,
  packages,
  cities,
  selectedCityIds,
  maxCompareItems,
  itemTypeLabel,
  onRemove,
  getLink
}: CompareModalProps) => {
  const { i18n, t } = useTranslation()

  const languageSuffix = useMemo(
    () => LANGUAGE_PREFIX[i18n.language as LanguageName],
    [i18n.language]
  )
  const compareFilterGroups = useMemo(
    () => getCompareFilterGroups(cities, selectedCityIds, i18n.language),
    [cities, selectedCityIds, i18n.language]
  )
  const compareSummary = useMemo(
    () => getCompareSummary(packages[0], t),
    [packages, t]
  )
  const modalMaxWidth = useMemo(
    () => (packages.length >= 2 && packages.length < 4 ? '70%' : '80%'),
    [packages.length]
  )

  const remainingSlots = Math.max(maxCompareItems - packages.length, 0)
  const shouldShowAddMoreCard = remainingSlots > 0
  const gridColumnCount = packages.length + (shouldShowAddMoreCard ? 1 : 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        mx="4"
        my={{ base: '8', md: '12' }}
        rounded="2xl"
        overflow="hidden"
        boxShadow="0 24px 64px rgba(15, 23, 42, 0.18)"
        maxW={modalMaxWidth}
      >
        <ModalHeader py="4" px="5" borderBottom="1px solid" borderColor="gray.100">
          <Text size="2xl" fontWeight="600" color="gray.800">
            {t('compare')}
          </Text>
          <Flex>
            <GroupTourTagBadge>{compareSummary}</GroupTourTagBadge>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          top="4"
          right="4"
          color="blue.500"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
        />
        <ModalBody p="0">
          <SimpleGrid
            columns={{ base: 1, md: gridColumnCount > 1 ? gridColumnCount : 1 }}
            width="100%"
          >
            {packages.map(pack => {
              const cityLabel = pack.city[
                `name${languageSuffix}` as keyof typeof pack.city
              ] as string

              return (
                <ComparePackageCard
                  key={`${pack.offerId}-${pack.hotel.id}`}
                  pack={pack}
                  cityLabel={cityLabel}
                  compareFilterGroups={compareFilterGroups}
                  onRemove={onRemove}
                  getLink={getLink}
                  t={t}
                />
              )
            })}
            {shouldShowAddMoreCard ? (
              <CompareAddMoreCard
                remainingSlots={remainingSlots}
                itemTypeLabel={itemTypeLabel}
                onClick={onClose}
                t={t}
              />
            ) : null}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

