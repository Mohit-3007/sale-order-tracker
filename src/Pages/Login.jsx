import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  Alert,
  AlertIcon,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setErrors({
      ...errors,
      [name]: '',
    });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newErrors = {};
    // Validation logic
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email is not valid.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    //check local data for authentication
    if (Object.keys(newErrors).length === 0 && localStorage.getItem('users')) {
      const users = JSON.parse(localStorage.getItem('users'));
      const isUser = users.find(e => {
        return e.email === formData.email;
      });

      if (!isUser) {
        setFormData({
          email: '',
          password: '',
        });
        newErrors.email = "User doesn't exist or email doesn't exist";
      } else {
        if (isUser.password != formData.password) {
          setFormData({
            password: '',
          });
          newErrors.password = 'Password is incorrect.';
        }
      }
    }
    setErrors(newErrors);

    // If there are no errors, proceed with login
    if (Object.keys(newErrors).length === 0) {
    //   console.log(formData);
      //   const localData = localStorage.getItem('user') || [];
      //   const data = {
      //     username: formData.username,
      //     email: formData.email,
      //     password: formData.password,
      //   };
      //   localData.push(data);
      //   localStorage.setItem('users', JSON.stringify(localData));
      setFormData({
        email: '',
        password: '',
      });

      console.log('redirecting to dashboard');
      navigate('/');
    }
  };

  const isValidEmail = email => {
    // Basic email validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <Box maxW="400px" mx="auto" mt="20" p="4">
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <FormControl mt={4} isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <Alert status="error">
                <AlertIcon />
                {errors.email}
              </Alert>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <Alert status="error">
                <AlertIcon />
                {errors.password}
              </Alert>
            )}
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">
            Login
          </Button>
        </Stack>
      </form>
      <Text mt={4}>
        If you don't have an account,
        <Link
          color="blue.500"
          ml={1}
          _hover={{ color: 'blue.700', textDecoration: 'underline' }}
          href="/signup"
        >
          Sign Up here
        </Link>
      </Text>
    </Box>
  );
};

export default Login;
