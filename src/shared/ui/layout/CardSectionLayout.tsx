
import { type SectionLayoutProps } from '@widgets/PackageDetails/ui/types'
import { Box } from '@chakra-ui/react'

export const CardSectionLayout = ({ children, ...props }: SectionLayoutProps) => (
    <Box {...props}
        border="1px solid"
        borderColor={'gray.100'}
        bgColor={'white'}
        borderRadius="lg"
        p={props.padding || 4}>
        {children}
    </Box>
)