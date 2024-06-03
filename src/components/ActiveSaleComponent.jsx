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
import {
  fetchSalesOrders,
  fetchCustomer,
  updateOrder,
  updatePayment,
} from '../api/salesApi';
import { useState, useEffect, useLayoutEffect } from 'react';
import { CustomerName } from './CustomerName';

const ActiveSaleComponent = () => {
  const [orders, setOrders] = useState([]);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['saleOrder'],
    queryFn: fetchSalesOrders,
  });

  useEffect(() => {
    console.log('fetchSalesOrders date', data);
    const filteredData = data?.filter(order => {
      return order.paid != true;
    });
    setOrders(filteredData);
  }, [data]);

  if (isLoading) return 'Loading ....';
  if (isError) return `Error: ${error?.message}`;

  return (
    <>
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
                Last Modified
              </Th>
              <Th textAlign="center">Edit Order</Th>
            </Tr>
          </Thead>

          <Tbody>
            {orders &&
              orders?.map((order, index) => {
                const id = order.customer_id;

                const totalPrice = order?.items?.reduce((acc, curr) => {
                  const subtotal = curr.price * curr.quantity;
                  return acc + subtotal;
                }, 0);

                return (
                  <Tr key={index}>
                    <Td isNumeric textAlign="center">
                      <Flex>{index + 1}</Flex>
                    </Td>
                    <Td textAlign="center">
                      <CustomerName id={order.customer_id} />
                    </Td>
                    <Td isNumeric textAlign="center">
                      {totalPrice}
                    </Td>
                    <Td isNumeric textAlign="center">
                      {order.invoice_date}
                    </Td>
                    <Td isNumeric textAlign="center">
                      {order.modified_date ? order.modified_date : 'N/A'}
                    </Td>
                    <Td textAlign="center">
                      <MenuDown order={order} />
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
export default ActiveSaleComponent;

function MenuDown({ order }) {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [renderItems, setRenderItems] = useState(false);
  const dataa = { ...order };
  const updatePaymentMutation = useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleOrder'] });
    },
  });

  function handleMarkAsCompleted(order) {
    console.log('payment recieved ', order);
    const dataa = { ...order };
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    dataa.payment_date = formattedDate;
    dataa.paid = true;
    updatePaymentMutation.mutate({ dataa });
  }

  return (
    <Menu>
      <MenuButton as={Button} px="8px" onClick={setRenderItems}>
        <BsThreeDots
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onOpen}>
          <ViewModal
            isOpen={isOpen}
            onClose={onClose}
            dataa={dataa}
            renderItems={renderItems}
            queryClient={queryClient}
          />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleMarkAsCompleted(order)}>
          Mark as Completed
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ViewModal({ isOpen, onClose, dataa, renderItems, queryClient }) {
  const updateSaleOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ['saleOrder'] });
    },
  });
  const [items, setItems] = useState(dataa.items);
  const [total, setTotal] = useState({});
  const [disabled, setDisabled] = useState(() => {
    const result = dataa.items.reduce((obj, _, index) => {
      obj[index] = true;
      return obj;
    }, {});
    return result;
  });
  const [makeDisable, setMakeDisable] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [skuToDelete, setSkuToDelete] = useState('');
  const [makeDeleteApi, setMakeDeleteApi] = useState(false);

  useEffect(() => {
    if (orderId) setMakeDeleteApi(true);
  }, [orderId, skuToDelete]);

  useEffect(() => {
    setItems(dataa.items);
  }, [renderItems]);

  function handleIsDisabled(index, value) {
    setDisabled(prev => ({
      ...prev,
      [index]: value,
    }));
  }

  useEffect(() => {
    const values = Object.values(disabled);
    const isFalse = values.find(e => e == false);
    if (isFalse == false) setMakeDisable(false);
    else {
      setUpdateTrigger(false);
      setMakeDisable(true);
    }
  }, [disabled]);

  // Function to calculate grand total
  const calculateGrandTotal = () => {
    const values = Object.values(total);
    return values?.reduce((acc, curr) => acc + curr, 0);
  };

  // Function to handle form submission
  const handleUpdateAndClose = () => {
    if (makeDeleteApi) {
      handleDeleteOrderDetail(orderId, skuToDelete);
    }
    setUpdateTrigger(true);
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    dataa.modified = true;
    dataa.modified_date = formattedDate;

    console.log('updateSaleOrderMutation ', dataa);
    updateSaleOrderMutation.mutate({ dataa });
  };

  function handleClose() {
    setUpdateTrigger(false);
    onClose();
  }

  function deleteRow(index) {
    const orderId = dataa.id;
    const skuToDelete = items[index].sku_id;
    setMakeDisable(false);
    const arr = [...items];
    arr.splice(index, 1);
    setItems(arr);
    setOrderId(orderId);
    setSkuToDelete(skuToDelete);
  }

  function handleDeleteOrderDetail(orderId, skuToDelete) {
    const saleOrderData = queryClient.getQueryData('saleOrder');
    const orderToUpdate = saleOrderData.find(order => order.id === orderId);
    if (!orderToUpdate) {
      console.error('Order not found');
      return;
    }
    // Filter out the item with the specified skuIdToDelete
    const updatedItems = orderToUpdate.items.filter(
      item => item.sku_id !== skuToDelete
    );
    // Update the order with the filtered items
    orderToUpdate.items = updatedItems;

    // Replace the original order in the data with the updated one
    const updatedSaleOrderData = saleOrderData.map(order => {
      if (order.id === orderId) {
        return orderToUpdate;
      }
      return order;
    });
    // Update the data in the cache
    queryClient.setQueryData('saleOrder', updatedSaleOrderData);
  }

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
        <ModalHeader pb="0">
          <CustomerName id={dataa?.customer_id} /> <span>'s Order</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="0">
          <Box>
            <Text fontWeight="500" textAlign="end" mb={3}>
              {dataa.invoice_no}
            </Text>
            <Table variant="styled" size="sm">
              <Thead>
                <Tr>
                  <Th>SKU</Th>
                  <Th>Price</Th>
                  <Th>Quantity</Th>
                  <Th>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items?.map((_, index) => {
                  return (
                    <SkuRow
                      key={index}
                      index={index}
                      items={items}
                      setTotal={setTotal}
                      disabled={disabled}
                      handleIsDisabled={handleIsDisabled}
                      updateTrigger={updateTrigger}
                      handleUpdateAndClose={handleUpdateAndClose}
                      deleteRow={deleteRow}
                    />
                  );
                })}
              </Tbody>
            </Table>
            <Flex
              justifyContent="flex-end"
              pr="21px"
              fontWeight="700"
              pt="8px"
              fontSize="1.3em"
            >
              Grand Total: {calculateGrandTotal()}
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={handleClose}>
            Close
          </Button>
          <Box
            as={Button}
            isDisabled={makeDisable}
            onClick={handleUpdateAndClose}
          >
            Update & Close
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SkuRow({
  index,
  items,
  setTotal,
  disabled,
  handleIsDisabled,
  updateTrigger,
  handleUpdateAndClose,
  deleteRow,
}) {
  const [price, setPrice] = useState(items[index].price);
  const [quantity, setQuantity] = useState(items[index].quantity);
  const [subTotal, setSubTotal] = useState(
    items[index].price * items[index].quantity
  );
  const newItems = [...items];
  const item = items[index];

  useEffect(() => {
    if (price != items[index].price || quantity != items[index].quantity) {
      handleIsDisabled(index, false);
    } else {
      handleIsDisabled(index, true);
    }
  }, [price, quantity]);

  useEffect(() => {
    setTotal(prev => ({
      ...prev,
      [index]: price * quantity,
    }));
    setSubTotal(price * quantity);
  }, [price, quantity]);

  useEffect(() => {
    if (updateTrigger) {
      items[index].price = price;
      items[index].quantity = quantity;
    }
  }, [updateTrigger]);

  // Function to update item quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity == NaN) return;
    setQuantity(newQuantity);
  };

  // Function to update item price
  const updatePrice = (index, newPrice) => {
    if (newPrice == NaN) return;
    setPrice(newPrice);
  };

  function handleDeleteOrder() {
    deleteRow(index);
  }

  return (
    <Tr key={index}>
      <Td>{item?.sku_id}</Td>
      <Td>
        <NumberInput
          value={price}
          min={1}
          onChange={newQuantity => updatePrice(index, parseInt(newQuantity))}
        >
          <NumberInputField />
        </NumberInput>
      </Td>
      <Td>
        <NumberInput
          value={quantity}
          max={500}
          min={10}
          onChange={newQuantity => updateQuantity(index, parseInt(newQuantity))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td fontWeight="500" textAlign="center">
        {subTotal}
      </Td>
      <Td>
        <DeleteIcon boxSize={5} cursor="pointer" onClick={handleDeleteOrder} />
      </Td>
    </Tr>
  );
}
