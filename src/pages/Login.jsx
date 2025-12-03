import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  Link,
  Icon,
  Field,
  InputGroup,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { RiLockUnlockFill, RiMailFill } from "react-icons/ri";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

import "./Login.css";
import orb1 from "../assets/orb1.png";
import queen1 from "../assets/queen1.png";
import queen2 from "../assets/queen2.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";

export default function Login() {
  const navigate = useNavigate();


  const domain = import.meta.env.VITE_AWS_DOMAIN;
  const clientId = import.meta.env.VITE_CLIENT_ID;

  const redirectUri =
    window.location.hostname === "localhost"
      ? import.meta.env.VITE_REDIRECT_LOCAL
      : import.meta.env.VITE_REDIRECT_LIVE;

  const handleCognitoLogin = () => {
    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = loginUrl;
  };

  const handleLocalLogin = () => {
    localStorage.setItem("token", "dummy-local-token");
    navigate("/");
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }} bg="white">
      {/* LEFT SIDE */}
      <div className="left-section">
        <img src={gradient1} className="bg-gradient" alt="gradient" />
        <img src={whitegradient} className="bg-whitegradient" alt="whitegradient" />
        <img src={orb1} className="orb" alt="orb" />
        <img src={queen1} className="queen queen1" alt="queen1" />
        <img src={queen2} className="queen queen2" alt="queen2" />

        <div className="text-content">
          <h3 className="top-heading">THINKMOVES</h3>
          <h1 className="bottom-heading">
            PICK UP WHERE <br /> YOU LEFT OFF
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE - Chakra UI v3 */}
      <Flex flex="1" align="center" justify="center" py={{ base: 8, md: 0 }} px={{ base: 4, md: 0 }}>
        <Box w={{ base: "100%", sm: "380px" }} maxW="400px">
          <VStack gap={6} align="stretch">
            {/* Title */}
            <Heading
              textAlign="left"
              color="black"
              textTransform="uppercase"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              fontFamily="'Clash Display', sans-serif"
            >
              Welcome Back
            </Heading>

            {/* Email Field */}
            <Field.Root required>
              <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
              <InputGroup startElement={<Icon as={RiMailFill} color="gray.400" boxSize={5} />}>
                <Input
                  placeholder="jamesandrew@gmail.com"
                  type="email"
                  size="lg"
                  borderRadius="md"
                  _focus={{
                    borderColor: "#D32C32",
                    boxShadow: "0 0 0 1px #D32C32",
                  }}
                />
              </InputGroup>
            </Field.Root>

            {/* Password Field */}
            <Box>
              <Field.Root required>
                <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
                <InputGroup startElement={<Icon as={RiLockUnlockFill} color="gray.400" boxSize={5} />}>
                  <Input
                    placeholder="••••••••••••••••••"
                    type="password"
                    size="lg"
                    borderRadius="md"
                    _focus={{
                      borderColor: "#D32C32",
                      boxShadow: "0 0 0 1px #D32C32",
                    }}
                  />
                </InputGroup>
              </Field.Root>
              <Flex justify="flex-end" mt={2}>
                <Link fontSize="sm" color="black" fontWeight="medium">
                  Forgot Password?
                </Link>
              </Flex>
            </Box>

            {/* Login Button */}
            <Button
              bg="#D32C32"
              color="white"
              size="lg"
              w="full"
              onClick={handleLocalLogin}
              _hover={{ bg: "#B82329" }}
              borderRadius="md"
              fontWeight="medium"
            >
              <HStack gap={2}>
                <Text>Login Now</Text>
                <Icon as={MdArrowForward} boxSize={5} />
              </HStack>
            </Button>

            {/* OR Text */}
            <Text fontSize="sm" color="gray.500" textAlign="center">
              OR
            </Text>

            {/* Social Login Buttons */}
            <HStack gap={3}>
              <Button
                flex="1"
                bg="black"
                color="white"
                onClick={handleCognitoLogin}
                size="lg"
                _hover={{ bg: "gray.800" }}
                borderRadius="md"
                fontWeight="medium"
              >
                <HStack gap={2}>
                  <Icon as={FaGoogle} />
                  <Text>Google</Text>
                </HStack>
              </Button>
              <Button
                flex="1"
                bg="black"
                color="white"
                size="lg"
                _hover={{ bg: "gray.800" }}
                borderRadius="md"
                fontWeight="medium"
              >
                <HStack gap={2}>
                  <Icon as={FaFacebook} />
                  <Text>Facebook</Text>
                </HStack>
              </Button>
            </HStack>

            {/* Footer */}
            <Text fontSize="xs" color="gray.600" textAlign="center" mt={4}>
              © 2025 ThinkMoves. All rights reserved.
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}