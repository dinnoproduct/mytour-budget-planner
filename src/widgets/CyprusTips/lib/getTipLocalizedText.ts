import { type TipLocalizedText } from '@entities/notification'

export const getTipLocalizedText = (
  value: TipLocalizedText | undefined,
  language: string,
) => {
  if (!value) {
    return ''
  }

  if (language.startsWith('hy')) {
    return (value.arm || value.eng || value.ru || '').trim()
  }

  if (language.startsWith('ru')) {
    return (value.ru || value.eng || value.arm || '').trim()
  }

  return (value.eng || value.arm || value.ru || '').trim()
}
