"use client"

import { PackageSearch } from '@widgets/PackageSearch'
// import { HotOffersSection } from '@widgets/HotOffersSection'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from '@shared/lib/router'
import { PackageBanner } from './PackageBanner'
// import { AppSection } from './AppSection'
// import { AboutUsBanner } from './AboutUsBanner'
// import { BlogsSection } from '@widgets/BlogsSection'
import { CityOffersSection } from "@widgets/CityOffersSection/ui"
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { StoriesSection } from '@widgets/StoriesSection'
import { GroupTourList } from '@widgets/GroupTourList'
import { useTranslation } from 'react-i18next'
import { SplashNotificationsManager } from '@entities/notification'
import { BudgetPlanner } from '@widgets/BudgetPlanner'

const TAB_NAMES = ['cyprus', 'hotels', 'packages', 'group-tours'] as const
const TAB_NAME_TO_INDEX: Record<string, number> = {
  cyprus: 0,
  hotel: 1,
  hotels: 1,
  package: 2,
  packages: 2,
  'group-tours': 3,
}
let isReloadCleanupDone = false

export const HomePage = () => {
  const { i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [tabIndex, setTabIndex] = useState(() => {
    const param = searchParams?.get('tab') ?? null
    return param ? (TAB_NAME_TO_INDEX[param] ?? 0) : 0
  })

  const isMounted = useRef(false)

  const handleTabChange = useCallback(
    (index: number) => {
      setTabIndex(index)
      if (!isMounted.current) {
        isMounted.current = true
        return
      }
      const name = TAB_NAMES[index] ?? 'cyprus'
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev)
          next.set('tab', name)
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams],
  )

  // When any tab is selected (e.g. via URL, reload, or back navigation),
  // scroll the horizontal tab list so the active tab is visible.
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const tabList = document.querySelector<HTMLElement>('.showTabs [role="tablist"]')
      if (!tabList) return
      const activeTab = tabList.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')

      if (activeTab && 'scrollIntoView' in activeTab) {
        activeTab.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          // Keep active tab aligned to the left in mobile overflow scenarios.
          inline: 'start',
        })
      }
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [tabIndex, i18n.language])

  useEffect(() => {
    if (isReloadCleanupDone) {
      return
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined

    if (navigationEntry?.type !== 'reload') {
      return
    }

    isReloadCleanupDone = true

    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev)
        next.delete('groupTourMonths')
        next.delete('groupTourRouteCountries')
        return next
      },
      { replace: true }
    )
  }, [setSearchParams])

  useEffect(() => {
    if (tabIndex === 3) {
      return
    }

    if (!searchParams?.get('groupTourMonths') && !searchParams?.get('groupTourRouteCountries')) {
      return
    }

    setSearchParams(
      prev => {
        const next = new URLSearchParams(prev)
        next.delete('groupTourMonths')
        next.delete('groupTourRouteCountries')
        return next
      },
      { replace: true }
    )
  }, [tabIndex, searchParams, setSearchParams])

  useEffect(() => {
    const scriptId = 'EmbedSocialHashtagScript'

    if (document.getElementById(scriptId)) {
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://embedsocial.com/cdn/ht.js'
    document.head.appendChild(script)
  }, [])

  return (
    <PageLayout background='white'>
      <SplashNotificationsManager />
      <PackageSearch
        variant={
          tabIndex === 0
            ? 'centeredCyprus'
            : tabIndex === 1
              ? 'centered'
              : tabIndex === 2
                ? 'centeredPackage'
                : 'centeredGroupTours'
        }
        isHotel={tabIndex}
        setHotel={handleTabChange}
        initialTab={tabIndex}
      />
      {tabIndex === 3 && <GroupTourList />}
      {tabIndex !== 0 && <StoriesSection isHotel={tabIndex} />}
      {tabIndex === 0 && <BudgetPlanner />}
      <PackageBanner mx={{ base: 4, md: 10 }} mt={10} />
      {tabIndex !== 0 && (
        <CityOffersSection mt={{ base: '100px', md: '120px' }} isHotel={tabIndex} />
      )}
      {/*<HotOffersSection mt={{ base: '62px', md: '84px' }} />*/}
      {/*<BlogsSection />*/}
      {/*<AppSection />*/}
      {/*<AboutUsBanner />*/}

      {/*<div*/}
      {/*  className="embedsocial-hashtag"*/}
      {/*  data-ref="f348cf39b90fa99e65cfce589513e45493bd6815"*/}
      {/*></div>*/}
    </PageLayout>
  )
}
