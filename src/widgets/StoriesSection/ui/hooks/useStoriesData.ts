import { useCallback, useEffect, useState } from 'react'
import { type StoryApiResponse, type StoryGroup } from '../types'
import { STORIES_ENDPOINT } from '../constants'

export const useStoriesData = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const groupStories = useCallback((data: StoryApiResponse[]): StoryGroup[] => {
    const map = new Map<number, StoryGroup>()

    data.forEach((item) => {
      const { story, storySet } = item

      if (!story?.isActive || !storySet?.isActive) {
        return
      }

      if (!map.has(storySet.id)) {
        map.set(storySet.id, {
          storySet,
          stories: []
        })
      }

      const group = map.get(storySet.id)

      if (group) {
        group.stories.push(story)
      }
    })

    return Array.from(map.values())
      .map((group) => ({
        storySet: group.storySet,
        stories: [...group.stories].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        )
      }))
      .sort(
        (a, b) =>
          (a.storySet.displayOrder ?? 0) - (b.storySet.displayOrder ?? 0)
      )
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadStories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(STORIES_ENDPOINT)

        if (!response.ok) {
          throw new Error('Failed to fetch stories')
        }

        const payload: StoryApiResponse[] = await response.json()

        if (!isMounted) {
          return
        }

        const grouped = groupStories(payload)
        setStoryGroups(grouped)
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadStories()

    return () => {
      isMounted = false
    }
  }, [groupStories])

  return { storyGroups, isLoading, error }
}

