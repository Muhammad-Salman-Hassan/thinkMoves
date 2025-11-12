import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Field,
  InputGroup,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RiLockUnlockFill, RiMailAiFill } from "react-icons/ri";

import "./Login.css"; // import CSS
import orb1 from "../assets/orb1.png";
import queen1 from "../assets/queen1.png";
import queen2 from "../assets/queen2.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";

export default function Login() {
  const navigate = useNavigate();

  const domain = "https://us-east-1nsigylqjx.auth.us-east-1.amazoncognito.com";
  const clientId = "7bn490vsh2qg3qkk3ka75r8qht";
  const redirectUri =
    window.location.hostname === "localhost"
      ? "http://localhost:3000/callback"
      : "https://thinkmovesui.vercel.app/callback";

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
      {/* LEFT SIDE (HTML + CSS) */}
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

      {/* RIGHT SIDE (Chakra UI) */}
      <Flex flex="1" align="center" justify="center" py={{ base: 8, md: 0 }} px={{ base: 4, md: 0 }}>
        <Box w={{ base: "100%", sm: "xs", md: "sm", lg: "md" }} p={{ base: 6, md: 8 }} borderRadius="lg">
          <Heading
            textAlign={{ base: "center", md: "center" }}
            mb={6}
            color="black"
            textTransform="uppercase"
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontFamily="'Clash Display', sans-serif"
          >
            Welcome Back
          </Heading>

          <VStack spacing={5} align="stretch">
            <Field.Root required>
              <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
              <InputGroup startElement={<Icon as={RiMailAiFill} color="gray.400" boxSize={5} />}>
                <Input placeholder="Enter your email" type="email" />
              </InputGroup>
              <Field.HelperText fontSize="xs">We'll never share your email.</Field.HelperText>
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password <Field.RequiredIndicator /></Field.Label>
              <InputGroup startElement={<Icon as={RiLockUnlockFill} color="gray.400" boxSize={5} />}>
                <Input placeholder="Enter your password" type="password" />
              </InputGroup>
            </Field.Root>

            <Button colorScheme="blue" w="full" onClick={handleLocalLogin} size="lg">
              Login Now
            </Button>

            <Text color="gray.500" textAlign="center" fontSize="sm">
              or
            </Text>

            <Button colorScheme="teal" w="full" onClick={handleCognitoLogin} size="lg">
              Login with Google
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
