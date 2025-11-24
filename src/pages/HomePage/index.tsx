import { PackageSearch } from '@widgets/PackageSearch'
import { HotOffersSection } from '@widgets/HotOffersSection'
import {useEffect, useState} from 'react'
import { useModalContext } from '@app/providers'
import { useLocation } from 'react-router-dom'
import { PackageBanner } from './PackageBanner'
import { AppSection } from './AppSection.tsx'
import { AboutUsBanner } from './AboutUsBanner.tsx'
import { BlogsSection } from '@widgets/BlogsSection'
import {CityOffersSection} from "@widgets/CityOffersSection/ui";
import { PageLayout } from '@/shared/ui/layout/PageLayout'

export const HomePage = () => {
  const { dispatchModal } = useModalContext()
  const location = useLocation()
  const [isHotel, setHotel] = useState(0)

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const successState = queryParams.get('success')?.toLowerCase()
    const paymentStatusModal =
      successState === 'true'
        ? 'paymentSuccess'
        : successState === 'false'
          ? 'paymentError'
          : null

    if (paymentStatusModal) {
      setTimeout(() => {
        dispatchModal({
          type: 'open',
          modalType: paymentStatusModal
        })
      }, 0)
    }
  }, [JSON.stringify(location.search), dispatchModal])


  return (
    <PageLayout background='white'>
      <PackageSearch variant={isHotel ? 'centeredPackage' : "centered"} isHotel={isHotel} setHotel={setHotel} />
      <PackageBanner mx={{base: 4, md: "auto"}} mt={{ base: 4, md: 20 }} isHotel={isHotel} maxWidth='1376px'/>
      <CityOffersSection mt={{ base: '100px', md: '120px' }} isHotel={isHotel}/>
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
