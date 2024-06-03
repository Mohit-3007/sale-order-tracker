import React from 'react';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Text,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchSalesOrders, fetchCustomer, updateOrder } from '../api/salesApi';
import { useState, useEffect, useLayoutEffect } from 'react';
import { CustomerName } from './CustomerName';

const CompletedSaleComponent = () => {
  const [orders, setOrders] = useState([]);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['saleOrder'],
    queryFn: fetchSalesOrders,
  });

  useEffect(() => {
    // console.log(data);
    const filteredData = data?.filter(order => {
      return order.paid == true;
    });
    setOrders(filteredData);
  }, [data]);
  if (isLoading) return 'Loading ....';
  if (isError) return `Error: ${error?.message}`;
  //   console.log('posts ', orders);

  return (
    <TableContainer maxWidth="90%" mt={3}>
      <Table size="md" variant="striped">
        <Thead>
          <Tr>
            <Th isNumeric textAlign="center">
              <Flex>ID</Flex>
            </Th>
            <Th textAlign="center">Customer Name</Th>
            <Th isNumeric textAlign="center">
              Price ( &#8377; )
            </Th>
            <Th isNumeric textAlign="center">
              Invoice Date
            </Th>
            <Th isNumeric textAlign="center">
              Payment Date
            </Th>
            <Th>View Order</Th>
          </Tr>
        </Thead>

        <Tbody>
          {orders &&
            orders?.map((order, index) => {
              return <TableRow key={index} order={order} index={index} />;
            })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CompletedSaleComponent;

function TableRow({ order, index }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renderItems, setRenderItems] = useState(false);
  const id = order.customer_id;
  const totalPrice = order.items.reduce((acc, curr) => {
    const subtotal = curr.price * curr.quantity;
    return acc + subtotal;
  }, 0);
  const dataa = { ...order };
  //   console.log(isOpen);

  return (
    <Tr key={index}>
      <Td isNumeric textAlign="center">
        <Flex>{index + 1}</Flex>
      </Td>
      <Td textAlign="center">
        <CustomerName id={order?.customer_id} />
      </Td>
      <Td isNumeric textAlign="center">
        {totalPrice}
      </Td>
      <Td isNumeric textAlign="center">
        {order.invoice_date}
      </Td>
      <Td isNumeric textAlign="center">
        {order.payment_date}
      </Td>
      <Td>
        <Button variant="ghost" onClick={onOpen}>
          Open
        </Button>
        {isOpen && (
          <OpenModal
            onClose={onClose}
            isOpen={isOpen}
            dataa={dataa}
            renderItems={renderItems}
          />
        )}
      </Td>
    </Tr>
  );
}

function OpenModal({ onClose, isOpen, dataa, renderItems }) {
  const [items, setItems] = useState(dataa.items);
  const total = items?.reduce((acc, curr, index) => {
    return acc + curr.price * curr.quantity;
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnOverlayClick={false}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb="0" pl="36px">
          <CustomerName id={dataa?.customer_id} /> <span>'s Order</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text fontWeight="500" textAlign="end" mb={3}>
              {dataa.invoice_no}
            </Text>
            <Table variant="styled" size="sm">
              <Thead>
                <Tr>
                  <Th textAlign="center">SKU</Th>
                  <Th textAlign="center">Price</Th>
                  <Th textAlign="center" w="fit-content">
                    Quantity
                  </Th>
                  <Th textAlign="center">Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items?.map((_, index) => {
                  return <SkuRow key={index} index={index} items={items} />;
                })}
              </Tbody>
            </Table>
            <Flex
              justifyContent="flex-end"
              pr="21px"
              fontWeight="700"
              pt="8px"
              fontSize="1.1em"
            >
              Grand Total: {total}
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SkuRow({ index, items }) {
  const [price, setPrice] = useState(items[index].price);
  const [quantity, setQuantity] = useState(items[index].quantity);
  const item = items[index];

  return (
    <Tr key={index}>
      <Td textAlign="center">{item?.sku_id}</Td>
      <Td textAlign="center">
        <Box>{price}</Box>
      </Td>
      <Td textAlign="center">
        <Box>{quantity}</Box>
      </Td>
      <Td fontWeight="600" textAlign="center">
        <Box>{price * quantity}</Box>
      </Td>
    </Tr>
  );
}
