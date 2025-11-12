import React from 'react'
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import story1 from "../assets/story1.svg";
import story2 from "../assets/story2.svg";
import story3 from "../assets/story3.svg";

import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
import { Box, Container, Flex, Heading, Image, Text, VStack } from '@chakra-ui/react'
import './About.css' // import CSS file

const About = () => {
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
                                        <Text fontSize="lg" fontWeight="semibold" lineHeight="short"  fontFamily="'Clash Display', sans-serif" w={"50%"}>
                                            {item.title}
                                        </Text>
                                    </Flex>
                                </Box>




                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default About
