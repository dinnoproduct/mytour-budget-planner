import { Link, LinkProps as ReactLinkProps } from 'react-router-dom';
import { Box, LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { useLanguageRouting } from '../../hooks/useLanguageRouting';
import { appendStoredUTMsToPath } from '@/utils/utmParams';

interface LanguageLinkProps extends Omit<ReactLinkProps, 'to' | 'color'>, Omit<ChakraLinkProps, 'as' | 'color'> {
  to: string;
  // Accept both React Router and Chakra UI color types
  color?: string | ChakraLinkProps['color'];
}

export const LanguageLink = ({ to, color, ...props }: LanguageLinkProps) => {
  const { getPathWithLanguage } = useLanguageRouting();
  const pathWithUtm = appendStoredUTMsToPath(getPathWithLanguage(to));

  // Convert Chakra UI color to string if needed
  const reactRouterColor = typeof color === 'string' ? color : undefined;

  return (
    <Box as={Link} to={pathWithUtm} color={reactRouterColor} {...props} />
  );
};
