import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Flex, Heading, VStack, Text, HStack, IconButton } from "@chakra-ui/react";
import { FaInfoCircle, FaRandom } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { Chess } from "chess.js";

import ChessGame from "../components/ChessGame";
import GradientBg from "../components/GradientBg";
import { Tooltip } from "../components/ToolTip";
import SavePositionModal from "../components/SavePosition";
import { LuSave } from "react-icons/lu";
import ShareGameModal from "../components/ShareGame";
import axios from "axios";
import { BASE_URL } from "../utils/service";


const ViewPosition = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fenFromUrl = queryParams.get("fen");
    const posIdFromUrl = queryParams.get("posID");

    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;


    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveHistory, setMoveHistory] = useState([]);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
    const [isShareGameModal, setIsShareGameModal] = useState(false);
    const [data, setData] = useState(null);

    const token = localStorage.getItem('id_token');
    
   useEffect(() => {
    if (posIdFromUrl) {
        fetchPosition();
    } else if (fenFromUrl) {
        // Load position directly from URL FEN
        try {
            chessGame.load(fenFromUrl);
            setChessPosition(chessGame.fen());
        } catch (err) {
            console.error("Invalid FEN in URL:", err);
        }
    }
}, [posIdFromUrl, fenFromUrl]);


// When fetch completes, load the FEN
useEffect(() => {
    if (data?.fen) {
        try {
            chessGame.load(data.fen);
            setChessPosition(chessGame.fen());
        } catch (err) {
            console.error("Invalid FEN from server:", err);
        }
    }
}, [data]);




    const resetBoard = () => {
        if (posIdFromUrl) {
            chessGame.load(data?.fen || "");
        } else {
            chessGame.reset();
        }
        setChessPosition(chessGame.fen());
        setMoveHistory([]);
        setCurrentMoveIndex(-1);
    };


    const handlePositionChange = (newPosition, move) => {
        setChessPosition(newPosition);


        const newHistory = moveHistory.slice(0, currentMoveIndex + 1);
        if (move) newHistory.push(move);

        setMoveHistory(newHistory);
        setCurrentMoveIndex(newHistory.length - 1);
    };

    const randomMove = () => {
        const possibleMoves = chessGame.moves();
        if (possibleMoves.length === 0) return;

        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        chessGame.move(move);
        handlePositionChange(chessGame.fen(), move);
    };


 const fetchPosition = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/Position/GetAPosition`,
                {positionID: posIdFromUrl},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setData(res.data);

        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };


    const payload = {
        fen: chessPosition,
        whosTurn: chessGame.turn() === "w" ? "w" : "b",
    };

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
                        How It Works?{" "}
                        <Tooltip
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
                        >
                            <FaInfoCircle style={{ marginLeft: "0.5rem", cursor: "pointer" }} />
                        </Tooltip>
                    </Text>
                    <Heading
                        fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                        fontFamily="'Clash Display', sans-serif"
                        color="white"
                        fontWeight="600"
                    >
                        Play And Save Your Position
                    </Heading>
                </VStack>

                <Flex
                    align="center"
                    justify="center"
                    gap={{ base: 8, md: 10, lg: 16 }}
                    mt={{ base: 6, md: 10 }}
                    mb={12}
                    flexWrap="wrap"
                >
                    <VStack spacing={6} w={{ base: "100%", lg: "35%" }} align="center">
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

                        <VStack spacing={4} w="full" align="center">
                            <HStack spacing={4} wrap="wrap" justify="center" w="full">
                                <IconButton bg="#D32C32" color="white" onClick={resetBoard}>
                                    <RiResetLeftFill />
                                </IconButton>

                                <IconButton bg="#D32C32" color="white" onClick={randomMove}>
                                    <FaRandom />
                                </IconButton>



                            </HStack>
                            <IconButton
                                bg="#D32C32"
                                color="white"
                                onClick={() => setIsPositionModalOpen(true)}
                                px={2}
                            >
                                Save Position <LuSave />
                            </IconButton>
                            <IconButton
                                bg="#D32C32"
                                color="white"
                                onClick={() => setIsShareGameModal(true)}
                                px={2}
                            >
                                Share Position <LuSave />
                            </IconButton>
                        </VStack>
                    </VStack>
                </Flex>
            </Container>


            <SavePositionModal
                isOpen={isPositionModalOpen}
                onClose={() => setIsPositionModalOpen(false)}
                payload={payload}
                type="game"
            />

            <ShareGameModal
                isOpen={isShareGameModal}
                onClose={() => setIsShareGameModal(false)}
                type="position"
                payload={{ gameId: posIdFromUrl }}
            />
        </GradientBg>
    );
};

export default ViewPosition;
