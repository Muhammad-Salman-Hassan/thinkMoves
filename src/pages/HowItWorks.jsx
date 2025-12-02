import React from 'react';
import { Box, Container, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { FaFileUpload, FaChessKnight, FaTags, FaGamepad, FaSave, FaShareAlt } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description, position, numberPosition }) => {
  const isLeft = position === 'left';

  return (
    <Box position="relative" width="full" >
      <HStack
        spacing={0}
        align="center"
        justify={isLeft ? 'flex-start' : 'flex-end'}
        position="relative"
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
    </Box>
  );
};

export default function GameFeaturesSection() {
  const features = [
    {
      icon: FaFileUpload,
      title: 'UPLOAD SHEET',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'right',
      number: 1
    },
    {
      icon: FaChessKnight,
      title: 'AI EXTRACTS MOVES',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'left',
      number: 2
    },
    {
      icon: FaTags,
      title: 'FIX MISTAKES',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'right',
      number: 3
    },
    {
      icon: FaGamepad,
      title: 'REVIVE YOUR GAME',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'left',
      number: 4
    },
    {
      icon: FaSave,
      title: 'SAVE YOUR GAME',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'right',
      number: 5
    },
    {
      icon: FaShareAlt,
      title: 'SHARE OR REPLAY',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      position: 'left',
      number: 6
    }
  ];

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to bottom, #ffe5e5, #fff5f5, white)"
      py={20}
      position="relative"
      overflow="hidden"
    >
    
      {/* <Box
        position="absolute"
        top="10%"
        left="20%"
        width="300px"
        height="300px"
        bg="red"
        borderRadius="full"
        filter="blur(80px)"
        opacity={0.4}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="50%"
        right="10%"
        width="250px"
        height="250px"
        bg="red"
        borderRadius="full"
        filter="blur(60px)"
        opacity={0.3}
        pointerEvents="none"
      /> */}

    
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

      <Container w={"70%"} position="relative" zIndex={1}>
        <VStack spacing={0} align="stretch">
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
  );
}