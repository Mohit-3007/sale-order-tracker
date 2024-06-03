export const fetchSalesOrders = async () => {
  const response = await fetch('http://localhost:3000/saleOrder');
  console.log('fetchSalesOrders response ', response);
  return response.json();
};

export const fetchAllProducts = async () => {
  const response = await fetch('http://localhost:3000/product');
  return response.json();
};

export const fetchAllCustomers = async () => {
  const response = await fetch('http://localhost:3000/customers');
  return response.json();
};

export const fetchCustomer = async ({ id }) => {
  const response = await fetch(
    `http://localhost:3000/customers?customer=${id}`
  );

  // console.log('response ', response);
  return response.json();
};

export const createSale = async saleObj => {
  const response = await fetch(`http://localhost:3000/saleOrder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saleObj),
  });
  return response.json();
};

export const updateOrder = async ({ dataa }) => {
  console.log('API for Payment update ', dataa);
  const response = await fetch(`http://localhost:3000/saleOrder/${dataa.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataa),
  });
  // console.log('updation response ', response);

  return response.json();
};

export const updatePayment = async ({ dataa }) => {
  console.log('order for update ', dataa.id);
  const response = await fetch(`http://localhost:3000/saleOrder/${dataa.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataa),
  });
  // console.log('updation response ', response);
  return response.json();
};
