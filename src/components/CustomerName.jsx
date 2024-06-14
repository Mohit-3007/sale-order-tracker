import React from 'react';
import { fetchCustomer } from '../api/salesApi';
import { useQuery } from 'react-query';

export const CustomerName = ({ id }) => {
  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomer({ id }),
  });
  return (
    <div style={{ display: 'inline' }}>
      {customer && customer[0]?.customer_profile?.name}
    </div>
  );
};
