'use client'

import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CYPRUS_FLIGHTS_WIDGET_SCRIPT_ID,
  getCyprusFlightsWidgetScriptSrc,
} from '../model/constants'

export const CyprusFlightsWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { i18n } = useTranslation()

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    document.getElementById(CYPRUS_FLIGHTS_WIDGET_SCRIPT_ID)?.remove()
    container.replaceChildren()

    const script = document.createElement('script')
    script.id = CYPRUS_FLIGHTS_WIDGET_SCRIPT_ID
    script.async = true
    script.charset = 'utf-8'
    script.src = getCyprusFlightsWidgetScriptSrc(i18n.language)
    container.appendChild(script)

    return () => {
      script.remove()
      container.replaceChildren()
    }
  }, [i18n.language])

  return (
    <Box
      ref={containerRef}
      w="full"
      mx="auto"
      px={{ base: 4, md: 10 }}
      mt={{ base: 10, md: '100px' }}
      aria-label="Cyprus flights search"
    />
  )
}
