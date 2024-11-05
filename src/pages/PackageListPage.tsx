import { Box } from '@chakra-ui/react'
import { Header } from '@widgets/Header'
import { PackageSearch } from '@widgets/PackageSearch'
import { PackageList } from '@widgets/PackageList'

export const PackageListPage = () => (
  <Box overflowX="hidden">
    <Header />
    <PackageSearch variant="fixed" />
    <PackageList />
  </Box>
)
