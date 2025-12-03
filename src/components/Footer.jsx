import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    HStack,
    VStack,
    Link,
    IconButton,
} from "@chakra-ui/react";
import {
    FaYoutube,
    FaLinkedinIn,
    FaInstagram,
    FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Box
            position="relative"
            bg="#000"
            color="white"
            overflowX="hidden" // ✅ prevents horizontal scroll
            overflowY="hidden"
            py={{ base: 20, md: 40 }}
            w="100%"
            borderTopLeftRadius={"20px"}
            borderTopRightRadius={"20px"}
            mt={10}
        >
            {/* 🔥 Blurred red background shapes */}
            <Box
                position="absolute"
                left="0"
                top="50%"
                transform="translateY(-60%) rotate(-15deg)"
                width={{ base: "100%", md: "400px" }}
                height={{ base: "300px", md: "400px" }}
                bg="#E30004"
                filter="blur(250px)"
                opacity={0.7}
                zIndex="1"
            />
            <Box
                position="absolute"
                right="0"
                top="50%"
                transform="translateY(-50%) rotate(15deg)"
                width={{ base: "100%", md: "400px" }}
                height={{ base: "300px", md: "400px" }}
                bg="#E30004"
                filter="blur(250px)"
                opacity={0.7}
                zIndex="1"
            />

            {/* ⚫ Main Footer Content */}
            <Container maxW="container.xl" position="relative" zIndex="2" px={{ base: 6, md: 12 }}>
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="flex-start"
                    wrap="wrap"
                    gap={10}
                    pb={10}
                >
                    {/* 🧠 Left Section */}
                    <VStack align="flex-start" maxW="320px" spacing={4}>
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
                        <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                            ThinkMoves helps players understand their chess journey — one move
                            at a time. Upload your scoresheets, get instant AI-powered
                            insights, and grow your strategy. Built by chess lovers, for chess
                            lovers.
                        </Text>

                        <HStack spacing={4} pt={2}>
                            {/* <IconButton
                                as="a"
                                href="#"
                                aria-label="Facebook"

                                bg="#E30004"
                                color="white"
                                borderRadius="full"
                                _hover={{ bg: "#c10002" }}
                            >
                                <FaFacebookF />
                            </IconButton> */}
                            <IconButton
                                as="a"
                                href=" https://www.linkedin.com/company/thinkmoves/"
                                aria-label="LinkedIn"

                                bg="#1a1a1a86"
                                color="white"
                                borderRadius="full"
                                _hover={{ bg: "#E30004" }}
                                borderColor={"#e3000434"}
                            >
                                <FaLinkedinIn />
                            </IconButton>
                            <IconButton
                                as="a"
                                href="https://www.instagram.com/thinkmoves?utm_source=qr&igsh=azJ1cTN1bW1qbDE3"
                                aria-label="Instagram"

                                bg="#1a1a1a86"
                                color="white"
                                borderRadius="full"
                                _hover={{ bg: "#E30004" }}
                                borderColor={"#e3000434"}
                            >
                                <FaInstagram />
                            </IconButton>
                            <IconButton
                                as="a"
                                href="https://www.youtube.com/@Official-ThinkMoves"
                                aria-label="Instagram"

                                bg="#1a1a1a86"
                                color="white"
                                borderRadius="full"
                                _hover={{ bg: "#E30004" }}
                                borderColor={"#e3000434"}
                            >
                                <FaYoutube />
                            </IconButton>
                        </HStack>
                    </VStack>

                    {/* 🔗 Middle Section - Links */}
                    <Flex

                        flex="1"
                        maxW="700px"
                        wrap="wrap"
                        gap={20}
                    >
                        <VStack align="flex-start" spacing={3}>
                            <Heading size="sm" fontWeight="600" mb={2}>
                                Resources
                            </Heading>
                            <Link href="/about-us" color="gray.300">About</Link>

                            <Link href="/library" color="gray.300">Library</Link>

                            <Link href="/feedback" color="gray.300">Feed Back</Link>
                        </VStack>

                        {/* <VStack align="flex-start" spacing={3}>
                            <Heading size="sm" fontWeight="600" mb={2}>
                                Our Services
                            </Heading>
                            <Link href="#" color="gray.300">Opening Mastery Guide</Link>
                            <Link href="#" color="gray.300">ThinkMoves T-Shirt</Link>
                            <Link href="#" color="gray.300">Mastering Middlegames</Link>
                        </VStack> */}

                        <VStack align="flex-start" spacing={3}>
                            <Heading size="sm" fontWeight="600" mb={2}>
                                Contact Us
                            </Heading>

                            <Link href="mailto:info@thinkmoves.com" color="gray.300">
                                info@thinkmoves.com
                            </Link>

                        </VStack>
                    </Flex>
                </Flex>

                {/* 🧱 Divider Line with Gradient */}
                <Box
                    borderTop="1.05px solid"
                    borderImage="linear-gradient(90deg, rgba(255,255,255,0) 1.56%, #FFFFFF 10.94%, #FFFFFF 91.15%, rgba(255,255,255,0) 100%) 1"
                    mt={10}
                    pt={4}
                />

                {/* Bottom Row */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    py={4}
                    color="gray.400"
                    fontSize="sm"
                    gap={4}
                >
                    <Text>© 2025 All Rights Reserved</Text>
                    <HStack spacing={6}>
                        <Link href="#" color={"white"}>Privacy policy</Link>
                        <Link href="#" color={"white"}>Terms & conditions</Link>
                        <Flex align="center" gap={2} cursor="pointer" onClick={scrollToTop}>
                            <Text>Back to top</Text>
                            <IconButton

                                aria-label="Back to top"
                                bg="#E30004"
                                color="white"
                                size="sm"
                                borderRadius="full"
                                _hover={{ bg: "#c10002" }}
                            >
                                <FaArrowUp />
                            </IconButton>
                        </Flex>
                    </HStack>
                </Flex>
            </Container>

            {/* ⚡ Background Big Text */}
            <Box
                position="absolute"
                bottom="-100px"
                left="0"
                w="100%"
                textAlign="center"
                fontSize={{ base: "80px", md: "200px" }}
                fontWeight="600"
                fontFamily="'Clash Display', sans-serif"
                color="rgba(255, 255, 255, 0.07)"
                zIndex="0"
                pointerEvents="none"
                whiteSpace="nowrap"
                overflow="hidden"
            >
                THINKMOVES
            </Box>
        </Box>
    );
}
