export type StoryCta = {
  title: string
  link: string
  type: string
}

export type Story = {
  id: number
  productId: number | null
  title: string
  imageUrl: string
  shortDescription: string
  cta: StoryCta | null
  displayOrder: number
}

export type StorySet = {
  id: number
  name: string
  description: string
  avatarImageUrl: string
  displayOrder: number
  stories: Story[]
}

export type StoriesApiResponse = {
  storySets: StorySet[]
}

export type StoryGroup = {
  storySet: Omit<StorySet, 'stories'>
  stories: Story[]
}
