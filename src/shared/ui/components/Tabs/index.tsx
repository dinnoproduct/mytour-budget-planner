import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs,
  Box
} from '@chakra-ui/react'
import { type TabsProps } from './types'

export const Tabs = ({ labels, children, showTabs = true, align, groupAlign = 'center', isDisabled = false, ...props }: TabsProps) => (
  <ChakraTabs {...props}>
    {showTabs &&
    <Box sx={{ width: '100%', display: 'flex', justifyContent: groupAlign, alignItems: 'center' }}>
    <TabList 
      gap="2"
      sx={{
        justifyContent: { base: 'start', md: align || 'center'}, 
        overflowX: {base: 'scroll', md: 'visible'},
        margin: 0,
        padding: {base: '2px 16px', md: '0'},
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {labels.map((label, index) => (
        <Tab key={`${label}-${index}`} isDisabled={isDisabled}>{label}</Tab>
      ))}
    </TabList>
    </Box>
    }

    <TabPanels>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <TabPanel key={`tab-panel-${index}`}>{child}</TabPanel>
        ))
      ) : (
        <TabPanel>{children}</TabPanel>
      )}
    </TabPanels>
  </ChakraTabs>
)

export { tabsComponentTheme } from './theme'
