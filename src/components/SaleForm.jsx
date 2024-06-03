import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Select,
  FormHelperText,
  Flex,
  Spacer,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  fetchAllProducts,
  fetchAllCustomers,
  createSale,
} from '../api/salesApi';
import { v4 as uuidv4 } from 'uuid';

const SaleForm = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [disableSelect, setDisableSelect] = useState(true);
  const [availableProducts, setAvailableProducts] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [updateItemObject, setUpdateItemObject] = useState(false);
  const [saleObject, setSaleObject] = useState({});
  const [selectDated, setSelectDated] = useState(0);

  const [items, setItems] = useState([]);
  const myRef = useRef();
  const { colorMode } = useColorMode();
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchAllCustomers,
  });
  console.log(customers);
  const { data: products } = useQuery({
    queryKey: ['product'],
    queryFn: fetchAllProducts,
  });
  const createSaleOrderMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saleOrder'] });
      console.log('success bro! sale order created');
      setUpdateItemObject(false);
      setItems([]);
      setSaleObject({});
      setShowSubmitButton(false);
      setSelectedCustomer(null);
      setDisableSelect(true);
      setAvailableProducts(products);
      setSelectedProducts([]);
      onClose();
    },
  });

  useEffect(() => {
    setAvailableProducts(products);
  }, [products]);

  const handleCustomerChange = event => {
    if (event.target.value) {
      setDisableSelect(false);
      setSelectedCustomer(event.target.value);
      setAvailableProducts(products);
      setSelectedProducts([]);
    } else {
      setSelectedCustomer(null);
      setDisableSelect(true);
      setSelectedProducts([]);
      setAvailableProducts(products);
    }
  };

  const handleProductChange = event => {
    const productId = event.target.value;
    const selectedProduct = availableProducts.find(
      product => product.id === productId
    );
    // Remove selected product from available products array
    const updatedAvailableProducts = availableProducts.filter(
      product => product.id !== productId
    );
    setAvailableProducts(updatedAvailableProducts);
    // Add selected product to selected products array
    setSelectedProducts([...selectedProducts, selectedProduct]);
  };

  function handleCloseSaleForm() {
    console.log('cleaning up your mess');
    setSelectedCustomer(null);
    setDisableSelect(true);
    setAvailableProducts(products);
    setSelectedProducts([]);
    setUpdateItemObject(false);
    setItems([]);
    setSaleObject({});
    setShowSubmitButton(false);
    onClose();
  }

  function handleSubmitForm(e) {
    e.preventDefault();
    console.log('submit form');
    setUpdateItemObject(true);
  }

  useEffect(() => {
    if (items.length > 0) {
      function invoiceGenerator() {
        const randomNumber =
          Math.floor(Math.random() * (8000000 - 1100000 + 1)) + 1100000;
        return randomNumber;
      }
      function formatDate(selectDated) {
        const date = new Date(selectDated);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit month with leading zero
        const day = date.getDate();
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate.toString();
      }
      const invoiceDate = formatDate(selectDated);
      const invoiceNumber = invoiceGenerator();
      const obj = {};
      obj.customer_id = parseInt(selectedCustomer);
      obj.items = items;
      obj.paid = false;
      obj.payment_date = null;
      obj.invoice_no = `Invoice - ${invoiceNumber}`;
      obj.invoice_date = invoiceDate;
      obj.modified = false;
      obj.modified_date = null;
      console.log('sale obj ', obj);
      setSaleObject(obj);
    }
  }, [items]);

  useEffect(() => {
    if (items.length) {
      console.log('i am baout to make a  call call call');
      createSaleOrderMutation.mutate({
        id: uuidv4(),
        ...saleObject,
      });
    }
  }, [saleObject]);

  function handleSubmit(e) {
    console.log('submit ref ref ref');
    handleSubmitForm(e);
  }

  function handleSaleOrderItems(obj) {
    setItems(prev => [...prev, obj]);
  }

  console.log('Katrina items ', items);

  function handleShowSubmitButton(value) {
    setShowSubmitButton(value);
  }

  function handleSaleOrderDate(e) {
    console.log(e);

    setSelectDated(e.target.value);
  }

  console.log(selectDated);

  console.log('selectedCustomer ', selectedCustomer);
  // console.log('selectedProducts ', selectedProducts);
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxWidth="900px" minH="45vh" maxH="85vh">
          <ModalHeader textAlign="center" fontWeight="700">
            Sale Order Form
          </ModalHeader>
          <ModalCloseButton onClick={handleCloseSaleForm} />
          <ModalBody>
            <form onSubmit={handleSubmitForm}>
              {/* select customer & products */}
              <Flex>
                {/* Select Customer */}
                <FormControl
                  w="50%"
                  id="customer"
                  flex="1"
                  display="flex"
                  alignItems="center"
                  px="10px"
                  gap="10px"
                >
                  <FormLabel w="40%" fontSize="1.2em">
                    Select Customer
                  </FormLabel>
                  <Select
                    w="40%"
                    placeholder="Select customer"
                    onChange={handleCustomerChange}
                    value={selectedCustomer}
                  >
                    {customers?.map(customer => (
                      <option key={customer.id} value={customer.customer}>
                        {customer.customer_profile.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Select product */}
                <FormControl
                  w="50%"
                  id="customer"
                  flex="1"
                  display="flex"
                  alignItems="center"
                  px="10px"
                  gap="10px"
                  isDisabled={disableSelect}
                >
                  <FormLabel w="40%" fontSize="1.2em">
                    Select Products
                  </FormLabel>
                  <Select
                    w="40%"
                    placeholder="Select products"
                    onChange={handleProductChange}
                    value={selectedProducts}
                  >
                    {availableProducts?.map(product => (
                      <option
                        key={product.id}
                        value={product.id}
                        // onClick={e => handleProductChange(e)}
                      >
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
              {/* display products */}
              {selectedProducts.length > 0 && (
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  gap={3}
                  mt={5}
                  mx={3}
                  mb={3}
                >
                  <Text>Invoice Date:</Text>
                  <Input
                    w="18%"
                    placeholder="Select Date"
                    size="sm"
                    type="date"
                    onChange={handleSaleOrderDate}
                    value={selectDated}
                  />
                </Box>
              )}
              {selectedProducts &&
                selectedProducts?.map((prod, index) => {
                  return (
                    <ProductComponent
                      key={index}
                      index={index}
                      product={prod}
                      selectedProducts={selectedProducts}
                      setSelectedProducts={setSelectedProducts}
                      availableProducts={availableProducts}
                      setAvailableProducts={setAvailableProducts}
                      handleShowSubmitButton={handleShowSubmitButton}
                      updateItemObject={updateItemObject}
                      handleSaleOrderItems={handleSaleOrderItems}
                    />
                  );
                })}
              {showSubmitButton && (
                <Button
                  ref={myRef}
                  type="submit"
                  onClick={handleSubmitForm}
                  w={0}
                  h={0}
                ></Button>
              )}
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={handleCloseSaleForm}
              bg={colorMode === 'light' ? 'teal.300' : 'teal.700'}
            >
              Close
            </Button>
            {showSubmitButton && (
              <Button
                onClick={handleSubmit}
                bg={colorMode === 'light' ? 'teal.300' : 'teal.700'}
              >
                Create Sale Order
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SaleForm;

function ProductComponent({
  index,
  product,
  selectedProducts,
  setSelectedProducts,
  availableProducts,
  setAvailableProducts,
  handleShowSubmitButton,
  updateItemObject,
  handleSaleOrderItems,
}) {
  const [availableSkuID, setAvailableSkuID] = useState(product.sku);
  const [selectedSkuIDs, setSelectedSkuIDs] = useState([]);

  useEffect(() => {
    setAvailableSkuID(product.sku);
  }, [product]);

  function handleUnSelectProduct() {
    const newSelectedProducts = selectedProducts.filter(
      e => e.id != product.id
    );
    setSelectedProducts(newSelectedProducts);
    const updatedAvailableProducts = [...availableProducts, product];
    updatedAvailableProducts.sort((a, b) => a.id - b.id);
    setAvailableProducts(updatedAvailableProducts);
  }

  const handleSkuIdChange = event => {
    const skuId = event.target.value;
    console.log('event.target.value ', event.target.value);
    console.log(availableSkuID);
    const selectedSkuId = availableSkuID.find(sku => sku.id == skuId);
    console.log(selectedSkuId);
    const updatedAvailableSkuIds = availableSkuID.filter(
      sku => sku.id != skuId
    );
    console.log(updatedAvailableSkuIds);
    setAvailableSkuID(updatedAvailableSkuIds);

    setSelectedSkuIDs([...selectedSkuIDs, selectedSkuId]);
  };

  useEffect(() => {
    if (selectedSkuIDs.length > 0) {
      handleShowSubmitButton(true);
    } else {
      handleShowSubmitButton(false);
    }
  }, [selectedSkuIDs]);
  // console.log('selectedSkuIDs selectedSkuIDs ', selectedSkuIDs);
  return (
    <Box
      p={2}
      mt={3}
      borderBottom="1px solid #A0AEC0"
      shadow="0px 8px 8px -2px rgba(0, 0, 0, 0.5)"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Stack spacing={3}>
          <Flex alignContent="center" gap={2} fontWeight="600">
            <Box fontSize="1.9em">{index + 1}.</Box>
            <Heading as="h4" size="lg" alignSelf="center">
              {product?.name}
            </Heading>
          </Flex>
        </Stack>

        <Flex w="60%" alignItems="center" justifyContent="flex-end">
          <Box w="85%" mr="20px">
            <FormControl
              variant="ghost"
              w="100%"
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              px="10px"
            >
              <FormLabel w="50%" fontSize="1.2em">
                Select SKU Id's
              </FormLabel>
              <Select
                w="40%"
                placeholder="Select SKU Id"
                onChange={handleSkuIdChange}
                value={selectedSkuIDs}
              >
                {availableSkuID?.map(sku => (
                  <option key={sku.id} value={sku.id}>
                    {sku.id}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
          <DeleteIcon
            boxSize={5}
            cursor="pointer"
            onClick={handleUnSelectProduct}
          />
        </Flex>
      </Flex>

      {/* displaying particular SKU ID */}
      {selectedSkuIDs.length > 0 && (
        <Table variant="striped" size="sm" mt={3}>
          <Thead>
            <Tr>
              <Th fontSize="1em" textAlign="center">
                SKU
              </Th>
              <Th fontSize="1em" textAlign="center">
                Price
              </Th>
              <Th fontSize="1em" textAlign="center">
                Quantity
              </Th>
              <Th fontSize="1em" textAlign="center">
                Total
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {selectedSkuIDs?.map((skuId, index) => {
              return (
                <SkuComponent
                  key={index}
                  index={index}
                  skuId={skuId}
                  selectedSkuIDs={selectedSkuIDs}
                  setSelectedSkuIDs={setSelectedSkuIDs}
                  availableSkuID={availableSkuID}
                  setAvailableSkuID={setAvailableSkuID}
                  updateItemObject={updateItemObject}
                  handleSaleOrderItems={handleSaleOrderItems}
                />
              );
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}

function SkuComponent({
  index,
  skuId,
  selectedSkuIDs,
  setSelectedSkuIDs,
  availableSkuID,
  setAvailableSkuID,
  updateItemObject,
  handleSaleOrderItems,
}) {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    setSubTotal(price * quantity);
  }, [price, quantity]);

  function handleUnSelectSkuId() {
    const newSelectedSkuId = selectedSkuIDs.filter(e => {
      return e.id != skuId.id;
    });
    setSelectedSkuIDs(newSelectedSkuId);
    const updatedAvailableSkuIds = [...availableSkuID, skuId];
    updatedAvailableSkuIds.sort((a, b) => a.id - b.id);
    setAvailableSkuID(updatedAvailableSkuIds);
  }

  useEffect(() => {
    if (updateItemObject) {
      const object = {
        sku_id: skuId.id,
        price: price,
        quantity: quantity,
      };
      handleSaleOrderItems(object);
    }
  }, [updateItemObject]);

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

  return (
    <Tr>
      <Td>{skuId.id}</Td>
      <Td>
        <NumberInput
          value={price}
          min={1}
          onChange={newQuantity => updatePrice(index, parseInt(newQuantity))}
          isRequired
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
          isRequired
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
        <DeleteIcon
          boxSize={5}
          cursor="pointer"
          onClick={handleUnSelectSkuId}
        />
      </Td>
    </Tr>
  );
}

// {
//    {/* <Box p={4}>
//               <Stack spacing={4}>
//                 <Button onClick={handleAddProduct}>Add Product</Button>
//                 {products.map((product, index) => (
//                   <Accordion key={index} allowToggle>
//                     <AccordionItem>
//                       <h2>
//                         <AccordionButton>
//                           <Box flex="1" textAlign="left">
//                             Product {index + 1}
//                           </Box>
//                           <Text>{/* Add total price calculation here */}</Text>
//                           </AccordionButton>
//                           </h2>
//                           <AccordionPanel pb={4}>
//                             <FormControl>
//                               <FormLabel>SKU ID</FormLabel>
//                               <Input
//                                 type="number"
//                                 value={product.sku_id}
//                                 onChange={e => {
//                                   // Logic to update SKU ID
//                                   const updatedProducts = [...products];
//                                   updatedProducts[index].sku_id = parseInt(
//                                     e.target.value
//                                   );
//                                   setProducts(updatedProducts);
//                                 }}
//                               />
//                             </FormControl>
//                             <FormControl>
//                               <FormLabel>Price</FormLabel>
//                               <Input
//                                 type="number"
//                                 value={product.price}
//                                 onChange={e => {
//                                   // Logic to update price
//                                   const updatedProducts = [...products];
//                                   updatedProducts[index].price = parseFloat(
//                                     e.target.value
//                                   );
//                                   setProducts(updatedProducts);
//                                 }}
//                               />
//                             </FormControl>
//                             <FormControl>
//                               <FormLabel>Quantity</FormLabel>
//                               <Input
//                                 type="number"
//                                 value={product.quantity}
//                                 onChange={e => {
//                                   // Logic to update quantity
//                                   const updatedProducts = [...products];
//                                   updatedProducts[index].quantity = parseInt(
//                                     e.target.value
//                                   );
//                                   setProducts(updatedProducts);
//                                 }}
//                               />
//                             </FormControl>
//                             <Button onClick={() => handleRemoveProduct(index)}>
//                               Remove Product
//                             </Button>
//                           </AccordionPanel>
//                         </AccordionItem>
//                       </Accordion>
//                     ))}
//                     <Button colorScheme="blue">Submit</Button>
//                   </Stack>
//                 </Box> */}
// }
