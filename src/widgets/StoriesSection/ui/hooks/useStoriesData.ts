import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StoriesApiResponse, type StoryGroup } from '../types'
import { STORIES_ENDPOINT } from '../constants'
import { LANGUAGE_NAME_MAP } from '@shared/model'
import type { LanguageName } from '@shared/model'

export const useStoriesData = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { i18n } = useTranslation()

  useEffect(() => {
    let isMounted = true

    const loadStories = async () => {
      if (!storyGroups.length) {
        setIsLoading(true)
      }
      setError(null)

      const contentLanguage =
        LANGUAGE_NAME_MAP[i18n.language as LanguageName] ?? 'am'

      try {
        const response = await fetch(STORIES_ENDPOINT, {
          headers: {
            'Platform': 'web',
            'Content-Language': contentLanguage,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stories')
        }

        const payload: StoriesApiResponse = await response.json()

        if (!isMounted) {
          return
        }

        const groups: StoryGroup[] = (payload.storySets ?? [])
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map(({ stories, ...storySet }) => ({
            storySet,
            stories: [...stories].sort(
              (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
            ),
          }))

        setStoryGroups(groups)
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
  }, [i18n.language])

  return { storyGroups, isLoading, error }
}

