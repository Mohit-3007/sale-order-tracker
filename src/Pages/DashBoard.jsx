import {
  Box,
  Flex,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Button,
  List,
  ListIcon,
  ListItem,
  border,
  Table,
} from '@chakra-ui/react';
import {
  ChatIcon,
  CheckCircleIcon,
  EmailIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import TableComponent from '../components/TableComponent';
import SaleForm from '../components/SaleForm';

const DashBoard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tabStyle = {
    border: '1px solid #718096',
    borderRadius: '8px',
    fontSize: '1.2em',
  };

  function handleModal() {
    console.log('Open Modal');
    onOpen();
  }

  return (
    <>
      <Tabs mt="40px" py="20px" px="40px" colorScheme="purple" variant="styled">
        <TabList>
          <Flex justifyContent="space-between" w="100%">
            <Box display="flex" gap={2}>
              <Tab
                _selected={{ color: 'white', bg: 'purple.400' }}
                sx={tabStyle}
              >
                Active Sale Orders
              </Tab>
              <Tab
                _selected={{ color: 'white', bg: 'purple.400' }}
                sx={tabStyle}
              >
                Completed Sale Orders
              </Tab>
            </Box>
            <Box
              onClick={handleModal}
              // pos="absolute"
              // right="40px"
              // top="143px"
              cursor="pointer"
              sx={tabStyle}
              px={4}
              py={2}
            >
              + Sale Order
              <SaleForm isOpen={isOpen} onClose={onClose} />
            </Box>
          </Flex>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <TableComponent />
          </TabPanel>

          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>

    </>
  );
};

export default DashBoard;
