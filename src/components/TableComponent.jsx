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
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { fetchSalesOrders, fetchCustomer } from '../api/salesApi';
import { useState, useEffect } from 'react';

const TableComponent = () => {
  const [queryEnabled, setQueryEnabled] = useState(true);
  const {
    isLoading,
    isError,
    data: order,
    error,
  } = useQuery({
    queryKey: ['product'],
    queryFn: fetchSalesOrders,
    enabled: queryEnabled,
  });

  useEffect(() => {
    setQueryEnabled(false);
  }, []);

  if (isLoading) return 'Loading ....';
  if (isError) return `Error: ${error?.message}`;

  console.log('posts ', order);

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
            {order &&
              order.map((e, index) => {
                const totalPrice = e.items.reduce((acc, curr) => {
                  const subtotal = curr.price * curr.quantity;
                  return acc + subtotal;
                }, 0);

                return (
                  <Tr key={index}>
                    <Td isNumeric>
                      <Flex>{index + 1}</Flex>
                    </Td>
                    <CustomerName
                      id={e.customer_id}
                      queryEnabled={queryEnabled}
                    />
                    {/* <Td>{e.customer_id}</Td> */}
                    <Td isNumeric>{totalPrice}</Td>
                    <Td isNumeric>{e.invoice_date}</Td>
                    <Td>
                      <MenuDown obj={e} />
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
export default TableComponent;

function CustomerName({ id, queryEnabled }) {
  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomer({ id }),
    enabled: queryEnabled,
  });

  console.log('result ', customer);
  return <Td>{customer && customer[0]?.customer_profile?.name}</Td>;
}

function MenuDown({ obj }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu>
      <MenuButton as={Button} px="8px" bg="green.400">
        <BsThreeDots
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onOpen}>
          <ViewModal isOpen={isOpen} onClose={onClose} obj={obj} />
          View
        </MenuItem>
        <MenuItem>Edit</MenuItem>
      </MenuList>
    </Menu>
  );
}

function ViewModal({ isOpen, onClose, obj: data }) {
  const [customerName, setCustomerName] = useState(data.customer_name);
  const [invoiceNo, setInvoiceNo] = useState(data.invoice_no);
  const [items, setItems] = useState(data.items);

  // Function to update item quantity
  const updateQuantity = (index, newQuantity) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    setItems(updatedItems);
  };

  // Function to update item price
  const updatePrice = (index, newPrice) => {
    const updatedItems = [...items];
    updatedItems[index].price = newPrice;
    setItems(updatedItems);
  };

  // Function to calculate grand total
  const calculateGrandTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Perform data submission logic here
    console.log('Form submitted!');
    console.log('Customer Name:', customerName);
    console.log('Invoice Number:', invoiceNo);
    console.log('Items:', items);
  };
  console.log('obj ', data);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{data.customer_id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <FormControl>
              <FormLabel>Customer Name:</FormLabel>
              <Input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ marginLeft: '20px' }}>
                Invoice Number:
              </FormLabel>
              <Input
                type="text"
                value={invoiceNo}
                onChange={e => setInvoiceNo(e.target.value)}
                style={{ marginLeft: '10px' }}
              />
            </FormControl>
            <Table>
              <Thead>
                <Tr>
                  <Th>SKU</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.sku_id}</Td>
                    <Td>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e =>
                          updatePrice(index, parseInt(e.target.value))
                        }
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          updateQuantity(index, parseInt(e.target.value))
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button onClick={handleSubmit}>Save Data</Button>
            <div>Grand Total: {calculateGrandTotal()}</div>
          </Box>
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
