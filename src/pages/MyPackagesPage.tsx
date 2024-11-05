import { Header } from '@widgets/Header'
import { Footer } from '@ui'
import React from 'react'
import { Grid, type GridProps } from '@chakra-ui/react'
import { UserPackages } from '@widgets/UserPackages'

export const MyPackagesPage = () => (
  <Layout>
    <Header />
    <UserPackages />
    <Footer />
  </Layout>
)

const Layout = (props: GridProps) => (
  <Grid
    templateRows="80px 1fr auto"
    minHeight="100dvh"
    width="full"
    {...props}
  />
)
