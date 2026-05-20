import { Box, Flex } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Illustration, Text } from '@ui'
import { useTranslation } from 'react-i18next'

export const LoadingView = () => {
	const {t} = useTranslation()

	return (
		<Flex width="360px" height="290px" align="center" direction="column" pt="60px">
			<Illustration name="loading" />

			<Loader />

			<Text size="md" mt="4" align="center" maxWidth="333px">
				{t`flightSearchText`}
			</Text>
		</Flex>
	)
}

const loaderAnimation = keyframes`
  33% { background-size: calc(100%/3) 0%, calc(100%/3) 100%, calc(100%/3) 100%; }
  50% { background-size: calc(100%/3) 100%, calc(100%/3) 0%, calc(100%/3) 100%; }
  66% { background-size: calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0%; }
`;

const Loader = () => {
	return (
		<Box
			width="28px"
			height="6px"
			sx={{
				"--_g": "no-repeat radial-gradient(circle closest-side, #E2E8F0 90%, #0000)",
				background: `
          var(--_g) 0% 50%,
          var(--_g) 50% 50%,
          var(--_g) 100% 50%
        `,
				backgroundSize: "calc(100% / 3) 100%",
				animation: `${loaderAnimation} 1s infinite linear`,
			}}
		/>
	);
};
