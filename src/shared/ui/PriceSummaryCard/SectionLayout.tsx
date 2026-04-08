import { type TextProps } from '@foundation/Typography/types.ts'
import { Text } from '@ui'
import {
  type SectionLayoutProps,
  type SectionListProps
} from '@widgets/PackageDetails/ui/types.ts'
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

    <Box>
      {children}

      {listItems?.length ? <SectionList listItems={listItems} /> : null}
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
      <ListItem
        key={key as any}
        as={HStack}
        spacing="2"
        width="full"
        minW={0}
        alignItems="center"
      >
        <Text
          fontWeight="normal"
          size="sm"
          flex="0 1 auto"
          minW={0}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          title={String(key)}
        >
          {key}
        </Text>

        <Box
          flex="1"
          minW="8px"
          flexShrink={1}
          backgroundImage="/assets/images/border.svg"
          height="2px"
          backgroundRepeat="repeat-x"
          backgroundPosition="center"
          borderRadius="full"
          alignSelf="center"
        />

        <Text fontWeight="semibold" size="sm" flexShrink={0}>
          {value}
        </Text>
      </ListItem>
    ))}
  </UnorderedList>
)
