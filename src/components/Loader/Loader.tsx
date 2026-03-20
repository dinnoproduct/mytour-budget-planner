import { CSSProperties, type FC } from 'react';
import './index.scss';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Box, Flex } from '@chakra-ui/react';
import { Text } from '@ui';


// Import the actual asset URL so the library loads valid Lottie data
// instead of resolving a potentially missing relative path.
// Vite-style '?url' ensures this is served as a static file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import loaderLottieUrl from './loader.lottie?url';

export const Loader: FC<{ loading: boolean, style?: CSSProperties }> = ({ loading, style }) => {
  if (loading) {
    return (
      <div className="loader" style={style}>
        <Box width="200px" height="200px">
        <DotLottieReact src={loaderLottieUrl as string} loop autoplay /></Box>
      </div>
    );
  }

  return null;
};


export const LoaderWithText: FC<{ loading: boolean, title: string, description: string, style?: CSSProperties }> = ({ loading, title, description, style }) => {
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexDirection="column" height="100%" width="100%" gap="4" style={style}>
        <Box width="200px" height="200px">
          <DotLottieReact src={loaderLottieUrl as string} loop autoplay />
        </Box>
        <Text size="md" align="center" fontWeight="semibold" color="gray.800" maxWidth={{base: "300px", md: "400px"}} as="p">
          {title}
        </Text>
        <Text size="sm" align="center" color="gray.600" maxWidth={{base: "300px", md: "400px"}} as="p">
          {description}
        </Text>
      </Flex>
    );
  }
  return null;
};