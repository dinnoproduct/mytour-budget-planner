const GUEST_ID_KEY = 'splashGuestUserId'

function uuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getGuestUserId(): string {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem(GUEST_ID_KEY)
  if (existing) return existing
  const id = uuidV4()
  localStorage.setItem(GUEST_ID_KEY, id)
  return id
}
