import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleSuccess = (response) => {
    localStorage.setItem("token", response.credential);
    navigate("/");
  };

  return (
    <Flex minH="100vh">
      {/* Left Side */}
      <Box flex="1" bg="black" display={{ base: "none", md: "flex" }} alignItems="center" justifyContent="center">
        <Image src="https://via.placeholder.com/500x500?text=Think+Moves" alt="Chess Illustration" />
      </Box>

      {/* Right Side */}
      <Flex flex="1" align="center" justify="center" bg="white">
        <Box w="sm" p={8} boxShadow="lg" borderRadius="lg">
          <Heading textAlign="center" mb={6} color="brand.500">
            Login
          </Heading>

          <VStack spacing={4}>
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
            <Button colorScheme="red" w="full">
              Login
            </Button>
            <Text color="gray.500">or</Text>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Login Failed")} />
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
