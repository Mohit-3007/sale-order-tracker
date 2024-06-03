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
import ActiveSaleComponent from '../components/ActiveSaleComponent';
import SaleForm from '../components/SaleForm';
import CompletedSaleComponent from '../components/CompletedSaleComponent';

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
      <Tabs mt="40px" py="20px" px="40px" colorScheme="teal" variant="styled">
        <TabList>
          <Flex justifyContent="space-between" w="100%">
            <Box display="flex" gap={2}>
              <Tab _selected={{ color: 'white', bg: 'teal.600' }} sx={tabStyle}>
                Active Sale Orders
              </Tab>
              <Tab _selected={{ color: 'white', bg: 'teal.600' }} sx={tabStyle}>
                Completed Sale Orders
              </Tab>
            </Box>
            <Box
              onClick={handleModal}
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
            <ActiveSaleComponent />
          </TabPanel>

          <TabPanel p={0}>
            <CompletedSaleComponent />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default DashBoard;
