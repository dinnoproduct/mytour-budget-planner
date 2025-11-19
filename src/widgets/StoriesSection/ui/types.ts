export type StoryApiResponse = {
  story: {
    id: number
    storySetId: number
    storyImageUrl: string
    shortDescription: string
    customTitle: string
    customLink: string
    displayOrder: number
    isActive: boolean
  }
  storySet: {
    id: number
    name: string
    avatarImageUrl: string
    displayOrder: number
    isActive: boolean
  }
}

export type StoryGroup = {
  storySet: StoryApiResponse['storySet']
  stories: StoryApiResponse['story'][]
}

