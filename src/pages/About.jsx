import React from 'react'
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import story1 from "../assets/story1.svg";
import story2 from "../assets/story2.svg";
import story3 from "../assets/story3.svg";
import board from "../assets/chessBoard.jpg";

import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
import { Box, Button, Container, Flex, Heading, Icon, Image, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import './About.css' // import CSS file
import { FiArrowRight, FiBarChart2, FiCamera, FiCpu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate()
    return (
        <>
            <Box position="relative" bg="#000" color="white" overflow="hidden" w="100%" mb={8}>
                {[
                    { src: gradient, right: "-15%", top: "-55%" },
                    { src: gradient1, left: "-20%", top: "-75%" },
                    { src: whitegradient1, right: "-20%", top: "-130%" },
                    { src: whitegradient, left: "-20%", top: "-130%" },

                ].map((bg, i) => (
                    <Box
                        key={i}
                        position="absolute"
                        {...bg}
                        width={{ base: "100%", md: "600px", lg: "800px" }}
                        height={{ base: "200px", md: "600px", lg: "1000px" }}
                        zIndex="1"
                    >
                        <Image src={bg.src} alt="bg" w="100%" h="100%" objectFit="contain" />
                    </Box>
                ))}


                <Box
                    position="absolute"
                    right="-50px"
                    top="20%"
                    w={{ base: "120px", md: "180px", lg: "200px" }}
                    h={{ base: "120px", md: "180px", lg: "200px" }}
                    zIndex="0"
                >
                    <Image src={orb1} alt="orb" w="100%" h="100%" objectFit="contain" />
                </Box>
                <Box
                    position="absolute"
                    left="-70px"
                    top="20%"
                    transform="rotate(180deg)"
                    w={{ base: "120px", md: "180px", lg: "200px" }}
                    h={{ base: "120px", md: "180px", lg: "200px" }}
                    zIndex="0"
                >
                    <Image src={orb1} alt="orb" w="100%" h="100%" objectFit="contain" />
                </Box>
                <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={32}>
                    <div className="about-heading">
                        <h1 className="about-title">ABOUT</h1>
                        <h1 className="about-gradient">THINKMOVES</h1>
                    </div>
                </Container>
            </Box>


            <Container maxW="container.xl" px={{ base: 4, md: 8 }} >
                <Box bg="white" px={{ base: 6, md: 16, lg: 0 }} py={{ base: 12, md: 24, lg: 12 }}>
                    <Flex
                        align="stretch" 
                        direction={{ base: "column-reverse", md: "row" }}
                        justify="space-between"
                        gap={12}
                        mx="auto"
                    >

                        <Box flex="1" display="flex" alignItems="stretch">
                            <Image
                                src={board}
                                alt="Chess board"
                                borderRadius="xl"
                                boxShadow="lg"
                                w="100%"
                                h="100%" 
                                objectFit="cover"
                            />
                        </Box>
                        
                        <VStack
                            align="start"
                            justify="center"
                            spacing={5}
                            flex="1"
                            maxW={{ base: "100%", md: "50%" }}
                        >
                            <Text fontSize="md" color="black" textTransform="uppercase" fontWeight={600}>
                                <Text as="span" color="red" fontSize={"18px"}>●</Text> About
                            </Text>

                            <Text
                                as="span"
                                fontSize={{ base: "2xl", md: "4xl", lg: "7xl" }}

                                fontFamily="'Clash Display', sans-serif"
                                color={"black"}
                                fontWeight="semibold"
                                letterSpacing={-1}
                                lineHeight={"72px"}
                            >
                                Learn from Every Move <br />
                                <Text
                                    as="span"
                                    color="#D32C32"
                                    fontSize={{ base: "2xl", md: "4xl", lg: "7xl" }}
                                    fontWeight="semibold"
                                    letterSpacing={-1}
                                    lineHeight={"0px"}
                                >
                                    The Story of ThinkMoves
                                </Text>
                            </Text>



                            <Text fontSize="md" color="gray.600">
                                ThinkMoves is built for chess lovers who aim to grow with every
                                move. Explore our journey of strategy, discipline, and creative
                                thinking.
                            </Text>

                            <Button colorScheme="red" size="lg" borderRadius="full">
                                Read More
                            </Button>
                        </VStack>



                    </Flex>
                </Box>
            </Container>

            <Box position="relative" bg="#000" color="white" overflow="hidden" w="100%">
                {[
                    { src: gradient, right: "-20%", top: "-30%" },


                    { src: whitegradient, left: "-20%", top: "-40%" },

                ].map((bg, i) => (
                    <Box
                        key={i}
                        position="absolute"
                        {...bg}
                        width={{ base: "100%", md: "600px", lg: "800px" }}
                        height={{ base: "200px", md: "600px", lg: "1000px" }}
                        zIndex="1"
                    >
                        <Image src={bg.src} alt="bg" w="100%" h="100%" objectFit="contain" />
                    </Box>
                ))}



                <Container maxW="container.xl" px={{ base: 4, md: 8 }} >
                    <Box
                        position="relative"
                        zIndex="2"

                        mx="auto"
                        py={{ base: 16, md: 24 }}

                    >
                        {/* 2-Column Layout */}
                        <Box
                            display="grid"
                            gridTemplateColumns={{ base: "1fr", md: "40% 60%" }}
                            alignItems="start"
                            gap={6}
                            mb={12}
                        >
                            {/* LEFT COLUMN */}
                            <Box>
                                <Text
                                    fontSize="lg"
                                    letterSpacing="2px"
                                    textTransform="uppercase"
                                    fontFamily="'Clash Display', sans-serif"
                                    color="red.400"
                                    mb={4}
                                    fontWeight={"semibold"}
                                >
                                    <Text as="span" color="red" fontSize={"18px"}>●</Text> OUR STORY
                                </Text>
                            </Box>

                            {/* RIGHT COLUMN */}
                            <Box>
                                <Text

                                    fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}
                                    fontWeight="600"
                                    fontFamily="'Clash Display', sans-serif"
                                    mb={6}
                                    lineHeight="short"
                                >
                                    TELL THE STORY BEHIND <br />
                                    <Text as="span" color="#D32C32">
                                        THE PLATFORM
                                    </Text>
                                </Text>

                                <Text
                                    fontSize={{ base: "sm", md: "md" }}
                                    color="#FFFFFF"
                                    maxW="2xl"
                                >
                                    Born from a passion for chess and artificial intelligence, ThinkMoves
                                    began as a simple idea: make it easy for players to digitize and
                                    analyze their handwritten chess scoresheets. Today, it’s an
                                    intelligent companion that helps you see your mistakes, celebrate your
                                    best moves, and share your progress with others.
                                </Text>
                            </Box>
                        </Box>

                        {/* 3 Feature Boxes */}
                        <Box
                            display="grid"
                            gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                            gap={6}
                        >
                            {[
                                {
                                    number: "01",
                                    title: "AI THAT UNDERSTANDS YOUR STYLE",
                                    img: story1
                                },
                                {
                                    number: "02",
                                    title: "BUILT FOR EVERYDAY PLAYERS AND COACHES ALIKE",
                                    img: story2
                                },
                                {
                                    number: "03",
                                    title: "A GROWING GLOBAL COMMUNITY OF LEARNERS",
                                    img: story3
                                },
                            ].map((item, i) => (



                                <Box
                                    key={item?.number}
                                    borderRadius="10px 10px 0 0" // top corners rounded
                                    border="2px solid rgba(255,255,255,0.3)" // optional border
                                    overflow="hidden" // ensures background respects border radius
                                    bg="linear-gradient(331.39deg, rgba(0,0,0,0) -1.53%, rgba(255,255,255,0.17) 81.73%)"
                                    py={10}
                                    px={6}
                                    textAlign="left"
                                    transition="all 0.3s"
                                    _hover={{ transform: "translateY(-4px)" }}
                                >
                                    <Flex gap={8}>
                                        <VStack>
                                            <Text fontSize="lg" fontWeight="bold" color="red.400" mb={3}>
                                                {item.number}
                                            </Text>
                                            <Box w={"80px"}><Image src={item.img} w={"80px"} height={"80px"} /></Box>

                                        </VStack>
                                        <Text fontSize="lg" fontWeight="semibold" lineHeight="short" fontFamily="'Clash Display', sans-serif" w={"50%"}>
                                            {item.title}
                                        </Text>
                                    </Flex>
                                </Box>




                            ))}
                        </Box>
                    </Box>
                </Container>



                {/* ---------- Section 3: Books & Merch ---------- */}

            </Box>



            <Box bg="gray.50" py={{ base: 16, md: 24 }} px={{ base: 6, md: 16 }}>
                <Container maxW="container.xl">
                    <div className="about-heading-3rd">
                        <h1 className="about-title">BOOKS &</h1>
                        <h1 className="about-gradient">MERCHS</h1>
                    </div>

                    <VStack spacing={12} textAlign="center" align="center" w="full" mt={8}>
                        <Flex justify="center" w="full" px={{ base: 0, md: 4 }}>
                            <Box
                                bg="white"
                                borderRadius={{ base: "none", md: "2xl" }}
                                boxShadow={{ base: "none", md: "xl" }}
                                p={{ base: 4, sm: 6, md: 12 }}
                                w="full"
                                maxW="4xl"
                                position="relative"
                                overflow="hidden"
                            >

                                <Box
                                    position="absolute"
                                    top="0%"
                                    right="-10%"
                                    width="300px"
                                    height="300px"
                                    bg="red"
                                    borderRadius="full"
                                    filter="blur(80px)"
                                    opacity="0.1"
                                    zIndex="0"
                                />
                                <Box
                                    position="absolute"
                                    top="50%"
                                    left="-10%"
                                    width="300px"
                                    height="300px"
                                    bg="red"
                                    borderRadius="full"
                                    filter="blur(80px)"
                                    opacity="0.1"
                                    zIndex="0"
                                />

                                <VStack spacing={6} align="stretch" position="relative" zIndex="1">
                                    <Flex align="start" gap={4}>
                                        <Box flex="1">
                                            <Heading
                                                size={{ base: "md", md: "lg" }}
                                                color="gray.800"
                                                mb={2}
                                            >
                                                ThinkMoves Books & Scorebooks
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                Interest Form - Help us decide what to print first
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <Box h="1px" bg="gray.200" />

                                    <Box mx={{ base: -4, sm: -6, md: 0 }}>
                                        <Box
                                            as="iframe"
                                            src="https://forms.gle/aC6RX7K5szCqDZVw5 "
                                            width="100%"
                                            height={{ base: "600px", md: "800px" }}
                                            borderRadius={{ base: "none", md: "lg" }}
                                            border="none"
                                        />
                                    </Box>

                                    <Text
                                        color="gray.500"
                                        fontSize="sm"
                                        textAlign="center"
                                        fontStyle="italic"
                                    >
                                        Thank you for helping shape the first batch of ThinkMoves books & merch! 🎉
                                    </Text>
                                </VStack>
                            </Box>
                        </Flex>
                    </VStack>
                </Container>
            </Box>

            <Box py={20}>
                <Container >
                    {/* ---------------------- SECTION 1: HOW IT WORKS ---------------------- */}
                    <VStack spacing={12} align="stretch">
                        <Box textAlign="start">

                            <Heading size="5xl" fontWeight="700" color={"#D32C32"}>
                                How ThinkMoves Works
                            </Heading>
                        </Box>

                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} my={4}>
                            {/* Step 1 */}
                            <Box
                                p={8}
                                borderRadius="xl"
                                bg={"gray.50"}
                                border="1px solid"
                                borderColor={"#18181b1a"}
                                _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
                                transition="0.2s"
                                boxShadow={"0px 16px 24px #18181b1a"}
                            >
                                <VStack align="start" spacing={4}>
                                    <Icon as={FiCamera} boxSize={10} color="#D32C32" />
                                    <Heading size="md">1. Scan your scoresheet</Heading>
                                    <Text fontSize="md" color="gray.600">
                                        After your game, take a clear photo of your scoresheet and
                                        upload it to the ThinkMoves website.
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Step 2 */}
                            <Box
                                p={8}
                                borderRadius="xl"
                                bg={"gray.50"}
                                border="1px solid"
                                borderColor={"#18181b1a"}
                                _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
                                transition="0.2s"
                                boxShadow={"0px 16px 24px #18181b1a"}
                            >
                                <VStack align="start" spacing={4}>
                                    <Icon as={FiCpu} boxSize={10} color="#D32C32" />
                                    <Heading size="md">2. Digitize your game</Heading>
                                    <Text fontSize="md" color="gray.600">
                                        Our AI reads the handwritten moves from your scoresheet and
                                        rebuilds the full game on a digital board so you can save,
                                        share, and revisit anytime.
                                    </Text>
                                </VStack>
                            </Box>

                            {/* Step 3 */}
                            <Box
                                p={8}
                                borderRadius="xl"
                                bg={"gray.50"}
                                border="1px solid"
                                borderColor={"#18181b1a"}
                                _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
                                transition="0.2s"
                                boxShadow={"0px 16px 24px #18181b1a"}
                            >
                                <VStack align="start" spacing={4}>
                                    <Icon as={FiBarChart2} boxSize={10} color="#D32C32" />
                                    <Heading size="md">3. Study with Deep Analyze</Heading>
                                    <Text fontSize="md" color="gray.600">
                                        Fix any wrong moves, then run Deep Analyze with Stockfish 17.1
                                        (up to depth 15) to uncover mistakes, blunders, and stronger
                                        ideas. More analysis depth coming soon.
                                    </Text>
                                </VStack>
                            </Box>
                        </SimpleGrid>


                        <Box >
                            <Heading size="4xl" mb={4}>
                                Why I Started ThinkMoves
                            </Heading>

                            <Text fontSize="md" color="gray.700" lineHeight="1.8">
                                My name is{" "}
                                <Link
                                    href="https://ashaykargaonkar.com/"
                                    color="#D32C32"
                                    isExternal
                                    fontWeight="600"
                                >
                                    Ashay Kargaonkar
                                </Link>
                                , and I’m the founder of ThinkMoves. I started playing
                                over-the-board tournaments about two years ago and quickly
                                realized that all my games were stuck on paper. After every event,
                                I would manually enter moves into chess.com and try to analyze
                                alone — slow, boring, and honestly still confusing.
                                <br />
                                <br />
                                Over time, I ended up with a stack of unread scoresheets.
                                ThinkMoves is the tool I wanted back then: scan the sheet once,
                                turn it into a clean digital game, run analysis, and actually
                                learn from every move. I built it for myself first — and now I
                                hope it helps many other chess players too.
                            </Text>
                        </Box>

                        <Box >
                            <Heading size="4xl" mb={4}>
                                What’s Next for ThinkMoves
                            </Heading>

                            <VStack align="start" spacing={4}>
                                <Text color="gray.700" fontSize="md" lineHeight="1.8">
                                    ThinkMoves is just getting started. Over the next months, I’m
                                    planning to:
                                </Text>

                                <Text color="gray.700" fontSize="md">
                                    • Support more scoresheets and languages
                                </Text>

                                <Text color="gray.700" fontSize="md">
                                    • Go deeper with analysis — higher Stockfish depth, richer stats, and clearer summaries
                                </Text>

                                <Text color="gray.700" fontSize="md">
                                    • Offer scorebooks and printable sheets
                                </Text>

                                <Text color="gray.700" fontSize="md">
                                    • Add a coach-like chatbot for simple explanations
                                </Text>

                                <Box mt={4}>
                                    <Button
                                        colorScheme="red"
                                        size="md"
                                        rightIcon={<FiArrowRight />}
                                        borderRadius="xl"
                                        onClick={() => navigate("/feedback")}
                                    >
                                        Share Feedback
                                    </Button>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </>
    )
}

export default About
