import { Box, Flex, Link, HStack } from '@chakra-ui/react'
import { Text } from '@ui'

export const ContactSection = () => {
  const contactSocials = [
    { icon: 'facebook', link: 'https://www.facebook.com/mytour.am.travel' },
    { icon: 'instagram', link: 'https://www.instagram.com/mytour.am/' },
  ]

  return (
    <Box
      borderRadius="12px"
      background="rgba(0, 0, 0, 0.30)"
      backdropFilter="blur(9px)"
      px="24px"
      py="16px"
      my="16px"
      width={{ base: 'full', sm: 'auto' }}
      maxW={{ base: 'full', sm: '800px' }}
    >
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 3, sm: 0 }}
      >
        {/* Email */}
        <Link href="mailto:bookings@mytour.am" mb={{ base: 4, sm: 0 }}>
          <Text
            fontSize="14px"
            lineHeight="20px"
            color="white"
            fontWeight={500}
            _hover={{ textDecoration: 'underline' }}
          >
            bookings@mytour.am
          </Text>
        </Link>

        {/* Desktop divider */}
        <Text
          display={{ base: 'none', sm: 'block' }}
          color="white"
          fontSize="14px"
          lineHeight="20px"
          mx="40px"
        >
          |
        </Text>

        {/* Social Media Links - horizontal with dividers */}
        <HStack spacing={0}>
          {contactSocials.map((social, index) => (
            <Box key={social.icon} display="flex" alignItems="center">
              {index > 0 && (
                <Text 
                  color="white" 
                  fontSize="14px" 
                  lineHeight="20px" 
                  mx={{ base: '32px', sm: '40px' }}
                >
                  |
                </Text>
              )}
              <Link href={social.link} isExternal>
                <Text
                  fontSize="14px"
                  lineHeight="20px"
                  color="white"
                  fontWeight={500}
                  textTransform="capitalize"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {social.icon}
                </Text>
              </Link>
            </Box>
          ))}
          {/* Add Viber */}
          <Box display="flex" alignItems="center">
            <Text 
              color="white" 
              fontSize="14px" 
              lineHeight="20px" 
              mx={{ base: '32px', sm: '40px' }}
            >
              |
            </Text>
            <Link href="viber://chat?number=%2B37433966305">
              <Text
                fontSize="14px"
                lineHeight="20px"
                color="white"
                fontWeight={500}
                _hover={{ textDecoration: 'underline' }}
              >
                Viber
              </Text>
            </Link>
          </Box>
        </HStack>
      </Flex>
    </Box>
  )
}

