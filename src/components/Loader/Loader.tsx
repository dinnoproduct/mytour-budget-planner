import { type FC } from 'react';
import './index.scss';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// Import the actual asset URL so the library loads valid Lottie data
// instead of resolving a potentially missing relative path.
// Vite-style '?url' ensures this is served as a static file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import loaderLottieUrl from './loader.lottie?url';
import { Box } from '@chakra-ui/react';

const Loader: FC<{ loading: boolean }> = ({ loading }) => {
  if (loading) {
    return (
      <div className="loader">
        <Box width="200px" height="200px">
        <DotLottieReact src={loaderLottieUrl as string} loop autoplay /></Box>
      </div>
    );
  }

  return null;
};

export default Loader;
