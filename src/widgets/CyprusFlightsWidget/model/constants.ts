const WIDGET_BASE_URL = 'https://tpwgts.com/content'

const WIDGET_PARAMS = {
  currency: 'amd',
  trs: '535390',
  shmarker: '735127',
  searchUrl: 'www.aviasales.com/search',
  powered_by: 'true',
  origin: 'EVN',
  destination: 'LCA',
  one_way: 'false',
  only_direct: 'false',
  period: 'year',
  range: '7,14',
  primary: '#0C73FE',
  color_background: '#ffffff',
  dark: '#000000',
  light: '#FFFFFF',
  achieve: '#45AD35',
  promo_id: '4041',
  campaign_id: '100',
} as const

export const CYPRUS_FLIGHTS_WIDGET_SCRIPT_ID = 'cyprus-travelpayouts-widget'

const WIDGET_LOCALES = new Set(['hy', 'en', 'ru'])

export const getCyprusFlightsWidgetScriptSrc = (language: string) => {
  const locale = WIDGET_LOCALES.has(language) ? language : 'hy'
  const params = new URLSearchParams({
    ...WIDGET_PARAMS,
    locale,
  })

  return `${WIDGET_BASE_URL}?${params.toString()}`
}
