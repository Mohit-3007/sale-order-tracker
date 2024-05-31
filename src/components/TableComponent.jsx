import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Button,
  Box,
  Spacer,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
 
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';

const TableComponent = () => {
  const tableData = [
    {
      id: 1,
      name: 'm',
      price: 500,
      lastModified: 'na',
      View: 'Yes',
    },
    {
      id: 2,
      name: 'o',
      price: 700,
      lastModified: 'na',
      View: 'Yes',
    },
    {
      id: 3,
      name: 't',
      price: 600,
      lastModified: 'na',
      view: 'Yes',
    },
  ];

  return (
    <>
      <TableContainer maxWidth="90%" mt={2}>
        <Table size="md" variant="unstyled">
          <Thead>
            <Tr>
              <Th isNumeric>
                <Flex>ID</Flex>
              </Th>
              <Th>Customer Name</Th>
              <Th isNumeric>Price ( &#8377; )</Th>
              <Th isNumeric>Last Modified</Th>
              <Th>Edit/View</Th>
            </Tr>
          </Thead>

          <Tbody>
            {tableData &&
              tableData.map((e, index) => {
                return (
                  <Tr key={index}>
                    <Td isNumeric>
                      <Flex>{e.id}</Flex>
                    </Td>
                    <Td>{e.name}</Td>
                    <Td isNumeric>{e.price}</Td>
                    <Td isNumeric>{e.lastModified}</Td>
                    <Td>
                      <MenuDown />
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* <TableContainer maxWidth='90%' mt={2}>
        <Table size='md' variant='striped'>
        <Tbody>
            <Tr>
                <Td width='150px' isNumeric><Flex>1</Flex></Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
                <Td isNumeric>24/05/2024 (11:07 PM) 24/05/2024 (11:07 PM)</Td>
            </Tr>
            <Tr >
                <Td isNumeric><Flex>2</Flex></Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
                <Td isNumeric>24/05/2024 (11:07 PM) 24/05/2024 (11:07 PM)</Td>
            </Tr>
            </Tbody>
        </Table>
    </TableContainer> */}
    </>
  );
};

export default TableComponent;

function MenuDown() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu>
      <MenuButton as={Button} px="8px" bg="green.400">
        <BsThreeDots
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onOpen}><ViewModal isOpen={isOpen} onClose={onClose} />View</MenuItem>
        <MenuItem>Edit</MenuItem>
      </MenuList>
    </Menu>
  );
}

function ViewModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Lorem count={2} /> */}Hello
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
