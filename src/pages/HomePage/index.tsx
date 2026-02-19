import { PackageSearch } from '@widgets/PackageSearch'
// import { HotOffersSection } from '@widgets/HotOffersSection'
import { useEffect, useState } from 'react'
import { PackageBanner } from './PackageBanner'
// import { AppSection } from './AppSection.tsx'
// import { AboutUsBanner } from './AboutUsBanner.tsx'
// import { BlogsSection } from '@widgets/BlogsSection'
import { CityOffersSection } from "@widgets/CityOffersSection/ui"
import { PageLayout } from '@/shared/ui/layout/PageLayout'
import { StoriesSection } from '@widgets/StoriesSection'
import { GroupTourList } from '@widgets/GroupTourList'

export const HomePage = () => {
  const [tabIndex, setTabIndex] = useState(0)

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
      <PackageSearch variant={tabIndex === 1 ? 'centeredPackage' : tabIndex === 0 ? "centered" : "centeredGroupTours"} isHotel={tabIndex} setHotel={setTabIndex} />
      {
        tabIndex === 2 && <GroupTourList />
      }
      <StoriesSection isHotel={tabIndex} />
      {
        tabIndex !== 2 && <PackageBanner mx={{base: 4, md: "auto"}} mt={10} isHotel={tabIndex} maxWidth='1376px'/>
      }
      <CityOffersSection mt={{ base: '100px', md: '120px' }} isHotel={tabIndex}/>
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
