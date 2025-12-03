import React from 'react';
import { Box, Container, VStack, HStack, Text, Heading, Image } from '@chakra-ui/react';
import { FaFileUpload, FaChessKnight, FaTags, FaGamepad, FaSave, FaShareAlt } from 'react-icons/fa';
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";

const FeatureCard = ({ icon: Icon, title, description, position, numberPosition }) => {
  const isLeft = position === 'left';

  return (
    <Box position="relative" width="full">
     
      <HStack
        spacing={0}
        align="center"
        justify={isLeft ? 'flex-start' : 'flex-end'}
        position="relative"
        display={{ base: 'none', md: 'flex' }}
      >
        <Box>
          <Box
            bg="red"
            color="white"
            borderRadius="full"
            width="60px"
            height="60px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
            fontWeight="bold"
            position="relative"
            zIndex={3}
            mb={4}
          >
            {numberPosition}
          </Box>
          <Box
            bg="white"
            borderRadius="2xl"
            p={6}
            shadow="lg"
            width={{ base: '280px', md: '320px' }}
            position="relative"
            zIndex={2}
            order={isLeft ? 1 : 3}
          >
            <VStack align="flex-start" spacing={3}>
              <Box fontSize="3xl" color="black">
                <Icon />
              </Box>
              <Heading size="sm" fontWeight="bold" textTransform="uppercase" color="black">
                {title}
              </Heading>
              <Text fontSize="sm" color="gray.600" lineHeight="1.6">
                {description}
              </Text>
            </VStack>
          </Box>
        </Box>
      </HStack>

      
      <VStack
        spacing={0}
        align="center"
        justify="center"
        position="relative"
        display={{ base: 'flex', md: 'none' }}
      >
        <Box
          bg="red"
          color="white"
          borderRadius="full"
          width="50px"
          height="50px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xl"
          fontWeight="bold"
          position="relative"
          zIndex={3}
          mb={4}
        >
          {numberPosition}
        </Box>
        <Box
          bg="white"
          borderRadius="2xl"
          p={5}
          shadow="lg"
          width="90%"
          maxW="320px"
          position="relative"
          zIndex={2}
        >
          <VStack align="flex-start" spacing={3}>
            <Box fontSize="2xl" color="black">
              <Icon />
            </Box>
            <Heading size="sm" fontWeight="bold" textTransform="uppercase" color="black">
              {title}
            </Heading>
            <Text fontSize="sm" color="gray.600" lineHeight="1.6">
              {description}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default function GameFeaturesSection() {
  const features = [
    {
      icon: FaFileUpload,
      title: 'UPLOAD SHEET',
      description: `Upload a clear photo or scanned scoresheet, and we'll convert it into a digital game instantly.`,
      position: 'right',
      number: 1
    },
    {
      icon: FaChessKnight,
      title: 'AI EXTRACTS MOVES',
      description: 'Our advanced OCR + chess engine automatically extracts moves, metadata, and event details.',
      position: 'left',
      number: 2
    },
    {
      icon: FaTags,
      title: 'FIX MISTAKES',
      description: 'Easily correct any OCR or notation errors using a clean, intuitive editor.',
      position: 'right',
      number: 3
    },
    {
      icon: FaGamepad,
      title: 'REVIVE YOUR GAME',
      description: 'Rebuild the game with rule-based board validation, ensuring every move is legal and accurate.',
      position: 'left',
      number: 4
    },
    {
      icon: FaSave,
      title: 'SAVE YOUR GAME',
      description: 'Securely store your PGN, metadata, and positions in your account for future analysis.',
      position: 'right',
      number: 5
    },
    {
      icon: FaShareAlt,
      title: 'SHARE OR REPLAY',
      description: 'Replay the full game, export the PGN, or share it instantly with friends or coaches.',
      position: 'left',
      number: 6
    }
  ];

  return (
    <>
      <Box position="relative" bg="#000" color="white" overflow="hidden" w="100%">
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
            <h1 className="about-title">Our</h1>
            <h1 className="about-gradient">Process</h1>
          </div>
        </Container>
      </Box>

      <Box
        bg="linear-gradient(to bottom, #ffe5e5, #fff5f5, white)"
        py={20}
        position="relative"
        overflow="hidden"
      >
        
        <Box
          position="absolute"
          left="50%"
          top="0"
          bottom="0"
          width="2px"
          bg="gray.200"
          transform="translateX(-50%)"
          zIndex={0}
        />
        <Box
          position="absolute"
          left="50%"
          top="50%"
          bottom="0"
          width="2px"
          bg="red"
          transform="translateX(-50%)"
          height={"20%"}
          zIndex={0}
        />

        <Container w={{ base: "95%", md: "70%" }} position="relative" zIndex={1}>
          <VStack spacing={{ base: 6, md: 0 }} align="stretch">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                position={feature.position}
                numberPosition={feature.number}
              />
            ))}
          </VStack>
        </Container>
      </Box>
    </>
  );
}