/** 9:16 story card — fixed height; width derived from aspect ratio. */
export const TIP_STORY_CARD_HEIGHT = { base: 280, md: 320 } as const

export const getTipStoryCardWidth = (height: number) => Math.round((height * 9) / 16)

export const TIP_STORY_GAP = { base: 16, md: 24 } as const
