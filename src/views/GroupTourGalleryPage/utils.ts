import type { GroupTourGalleryItem } from "@entities/package"

export const groupGalleryByAttribute = (gallery: GroupTourGalleryItem[]) => {
  const byAttribute = new Map<string, GroupTourGalleryItem[]>()
  const sorted = [...gallery]
    .filter((item) => (item.type ?? "").toLowerCase() === "image" || !item.type)
    .sort((a, b) => a.order - b.order)

  for (const item of sorted) {
    const attr = item.attribute
    const key =
      (attr && (attr.eng || attr.arm || attr.rus)) ||
      "Other"
    if (!byAttribute.has(key)) {
      byAttribute.set(key, [])
    }
    byAttribute.get(key)!.push(item)
  }

  return Array.from(byAttribute.entries())
}
