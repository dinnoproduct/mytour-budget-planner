import { Box } from '@chakra-ui/react'
import { Footer } from '@ui'
import { BlogsList } from '@widgets/BlogsList'
import { Header } from '@widgets/Header'
import { BlogsSlider } from '@widgets/BlogsSlider'

export const BlogsPage = () => (
  <Box overflowX="hidden">
    <Header />
    <BlogsSlider />
    <BlogsList mt={{ sm: '-138px' }} />
    <Footer />
  </Box>
)
