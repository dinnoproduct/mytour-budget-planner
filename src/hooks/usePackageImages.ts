import { useMemo } from 'react'
import { type PackageEntity } from '@entities/package'

export const usePackageImages = (packageDetails: PackageEntity | null) => {
  const uniqueImageUrls = useMemo(() => {
    const imagesArr = packageDetails?.hotel?.images || []
    
    let filteredImages = imagesArr.filter((img: any) => img.size === 3)
    
    if (!filteredImages.length && imagesArr.length) {
      filteredImages = imagesArr.filter((img: any) => img.size === 1)
    }
    
    return filteredImages.map((img: any) => img.url)
  }, [packageDetails?.hotel?.images])

  return { uniqueImageUrls }
}
