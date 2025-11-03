import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Flex,
    VStack,
    HStack,
    Input,
    SimpleGrid,
    Text,
    Container,
    Image,
    Heading,
    Textarea,
    IconButton,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Chess } from "chess.js";
import ChessGame from "./ChessGame";
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import gradient2 from "../assets/gradient2.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
import { FaArrowRight, FaInfoCircle, FaRandom } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { Tooltip } from "./ToolTip";
import GradientBg from "./GradientBg";

export default function HeroSectionWithChess() {
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveHistory, setMoveHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

    const handlePositionChange = (newPosition) => {
        setChessPosition(newPosition);
        const history = chessGame.history();
        setMoveHistory(history);
        setCurrentMoveIndex(history.length - 1);
    };

    const resetBoard = () => {
        chessGame.reset();
        setChessPosition(chessGame.fen());
        setMoveHistory([]);
        setCurrentMoveIndex(-1);
    };

    const moveForward = () => {
        if (currentMoveIndex < moveHistory.length - 1) {
            const newIndex = currentMoveIndex + 1;
            chessGame.reset();
            for (let i = 0; i <= newIndex; i++) chessGame.move(moveHistory[i]);
            setChessPosition(chessGame.fen());
            setCurrentMoveIndex(newIndex);
        }
    };

    const moveBackward = () => {
        if (currentMoveIndex >= 0) {
            const newIndex = currentMoveIndex - 1;
            chessGame.reset();
            for (let i = 0; i <= newIndex; i++) chessGame.move(moveHistory[i]);
            setChessPosition(chessGame.fen());
            setCurrentMoveIndex(newIndex);
        }
    };

    const randomMove = () => {
        const possibleMoves = chessGame.moves();
        if (possibleMoves.length === 0) return;
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        chessGame.move(move);
        handlePositionChange(chessGame.fen());
    };

    const flexDirection = useBreakpointValue({ base: "column", lg: "row" });

    return (
        <GradientBg>



            <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1">
                <VStack spacing={2} align="flex-start" pt={{ base: 10, md: 16 }} zIndex={3}>
                    <Text
                        fontSize={{ base: "lg", md: "2xl" }}
                        color="white"
                        fontFamily="'Clash Display', sans-serif"
                        display="flex"
                        alignItems="center"
                    >
                        How IT Works? <Tooltip
                            content="ThinkMoves was built for players who believe improvement starts with insight. We bridge the gap between classic chess play and modern AI analysis."
                            positioning={{ placement: "right-end" }}
                            contentStyleProps={{
                                bg: "#D32C32",
                                color: "white",

                                fontWeight: "semibold",
                                px: 3,
                                borderRadius: "md",
                                boxShadow: "md",
                                display: "flex",
                                alignItems: "center",
                            }}
                        ><FaInfoCircle style={{ marginLeft: "0.5rem", cursor: "pointer" }} />
                        </Tooltip>
                    </Text>
                    <Heading
                        fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                        fontFamily="'Clash Display', sans-serif"
                        color="white"
                        fontWeight="600"
                    >
                        CHESS GAME ANALYZER
                    </Heading>
                </VStack>

                <Flex
                    direction={flexDirection}
                    align="flex-start"
                    justify="center"
                    gap={{ base: 8, md: 10, lg: 16 }}
                    mt={{ base: 6, md: 10 }}
                    mb={12}
                    flexWrap="wrap"

                >
                    {/* === LEFT: CHESS BOARD === */}
                    <VStack spacing={6} w={{ base: "100%", lg: "45%" }} align="center">
                        <Box
                            boxShadow="2xl"
                            borderRadius="2xl"
                            overflow="hidden"
                            bg="black"
                            w={{ base: "90%", md: "400px", lg: "470px" }}
                            maxW="100%"
                        >
                            <ChessGame
                                game={chessGame}
                                position={chessPosition}
                                onPositionChange={handlePositionChange}
                            />
                        </Box>

                        {/* Control buttons under board */}
                        <VStack spacing={4} w="full" align="center">
                            <HStack spacing={4} wrap="wrap" justify="center">
                                <IconButton bg="#D32C32" color="white" onClick={resetBoard}>
                                    <RiResetLeftFill />
                                </IconButton>
                                <IconButton
                                    bg="#D32C32"
                                    color="white"
                                    onClick={moveBackward}
                                    isDisabled={currentMoveIndex < 0}
                                >
                                    <IoMdArrowRoundBack />
                                </IconButton>
                                <IconButton
                                    bg="#D32C32"
                                    color="white"
                                    onClick={moveForward}
                                    isDisabled={currentMoveIndex >= moveHistory.length - 1}
                                >
                                    <IoMdArrowRoundForward />
                                </IconButton>
                                <IconButton bg="#D32C32" color="white" onClick={randomMove}>
                                    <FaRandom />
                                </IconButton>
                            </HStack>

                            <HStack spacing={4} wrap="wrap" justify="center">
                                <Button bg="#D32C32" color="white">
                                    Upload Image
                                </Button>
                                <Button bg="#D32C32" color="white">
                                    Analyze Game
                                </Button>
                            </HStack>
                        </VStack>
                    </VStack>

                    {/* === RIGHT: FORM CONTROLS === */}
                    <VStack
                        spacing={5}
                        align="stretch"
                        w={{ base: "100%", lg: "50%" }}
                        px={{ base: 2, md: 4 }}
                        zIndex="2"
                    >
                        {/* Moves Inputs */}
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                            <Textarea placeholder="Correct Moves" bg="white" color="black" height="120px" />
                            <Textarea placeholder="Remaining Moves" bg="white" color="black" height="120px" />
                            <Textarea placeholder="Suggested Moves" bg="white" color="black" height="120px" />
                        </SimpleGrid>

                        <HStack spacing={3} align="center" flexWrap="nowrap">
                            <Input
                                placeholder="Error"
                                bg="white"
                                color="black"
                                height="45px"
                                flex="1"
                            />
                            <Button
                                bg="#D32C32"
                                color="white"
                                px={6}
                                height="45px"
                                _hover={{ bg: "#b0262b" }}
                            >
                                Recheck
                            </Button>
                        </HStack>


                        <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
                            <Input placeholder="Text Box 1" bg="white" color="black" height="45px" />
                            <Input placeholder="White Move" bg="white" color="black" height="45px" />
                            <Input placeholder="Black Move" bg="white" color="black" height="45px" />
                            <Input placeholder="Text Box 2" bg="white" color="black" height="45px" />
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                            <Button bg="#D32C32" color="white" rightIcon={<FaArrowRight />} height="45px">
                                Save Position
                            </Button>
                            <Button bg="#D32C32" color="white" rightIcon={<FaArrowRight />} height="45px">
                                Save Game
                            </Button>
                            <Button bg="#D32C32" color="white" height="45px">
                                Share Position
                            </Button>
                            <Button bg="#D32C32" color="white" height="45px">
                                Share Game
                            </Button>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                            <Button bg="#D32C32" color="white" height="45px">
                                Display Game Images
                            </Button>
                            <Button bg="#D32C32" color="white" height="45px">
                                Display Moves Images
                            </Button>
                        </SimpleGrid>
                    </VStack>
                </Flex>
            </Container>
        </GradientBg>
    );
}
