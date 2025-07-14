import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs
} from '@chakra-ui/react'
import { type TabsProps } from './types'

export const Tabs = ({ labels, children, showTabs = true, ...props }: TabsProps) => (
  <ChakraTabs {...props}>
    {showTabs &&
    <TabList>
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
