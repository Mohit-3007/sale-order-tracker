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
} from '@chakra-ui/react';
import { useState } from 'react';


const SaleForm = ({ isOpen, onClose }) => {

    
    const [products, setProducts] = useState([
        { sku_id: 220, price: 12, quantity: 12 },
        // Add more initial products if needed
      ]);
    
      const handleAddProduct = () => {
        // Logic to add a new product to the form
        // For simplicity, let's just add a new empty product
        setProducts([...products, { sku_id: null, price: 0, quantity: 0 }]);
      };
    
      const handleRemoveProduct = (index) => {
        // Logic to remove a product from the form
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
      };


  return (
    <>
      <Modal 
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior='inside'
    >
        <ModalOverlay />
        <ModalContent maxWidth='800px' height='400px'>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={4}>
      <Stack spacing={4}>
        <Button onClick={handleAddProduct}>Add Product</Button>
        {products.map((product, index) => (
          <Accordion key={index} allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Product {index + 1}
                  </Box>
                  <Text>{/* Add total price calculation here */}</Text>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <FormControl>
                  <FormLabel>SKU ID</FormLabel>
                  <Input
                    type="number"
                    value={product.sku_id}
                    onChange={(e) => {
                      // Logic to update SKU ID
                      const updatedProducts = [...products];
                      updatedProducts[index].sku_id = parseInt(e.target.value);
                      setProducts(updatedProducts);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    value={product.price}
                    onChange={(e) => {
                      // Logic to update price
                      const updatedProducts = [...products];
                      updatedProducts[index].price = parseFloat(e.target.value);
                      setProducts(updatedProducts);
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      // Logic to update quantity
                      const updatedProducts = [...products];
                      updatedProducts[index].quantity = parseInt(e.target.value);
                      setProducts(updatedProducts);
                    }}
                  />
                </FormControl>
                <Button onClick={() => handleRemoveProduct(index)}>Remove Product</Button>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ))}
        <Button colorScheme="blue">Submit</Button>
      </Stack>
    </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SaleForm;
