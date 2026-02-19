import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs
} from '@chakra-ui/react'
import { type TabsProps } from './types'

export const Tabs = ({ labels, children, showTabs = true, align, ...props }: TabsProps) => (
  <ChakraTabs {...props}>
    {showTabs &&
    <TabList 
      gap={2} 
      sx={{
        justifyContent: {base: 'flex-start', md: align || 'center'}, 
        overflowX: {base: 'scroll', md: 'visible'},
        margin: 0,
        padding: {base: '2px 16px', md: '0'},
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {labels.map((label, index) => (
        <Tab key={`${label}-${index}`}>{label}</Tab>
      ))}
    </TabList>
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
