import { Img } from '@chakra-ui/react'
import { IllustrationProps } from '@components/Illustration/types.ts'

export type * from './types.ts'

export const Illustration = ({name, ...props}: IllustrationProps) => {
	return (
		<Img
			src={`/assets/illustrations/${name}.png`}
			alt={name}
			maxWidth="120px"
			maxHeight="120px"
			width="full"
			height="full"
			{...props}
		/>
	)
}
