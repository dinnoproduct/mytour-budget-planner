
import { type SectionLayoutProps } from '@widgets/PackageDetails/ui/types.ts'
import { Box, Text, TextProps } from '@chakra-ui/react'

export const CardSectionLayout = ({
  children,
  title,
  beforeTitle,
  ...props
}: SectionLayoutProps) => (
    <Box {...props}
        border="1px solid"
        borderColor={'gray.100'}
        bgColor={'white'}
        borderRadius="2xl"
        p={props.padding || 4}>
        {beforeTitle}
        {title && <SectionHeading mb="4">{title}</SectionHeading>}
        {children}
    </Box>
)

const SectionHeading = (props: TextProps) => (
    <Text size={{ base: 'md', md: 'lg' }} fontWeight="bold" {...props} as="h2" />
)