import React, { useLayoutEffect, useState } from 'react';
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
// import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const login = localStorage.getItem('login');
    if (login == true) navigate('/');
  }, []);

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
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters.';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email is not valid.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.retypePassword) {
      newErrors.retypePassword = 'Passwords do not match.';
    }

    //check local data
    if (Object.keys(newErrors).length === 0 && localStorage.getItem('users')) {
      const users = JSON.parse(localStorage.getItem('users'));
      console.log(users);
      const isUser = users.find(e => {
        return e.username === formData.username;
      });
      const isEmail = users.find(e => {
        return e.email === formData.email;
      });

      if (isUser) newErrors.username = 'Username is not available';
      if (isEmail) newErrors.email = 'Email Id already exist';
    }

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      const localData = localStorage.getItem('user') || [];
      const data = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      localData.push(data);
      localStorage.setItem('users', JSON.stringify(localData));

      setFormData({
        username: '',
        email: '',
        password: '',
        retypePassword: '',
      });

      console.log('redirecting to dashboard');
      localStorage.setItem('login', true);
      navigate('/');
    }
  };

  const isValidEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <Box maxW="400px" mx="auto" mt="20" p="4">
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          <FormControl mt={4} isInvalid={errors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <Alert status="error">
                <AlertIcon />
                {errors.username}
              </Alert>
            )}
          </FormControl>
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
          <FormControl mt={4} isInvalid={errors.retypePassword}>
            <FormLabel htmlFor="retypePassword">Retype Password</FormLabel>
            <Input
              type="password"
              id="retypePassword"
              name="retypePassword"
              placeholder="Retype your password"
              value={formData.retypePassword}
              onChange={handleChange}
            />
            {errors.retypePassword && (
              <Alert status="error">
                <AlertIcon />
                {errors.retypePassword}
              </Alert>
            )}
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">
            Sign Up
          </Button>
        </Stack>
      </form>
      <Text mt={4}>
        If you already have an account,
        <Link
          color="blue.500"
          ml={1}
          _hover={{ color: 'blue.700', textDecoration: 'underline' }}
          href="/login"
        >
          Login here
        </Link>
      </Text>
    </Box>
  );
};

export default Signup;
