import { Img, ImgProps } from '@chakra-ui/react'

export const GalleryImage = (props:ImgProps) => {
	return (
		<Img
			objectFit="cover"
			objectPosition="center"
			height="full"
			width="full"
			maxHeight="full"
			maxWidth="full"
			loading="eager"
			{...props}
		/>
	)
}