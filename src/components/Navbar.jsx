import {
    Box,
    Button,
    Container,
    HStack,
    Heading,
    Link as ChakraLink,
    Flex,
    IconButton,
    Drawer,
    Portal,
    useDisclosure,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBars } from "react-icons/fa";
import { RiProfileFill } from "react-icons/ri";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { open, onOpen, onClose } = useDisclosure();
    const location = useLocation();
    const currentPath = location.pathname;
    const handleNavigate = () => {
        // localStorage.clear();
        // onClose();
        navigate("/profile");
    };
    const handleLogout = () => {
        localStorage.clear();
        onClose();
        navigate("/profile");
    };

    const NavLinks = () => {
        const links = [
            { name: "Home", to: "/" },
            { name: "Analyse", to: "/analyze" },
            { name: "Library", to: "/library" },
            { name: "About", to: "/about-us" },
        ];

        return links.map(link => (
            <ChakraLink
                as={Link}
                to={link.to}
                key={link.to}
                color={currentPath === link.to ? "#D32C32" : "gray.800"}
                fontWeight={currentPath === link.to ? "700" : "500"}
                _hover={{ color: "#D32C32", textDecoration: "none" }}
                mx={4}
                onClick={onClose}
            >
                {link.name}
            </ChakraLink>
        ));
    };


    return (
        <Box
            as="nav"
            w="100%"
            bg="white"
            boxShadow="sm"
            position="sticky"
            top="0"
            zIndex="100"
        >
            <Container maxW="container.xl" py={4}>
                <Flex justify="space-between" align="center">

                    <Heading
                        size="4xl"
                        fontFamily="'Clash Display', sans-serif"
                        background="linear-gradient(90deg, #DE252C 99.99%, #FFB5B8 100%)"
                        backgroundClip="text"
                        color="transparent"
                        fontWeight="600"
                    >
                        THINKMOVES
                    </Heading>

                    <Flex align="center" gap="40px" display={{ base: "none", md: "flex" }}>
                        <HStack spacing={8}>
                            <NavLinks />
                        </HStack>

                        {token ? (
                            <Button
                                onClick={handleNavigate}
                                bg="#D32C32"
                                color="white"
                                _hover={{ bg: "#b92027" }}
                                borderRadius="14.82px"
                                px="16px"
                                py="10px"
                                rightIcon={<FaArrowRight />}
                                border="1.65px solid #D32C32"
                                gap="10px"
                            >
                                <RiProfileFill />
                            </Button>
                        ) : (
                            <HStack spacing={4}>
                                <Button
                                    as={Link}
                                    to="/login"
                                    bg="#D32C32"
                                    color="white"
                                    _hover={{ bg: "#b92027" }}
                                    borderRadius="14.82px"
                                    px="16px"
                                    py="10px"
                                    rightIcon={<FaArrowRight />}
                                    border="1.65px solid #D32C32"
                                    gap="10px"
                                    onClick={onClose}
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/signup"
                                    bg="#D32C32"
                                    color="white"
                                    _hover={{ bg: "#b92027" }}
                                    borderRadius="14.82px"
                                    px="16px"
                                    py="10px"
                                    rightIcon={<FaArrowRight size={24} />}
                                    border="1.65px solid #D32C32"
                                    gap="10px"
                                    onClick={onClose}
                                >
                                    Signup
                                </Button>
                            </HStack>
                        )}
                    </Flex>

                    <IconButton
                        aria-label="Open Menu"

                        display={{ base: "flex", md: "none" }}
                        onClick={onOpen}
                        bg="transparent"
                        color="#D32C32"
                        _hover={{ bg: "transparent", color: "#b92027" }}
                        fontSize="22px"
                    ><FaBars /></IconButton>
                </Flex>
            </Container>

            <Drawer.Root open={open} onOpenChange={onClose}>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>Menu</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <Flex direction="column" gap={4}>
                                    <NavLinks />
                                    {token ? (
                                        <Button
                                            onClick={handleLogout}
                                            bg="#D32C32"
                                            color="white"
                                            _hover={{ bg: "#b92027" }}
                                            borderRadius="14.82px"
                                            px="16px"
                                            py="10px"
                                            border="1.65px solid #D32C32"
                                            gap="10px"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                as={Link}
                                                to="/login"
                                                bg="#D32C32"
                                                color="white"
                                                _hover={{ bg: "#b92027" }}
                                                borderRadius="14.82px"
                                                px="16px"
                                                py="10px"
                                                border="1.65px solid #D32C32"
                                                gap="10px"
                                                onClick={onClose}
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                as={Link}
                                                to="/signup"
                                                bg="#D32C32"
                                                color="white"
                                                _hover={{ bg: "#b92027" }}
                                                borderRadius="14.82px"
                                                px="16px"
                                                py="10px"
                                                border="1.65px solid #D32C32"
                                                gap="10px"
                                                onClick={onClose}
                                            >
                                                Signup
                                            </Button>
                                        </>
                                    )}
                                </Flex>
                            </Drawer.Body>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </Box>
    );
}
