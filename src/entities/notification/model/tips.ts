export type TipLocalizedText = {
  arm?: string
  eng?: string
  ru?: string
}

export type ExternalTipType = 'IMAGE' | 'VIDEO'

export type ExternalTip = {
  id: number
  type: ExternalTipType
  title: TipLocalizedText
  description?: TipLocalizedText
  mediaUrl: string
  displayOrder: number
}

export type ExternalTipsResponse = ExternalTip[]
