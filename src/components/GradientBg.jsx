import { Box, Image } from '@chakra-ui/react'
import React from 'react'
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import gradient2 from "../assets/gradient2.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
const GradientBg = ({ children }) => {
    return (
        <Box position="relative" bg="#000" color="white" overflow="hidden" w="100%">
            {[
                { src: gradient, right: "-20%", top: "-40%" },
                { src: gradient1, left: "-20%", top: "-40%" },
                { src: whitegradient1, right: "-15%", top: "-50%" },
                { src: whitegradient, left: "-15%", top: "-50%" },
                { src: gradient2, right: "10%", top: "10%" },
                { src: gradient1, left: "10%", top: "10%" },
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
                top="5%"
                w={{ base: "120px", md: "180px", lg: "200px" }}
                h={{ base: "120px", md: "180px", lg: "200px" }}
                zIndex="0"
            >
                <Image src={orb1} alt="orb" w="100%" h="100%" objectFit="contain" />
            </Box>
            <Box
                position="absolute"
                left="-70px"
                top="10%"
                transform="rotate(180deg)"
                w={{ base: "120px", md: "180px", lg: "200px" }}
                h={{ base: "120px", md: "180px", lg: "200px" }}
                zIndex="0"
            >
                <Image src={orb1} alt="orb" w="100%" h="100%" objectFit="contain" />
            </Box>
            {children}
        </Box>
    )
}

export default GradientBg