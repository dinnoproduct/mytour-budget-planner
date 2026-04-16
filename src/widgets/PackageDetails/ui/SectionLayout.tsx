import { type TextProps } from '@foundation/Typography/types'
import { Text } from '@ui'
import {
  type SectionLayoutProps,
  type SectionListProps
} from '@widgets/PackageDetails/ui/types'
import { Box, UnorderedList, ListItem, HStack } from '@chakra-ui/react'

export const SectionLayout = ({
  children,
  title,
  subtitle,
  listItems,
  ...props
}: SectionLayoutProps) => (
  <Box {...props} px={0}>
    {title && <SectionHeading>{title}</SectionHeading>}
    {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}

    <Box mt={4}>
      {children}

      {listItems?.length ? <SectionList listItems={listItems} mt={4} /> : null}
    </Box>
  </Box>
)

const SectionHeading = (props: TextProps) => (
  <Text size={{ base: 'md', md: 'lg' }} fontWeight="bold" {...props} as="h2" />
)

const SectionSubtitle = (props: TextProps) => (
  <Text size="sm" fontWeight="semibold" {...props} as="h3" />
)

const SectionList = ({ listItems, ...props }: SectionListProps) => (
  <UnorderedList
    {...props}
    listStyleType="none"
    mx="0"
    width="full"
    spacing="4"
  >
    {listItems.map(({ key, value }) => (
      <ListItem key={key as any} as={HStack} spacing="2" width="full">
        <Text fontWeight="normal" size="sm" flexShrink={0}>
          {key}
        </Text>

        <Box
          backgroundImage="/assets/images/border.svg"
          height="2px"
          width="full"
          backgroundRepeat="repeat-x"
          borderRadius="full"
          mt="0.5"
        />

        <Text fontWeight="semibold" size="sm" flexShrink={0}>
          {value}
        </Text>
      </ListItem>
    ))}
  </UnorderedList>
)
