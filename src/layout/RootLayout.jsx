import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

const RootLayout = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  console.log(location);

  return (
    <Box overflowX="hidden">
      <Box
        w="100vw"
        px={7}
        py={5}
        bg={colorMode === 'light' ? 'teal.300' : 'teal.700'}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Heading p="0" color="white" ml={3}>
              Sale Order Track Book{' '}
            </Heading>
          </Flex>
          <Flex
            maxW="400px"
            justifyContent="flex-end"
            alignItems="center"
            px={2}
            gap={2}
          >
            <ColorModeSwitcher justifySelf="flex-end" />
            {location.pathname !== '/signup' &&
              location.pathname !== '/login' && <Button>Logout</Button>}
          </Flex>
        </Flex>
      </Box>
      <Outlet />
    </Box>
  );
};

export default RootLayout;
