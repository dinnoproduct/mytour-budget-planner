import { Box, Text, TextProps } from '@chakra-ui/react'
import { type SectionLayoutProps } from '@widgets/PackageDetails/ui/types'

export const CardSectionLayout = ({
    children,
    title,
    beforeTitle,
    padding = 4,
    ...props
}: SectionLayoutProps) => (
    <Box {...props}
        border="1px solid"
        borderColor={'gray.100'}
        bgColor={'white'}
        borderRadius="2xl"
        p={padding}>
        {beforeTitle}
        {title && <SectionHeading mb="4" px={padding === 0 ? 4 : 0}>{title}</SectionHeading>}
        {children}
    </Box>
)

const SectionHeading = (props: TextProps) => (
    <Text size={{ base: 'md', md: 'lg' }} fontWeight="bold" {...props} as="h2" />
)