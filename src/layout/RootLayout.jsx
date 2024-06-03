import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

const RootLayout = () => {
  const { colorMode } = useColorMode();

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
            <Button>Logout/Login</Button>
          </Flex>
        </Flex>
      </Box>
      <Outlet />
    </Box>
  );
};

export default RootLayout;
