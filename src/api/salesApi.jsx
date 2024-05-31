export const fetchSalesOrders = async () => {
  const response = await fetch('http://localhost:3000/saleOrder');
  return response.json();
};

export const fetchCustomer = async ({ id }) => {
  console.log('id ', id);
  const response = await fetch(
    `http://localhost:3000/customers?customer=${id}`
  );

  console.log('response ', response);
  return response.json();
};
