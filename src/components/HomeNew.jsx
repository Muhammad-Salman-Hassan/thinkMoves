import React, { useState, useRef, useEffect } from "react";
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
    
    IconButton,
    useBreakpointValue,
    Field,
    Spinner,
    InputGroup,

} from "@chakra-ui/react";
import { Chess } from "chess.js";
import ChessGame from "./ChessGame";
import { FaInfoCircle } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { Tooltip } from "./ToolTip";
import GradientBg from "./GradientBg";
import { API, BASE_URL } from "../utils/service";
import ImagePreviewModal from "./ImageModal";
import SaveGameModal from "./SaveGameModal";
import { getMoveStyle, separateImages } from "../utils/DefaultFunctions";
import SavePositionModal from "./SavePosition";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import ChessAnalysis from "./DeepAnalyse";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import ShareGameModal from "./ShareGame";
import { MdFirstPage, MdLastPage } from 'react-icons/md';

export default function HomeNew({ isEdit }) {
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveHistory, setMoveHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recheckingLoading, setRechecingLoading] = useState(false);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const [fen, setFen] = useState("");
    const [formData, setFormData] = useState({
        correctMoves: "",
        moveImages: [],
        remainingMoves: "",
        suggestedMoves: "",
        error: "",
        textBox1: "",
        whiteMove: "",
        blackMove: "",
        textBox2: "",
        movesByKey: {},
        invalidMove: "",
        metadata: {}
    });
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef(null);
    const token = localStorage.getItem("access_token");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [analyzedImages, setAnalyzedImages] = useState([]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
    const [isShareGameModal, setIsShareGameModal] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [data, setData] = useState({});
    const [imageModalType, setImageModalType] = useState("");
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isLibraryView = searchParams.get("isLibraryView") === "true" ? true : false;

    const decodedGameID = decodeURIComponent(id);
    const { metadataImages, moveImages } = separateImages(data?.croppedImages, data?.metadata, data?.remainingPGN, data.correctMovesPGN);
    const openImageModal = (type) => {
        setImageModalType(type);
        setIsImageModalOpen(true);
        if (type === "game") {
            setImageList(previewUrls);
        }
    };

    useEffect(() => {
        const movesText = Array.isArray(formData.correctMoves)
            ? formData.correctMoves[0] || ""
            : formData.correctMoves || "";

        const cleaned = movesText.replace(/\d+\./g, "").trim();
        const movesOnly = cleaned.split(/\s+/).filter(Boolean);




        const game = new Chess();
        game.reset();


        movesOnly.forEach((m) => {
            try {
                game.move(m);
            } catch (err) {
                console.log("Invalid move:", m);
            }
        });

        // 3. Update board + history
        setChessPosition(game.fen());
        setMoveHistory(movesOnly);
        setCurrentMoveIndex(movesOnly.length);

    }, [formData.correctMoves, isEdit]);



    useEffect(() => {
        if (fen) {
            try {

                chessGame.load(fen);
                setChessPosition(fen);
            } catch (error) {
                console.error("Failed to load FEN:", error);
                chessGame.reset();
                setChessPosition(chessGame.fen());
            }
        }
    }, [fen]);



    useEffect(() => {
        if (isEdit) {
            const fetchGameData = async () => {
                const token = localStorage.getItem("id_token");
                if (!token) {
                    console.error("Missing token");
                    return;
                }

                try {
                    setLoading(true);
                    const response = await axios.post(
                        `${BASE_URL}/api/Game/GetAFullGame`,
                        { gameID: decodedGameID },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const { correctMoves, remainingMoves, metadata, gameImageUrls, notes, timeSaved, moveImageUrls, gameId } =
                        response.data;

                    const parsedCorrectMoves = parseSafely(correctMoves);
                    const parsedRemainingMoves = parseSafely(remainingMoves);
                    const parsedMetadata = JSON.parse(JSON.parse(metadata));


                    let remainingMovesArray = [];

                    if (Array.isArray(parsedRemainingMoves)) {

                        remainingMovesArray = parsedRemainingMoves
                            .join('\n')
                            .split('\n')
                            .map(line => line.trim())
                            .filter(Boolean);
                    } else if (typeof parsedRemainingMoves === 'string') {

                        remainingMovesArray = parsedRemainingMoves
                            .split('\n')
                            .map(line => line.trim())
                            .filter(Boolean);
                    }



                    const { metadataImages, moveImages } = separateImages(
                        response.data.moveImageUrls,
                        parsedMetadata,
                        remainingMovesArray,
                        parsedCorrectMoves
                    );


                    const movesByKey = {};
                    (moveImages || []).forEach(m => {
                        const key = `${m.moveNumber}-${m.moveColor}`;
                        movesByKey[key] = m;
                    });

                    setFormData({
                        correctMoves: parsedCorrectMoves.join("\n") || "",
                        remainingMoves: parsedRemainingMoves || "",
                        suggestedMoves: "",
                        error: "",
                        textBox1: "",
                        whiteMove: "",
                        blackMove: "",
                        textBox2: "",
                        invalidMove: "",
                        metadata: parsedMetadata || {},
                        notes: notes || "",
                        timeSaved: timeSaved || "",
                        movesByKey,
                        gameId
                    });

                    setData({
                        correctMoves: parsedCorrectMoves,
                        remainingMoves: parsedRemainingMoves,
                        metadata: parsedMetadata,
                        gameImages: gameImageUrls || [],
                        croppedImages: response.data.moveImageUrls || []
                    });

                    setAnalyzedImages(moveImageUrls)
                    setPreviewUrls(gameImageUrls || []);


                } catch (err) {
                    console.error("❌ Failed to load game:", err);
                } finally {
                    setLoading(false);

                }
            };

            fetchGameData();
        }
    }, [isEdit]);

    const parseSafely = (value) => {
        try {
            if (!value) return "";
            const cleaned = typeof value === "string" ? value.trim() : value;
            return typeof cleaned === "string" ? JSON.parse(cleaned) : cleaned;
        } catch {
            return value;
        }
    };


    const [localMoveValues, setLocalMoveValues] = useState({});

    const handleChange = (e, moveNumber, moveColor) => {
        const value = e.target.value;
        const key = `${moveNumber}-${moveColor}`;


        setLocalMoveValues(prev => ({
            ...prev,
            [key]: value
        }));


        clearTimeout(window.moveUpdateTimeout);
        window.moveUpdateTimeout = setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                movesByKey: {
                    ...prev.movesByKey,
                    [key]: {
                        ...prev.movesByKey[key],
                        move: value
                    }
                }
            }));


            setLocalMoveValues(prev => {
                const { [key]: _, ...rest } = prev;
                return rest;
            });
        }, 10);
    };





    useEffect(() => {

        const remainingText = Array.isArray(formData.remainingMoves)
            ? formData.remainingMoves[0] || ""
            : String(formData.remainingMoves || "");

        const remainingLines = remainingText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        if (remainingLines.length > 0) {
            const firstLine = remainingLines[0];
            const parts = firstLine.split(/\s+/);

            const whiteMove = parts[1] || "";
            const blackMove = parts[2] || "";


            if (formData.textBox1 !== whiteMove || formData.textBox2 !== blackMove) {
                setFormData((prev) => ({
                    ...prev,
                    textBox1: whiteMove,
                    textBox2: blackMove,
                }));
            }
        }
    }, [formData.remainingMoves]);


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


            for (let i = 0; i <= newIndex; i++) {
                try {
                    chessGame.move(moveHistory[i]);
                } catch (error) {
                    console.error(`Failed to apply move ${i}: ${moveHistory[i]}`, error);
                    return;
                }
            }

            setChessPosition(chessGame.fen());
            setCurrentMoveIndex(newIndex);
        }
    };


    const moveBackward = () => {
        if (currentMoveIndex >= 0) {
            const newIndex = currentMoveIndex - 1;

            chessGame.reset();

            for (let i = 0; i <= newIndex; i++) {
                try {
                    chessGame.move(moveHistory[i]);
                } catch (error) {
                    console.error(`Failed to apply move ${i}: ${moveHistory[i]}`, error);
                    return;
                }
            }

            setChessPosition(chessGame.fen());
            setCurrentMoveIndex(newIndex);
        }
    };

    const moveToStart = () => {
       
        if (moveHistory.length > 0) {
            chessGame.reset();

            try {
                chessGame.move(moveHistory[0]);
                setChessPosition(chessGame.fen());
                setCurrentMoveIndex(0);
            } catch (error) {
                console.error('Failed to apply first move:', error);
            }
        }
    };

    const moveToEnd = () => {
       
        if (moveHistory.length > 1) {
            chessGame.reset();

            for (let i = 0; i < moveHistory.length - 1; i++) {
                try {
                    chessGame.move(moveHistory[i]);
                } catch (error) {
                    console.error(`Failed to apply move ${i}: ${moveHistory[i]}`, error);
                    return;
                }
            }

            setChessPosition(chessGame.fen());
            setCurrentMoveIndex(moveHistory.length - 2);
        }
    };




    const flexDirection = useBreakpointValue({ base: "column", lg: "row" });
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 2) {
            alert("Please select up to 2 images only.");
        } else {
            setSelectedFiles(files);
            setPreviewUrls(files.map((file) => URL.createObjectURL(file)));

        }

    };

    const uploadImages = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        const loadSavedState = () => {
            try {
                const saved = localStorage.getItem('analysis-state');
                if (saved && !isEdit) {
                    const state = JSON.parse(saved);
                    const now = Date.now();
                    const dayInMs = 24 * 60 * 60 * 1000;

                    
                    if (now - state.timestamp < 7 * dayInMs) {
                        console.log('Restoring saved analysis state...');
                        setFormData(state.formData);
                        setData(state.data);
                        setPreviewUrls(state.previewUrls);
                        setAnalyzedImages(state.analyzedImages);
                        setFen(state.fen);
                        setMoveHistory(state.moveHistory);
                        setCurrentMoveIndex(state.currentMoveIndex);
                        setChessPosition(state.chessPosition);
                    } else {
                       
                        localStorage.removeItem('analysis-state');
                    }
                }
            } catch (error) {
                console.log('No saved state found or error loading:', error);
            }
        };

        if (!isEdit) {
            loadSavedState();
        }
    }, [isEdit]);

    
    useEffect(() => {
        const saveState = () => {
          
            if (!isEdit && (formData.correctMoves || previewUrls.length > 0)) {
                try {
                    localStorage.setItem('analysis-state', JSON.stringify({
                        formData,
                        data,
                        previewUrls,
                        analyzedImages,
                        fen,
                        moveHistory,
                        currentMoveIndex,
                        chessPosition,
                        timestamp: Date.now()
                    }));
                    console.log('Analysis state saved');
                } catch (error) {
                    console.error('Failed to save state:', error);
                }
            }
        };

       
        const timeoutId = setTimeout(saveState, 1000);
        return () => clearTimeout(timeoutId);
    }, [formData, data, previewUrls, analyzedImages, fen, moveHistory, currentMoveIndex, chessPosition, isEdit]);

    const handleNewAnalysis = () => {
        try {
            localStorage.removeItem('analysis-state');
           
            setFormData({
                correctMoves: "",
                moveImages: [],
                remainingMoves: "",
                suggestedMoves: "",
                error: "",
                textBox1: "",
                whiteMove: "",
                blackMove: "",
                textBox2: "",
                movesByKey: {},
                invalidMove: "",
                metadata: {}
            });
            setData({});
            setPreviewUrls([]);
            setAnalyzedImages([]);
            setSelectedFiles([]);
            resetBoard();
        } catch (error) {
            console.error('Failed to clear state:', error);
        }
    };

    const analyzeGame = async () => {
        if (selectedFiles.length === 0) return;

        const formDataPayload = new FormData();
        selectedFiles.forEach((file) => formDataPayload.append("gameImages", file));

        try {
            setLoading(true);

            const response = await API.post("/Api/ThinkMoves/ThinkMovesAI", formDataPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = response.data;
            setData(data);

            const { metadataImages, moveImages } = separateImages(data?.croppedImages, data?.metadata, data?.remainingPGN, data.correctMovesPGN);


            const movesByKey = {};
            moveImages.forEach(m => {
                const key = `${m.moveNumber}-${m.moveColor}`;
                movesByKey[key] = m;
            });

            const remainingMoves = data?.remainingPGN?.join(" ") || "";
            const moves = remainingMoves
                .replace(/\d+\.\s*/g, "")
                .trim()
                .split(/\s+/)
                .filter((m) => m);

            const whiteMoveFirst = moves[0] || "";
            const blackMoveFirst = moves[1] || "";

            const whiteMoveImage = movesByKey["1-WhiteMove"];
            const blackMoveImage = movesByKey["1-BlackMove"];

            const errorMsg = data?.gameError || "";
            const match = errorMsg.match(/(White|Black) move (\d+) failed/i);
            const nextErrorColor = match?.[1] || null;

            setFormData((prev) => ({
                ...prev,
                movesByKey,
                correctMoves: data.correctMovesPGN?.join("\n") || "",
                remainingMoves: data.remainingPGN?.join("\n") || "",
                suggestedMoves: data.suggestedMoves?.join("\n") || "",
                metadata: data?.metadata,
                textBox1: whiteMoveFirst,
                textBox2: blackMoveFirst,
                whiteMove: whiteMoveFirst,
                blackMove: blackMoveFirst,
                errorWhiteImageUrl: whiteMoveImage?.url || null,
                errorBlackImageUrl: blackMoveImage?.url || null,
                error: data.gameError || "",
                errorColor: nextErrorColor || null,
            }));

            setFen(data?.lastValidFEN);
            setAnalyzedImages(data.croppedImages || []);
            setPreviewUrls(data.gameImages || []);
            setLoading(false);
        } catch (error) {
            console.error("Analyze Game Error:", error);
            setLoading(false);
        }
    };




    const handleOpenSaveModal = () => {
        setIsSaveModalOpen(true);
    };
    const handleOpenPositionModal = () => {
        setIsPositionModalOpen(true);
    };
    const handleOpenShareGameModal = () => {
        setIsShareGameModal(true);
    };

    const lastfen = data?.lastValidFEN && data.lastValidFEN.trim() !== ""
        ? data.lastValidFEN
        : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const game = new Chess(lastfen);
    const whosturn = game.turn();


    const handleRecheck = async () => {
        setRechecingLoading(true);
        try {

            setSearchTerm("")
            const aws_accessKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
            const aws_secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
            const lambdaFunctionName = import.meta.env.VITE_LAMBDA_RECHECK_FUNCTION_NAME;

            const thinkmovessScannedGame = {};


            const sortedMoves = Object.values(formData.movesByKey)
                .sort((a, b) => a.moveNumber - b.moveNumber);

            sortedMoves.forEach((m) => {
                const key = m.moveNumber.toString();
                if (!thinkmovessScannedGame[key]) {
                    thinkmovessScannedGame[key] = { whiteMove: "", blackMove: "" };
                }
                if (m.moveColor === "WhiteMove") {
                    thinkmovessScannedGame[key].whiteMove = m.move || "";
                } else {
                    thinkmovessScannedGame[key].blackMove = m.move || "";
                }
            });

            const payload = {
                body: JSON.stringify({ ThinkMoveScannedGame: thinkmovessScannedGame }),
            };

            const client = new LambdaClient({
                region: "us-east-1",
                credentials: {
                    accessKeyId: aws_accessKey,
                    secretAccessKey: aws_secretAccessKey,
                },
            });

            const command = new InvokeCommand({
                FunctionName: lambdaFunctionName,
                Payload: new TextEncoder().encode(JSON.stringify(payload)),
            });

            const response = await client.send(command);
            const result = JSON.parse(new TextDecoder().decode(response.Payload));

            if (result?.statusCode === 200) {
                const parsedBody = JSON.parse(result.body);
                const errorMsg = parsedBody.Errors?.[0] || parsedBody.gameError || "";

                const match = errorMsg.match(/(White|Black) move (\d+) failed/i);
                let nextErrorColor = null;
                let nextErrorMoveNumber = null;
                if (match) {
                    nextErrorColor = match[1];
                    nextErrorMoveNumber = Number(match[2]);
                }

                let whiteMoveImage = null;
                let blackMoveImage = null;


                if (nextErrorMoveNumber) {
                    whiteMoveImage = formData.movesByKey[`${nextErrorMoveNumber}-WhiteMove`];
                    blackMoveImage = formData.movesByKey[`${nextErrorMoveNumber}-BlackMove`];
                }

                setChessPosition(parsedBody?.LastValidFEN);

                setFormData((prev) => ({
                    ...prev,
                    correctMoves: parsedBody.CorrectMovesPGN?.join("\n") || "",
                    remainingMoves: parsedBody.RemainingPGN?.join("\n") || "",
                    suggestedMoves: parsedBody.SuggestedMoves?.join("\n") || "",
                    error: errorMsg,
                    errorWhiteImageUrl: whiteMoveImage?.url || null,
                    errorBlackImageUrl: blackMoveImage?.url || null,
                    errorColor: nextErrorColor || null,
                }));

                setFen(parsedBody?.LastValidFEN);
            } else {
                console.error("Lambda Error:", result);
                setFormData((prev) => ({
                    ...prev,
                    error: "Failed to recheck — invalid response from Lambda.",
                }));
            }
        } catch (error) {
            console.error("Error invoking Lambda:", error);
        } finally {
            setRechecingLoading(false);
        }
    };


    const handleMetadataChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [key]: value,
            },
        }));
    };

    const handleSuggestedMoveClick = (selectedMove) => {
        const errorText = formData.error;
        const match = errorText.match(/(White|Black) move (\d+) failed: Invalid move: (\S+)/i);
        if (!match) return;

        const [, color, moveNumberStr] = match;
        const moveNumber = Number(moveNumberStr);
        const isBlack = color.toLowerCase() === "black";
        const moveColor = isBlack ? "BlackMove" : "WhiteMove";
        const key = `${moveNumber}-${moveColor}`;


        setFormData((prev) => ({
            ...prev,
            movesByKey: {
                ...prev.movesByKey,
                [key]: {
                    ...prev.movesByKey[key],
                    move: selectedMove
                }
            },

            ...(isBlack ? { textBox2: selectedMove } : { textBox1: selectedMove })
        }));


        const remainingLines = formData.remainingMoves
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const updatedLines = remainingLines.map((line) => {
            const lineMatch = line.match(/^(\d+)\.\s*([^\s]+)?\s*([^\s]+)?/);
            if (!lineMatch) return line;

            const lineMoveNumber = Number(lineMatch[1]);
            if (lineMoveNumber !== moveNumber) return line;

            const whiteMove = lineMatch[2] || "";
            const blackMove = lineMatch[3] || "";

            if (!isBlack) {
                return `${moveNumber}. ${selectedMove} ${blackMove}`.trim();
            } else {
                return `${moveNumber}. ${whiteMove} ${selectedMove}`.trim();
            }
        });

        const rebuiltPGN = updatedLines.join("\n");
        setFormData(prev => ({ ...prev, remainingMoves: rebuiltPGN.trim() }));
    };



    const moves =
        formData?.suggestedMoves
            ?.split("\n")
            .map((m) => m.trim())
            .filter((m) => m !== "") || [];


    const filteredMoves = moves.filter((move) =>
        move.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <>
            <Box bg="#D32C32">
                <Text textAlign="center" fontSize="md" py="2" color="white" fontWeight="500" w={"100%"}>Play smarter. Learn faster. Analyze for FREE! 🚀</Text>
            </Box>
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
                        gap={{ base: 8, md: 10, lg: 24 }}
                        mt={{ base: 6, md: 10 }}
                        mb={12}
                        flexWrap="wrap"

                    >

                        <VStack spacing={6} w={{ base: "100%", lg: "40%" }} align="center">
                            <Box
                                boxShadow="2xl"
                                borderRadius="2xl"
                                overflow="hidden"
                                bg="black"
                                w={{ base: "90%", md: "400px", lg: "600px" }}
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
                                    {/* Reset Button */}
                                    <IconButton
                                        bg="#D32C32"
                                        color="white"
                                        onClick={resetBoard}
                                        aria-label="Reset board"
                                        _hover={{ bg: "#B82329" }}
                                    >
                                        <RiResetLeftFill />
                                    </IconButton>

                                    {/* First Move Button */}
                                    <IconButton
                                        bg="#D32C32"
                                        color="white"
                                        onClick={moveToStart}
                                        isDisabled={currentMoveIndex < 0}
                                        aria-label="Go to start"
                                        _hover={{ bg: "#B82329" }}
                                    >
                                        <MdFirstPage />
                                    </IconButton>

                                    {/* Previous Move Button */}
                                    <IconButton
                                        bg="#D32C32"
                                        color="white"
                                        onClick={moveBackward}
                                        isDisabled={currentMoveIndex < 0}
                                        aria-label="Previous move"
                                        _hover={{ bg: "#B82329" }}
                                    >
                                        <IoMdArrowRoundBack />
                                    </IconButton>

                                    {/* Next Move Button */}
                                    <IconButton
                                        bg="#D32C32"
                                        color="white"
                                        onClick={moveForward}
                                        isDisabled={currentMoveIndex >= moveHistory.length - 1}
                                        aria-label="Next move"
                                        _hover={{ bg: "#B82329" }}
                                    >
                                        <IoMdArrowRoundForward />
                                    </IconButton>

                                    {/* Last Move Button */}
                                    <IconButton
                                        bg="#D32C32"
                                        color="white"
                                        onClick={moveToEnd}
                                        isDisabled={currentMoveIndex >= moveHistory.length - 1}
                                        aria-label="Go to end"
                                        _hover={{ bg: "#B82329" }}
                                    >
                                        <MdLastPage />
                                    </IconButton>
                                </HStack>

                                <HStack
                                    spacing={[2, 4]}
                                    wrap="wrap"
                                    justify="center"
                                    align="center"
                                    w="full"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />

                                    <Button
                                        bg="#D32C32"
                                        color="white"
                                        onClick={uploadImages}
                                        width={["100%", "200px"]}
                                        borderRadius="14.82px"
                                        border="1px solid"
                                        borderColor="linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        p={4}
                                        disabled={isEdit}
                                    >
                                        {selectedFiles?.length === 0 ? <>
                                            Upload Image
                                            <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                                                <IoMdArrowRoundForward />
                                            </Box>
                                        </> : <>
                                            {selectedFiles?.length}/2 Images Selected
                                            <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                                                <IoMdArrowRoundForward />
                                            </Box>
                                        </>}

                                    </Button>

                                    <Button
                                        bg="#D32C32"
                                        color="white"
                                        onClick={analyzeGame}
                                        disabled={selectedFiles?.length === 0 || isEdit}
                                        width={["100%", "200px"]}
                                        borderRadius="14.82px"
                                        border="1px solid"
                                        borderColor="linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        p={4}
                                    >
                                        Analyze Game {loading ? <Spinner size={"sm"} /> : <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                                            <IoMdArrowRoundForward />
                                        </Box>}

                                    </Button>

                                </HStack>
                                <HStack
                                    spacing={[2, 4]}
                                    wrap="wrap"
                                    justify="center"
                                    align="center"
                                    w="full"
                                >
                                    <Button
                                        bg="#D32C32"
                                        color="white"
                                        height="45px"
                                        onClick={() => openImageModal("game")}
                                        disabled={previewUrls.length === 0}
                                        borderRadius={"14.82px"}
                                        border={"1px solid"}
                                        width={["100%", "200px"]}

                                        borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                    >
                                        Game Images <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                    </Button>
                                    <Button
                                        bg="#D32C32"
                                        color="white"
                                        height="45px"
                                        onClick={() => openImageModal("moves")}
                                        borderRadius={"14.82px"}
                                        border={"1px solid"}
                                        width={["100%", "200px"]}
                                        disabled={selectedFiles?.length === 0 && Object.entries(formData.movesByKey).length === 0}


                                        borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                    >

                                        Moves Images <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                    </Button>
                                </HStack>

                            </VStack>

                        </VStack>


                        <VStack
                            spacing={5}
                            align="stretch"
                            w={{ base: "100%", lg: "50%" }}
                            px={{ base: 2, md: 4 }}
                            zIndex="2"
                        >

                            <InputGroup mb={3} endElement={<LuSearch />} bg={"white"} borderRadius={"md"} color={"black"}>


                                <Input
                                    type="text"
                                    placeholder="Search Suggested Moves"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    borderColor="gray.300"
                                    _focus={{ borderColor: "red.400", boxShadow: "0 0 0 1px #D32C32" }}
                                />
                            </InputGroup>


                            <SimpleGrid columns={{ base: 1, md: 3, lg: 1 }} gap={4}>

                                <Field.Root w={"100%"}>
                                    <Field.Label color="white">Suggested Moves</Field.Label>
                                    <Box bg="white" color="black" p={2} borderRadius="md" height="120px" overflowY="auto" w={"100%"}>
                                        {filteredMoves.length > 0 ? (
                                            filteredMoves.map((move, idx) => (
                                                <Button
                                                    key={idx}
                                                    size="sm"
                                                    bg="#D32C32"
                                                    color="white"
                                                    variant="solid"
                                                    m={1}
                                                    onClick={() => handleSuggestedMoveClick(move)}
                                                    _hover={{ bg: "#b42329" }}
                                                >
                                                    {move}
                                                </Button>
                                            ))
                                        ) : (
                                            <Box color="gray.500" fontSize="sm">
                                                No matching results
                                            </Box>
                                        )}
                                    </Box>

                                </Field.Root>






                            </SimpleGrid>

                            <HStack spacing={3} align="center" flexWrap="nowrap">
                                <Field.Root >
                                    <Field.Label color="white">Error</Field.Label>
                                    <Flex width={"100%"} gap={"2"} >
                                        <Input
                                            name="error"
                                            value={formData.error}
                                            onChange={handleChange}
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
                                            size={"sm"}
                                            onClick={handleRecheck}
                                            isDisabled={!formData.correctMoves || !formData.remainingMoves || recheckingLoading}
                                            borderRadius={"14.82px"}
                                            border={"1px solid"}
                                            borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                        >
                                            {recheckingLoading ? "Rechecking" : "Recheck"} {recheckingLoading ? <Spinner size={"sm"} /> : <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>}
                                        </Button>
                                    </Flex>
                                </Field.Root>


                            </HStack>
                            <Box h={200} overflowY={"scroll"} bg={"white"} p={2}>
                                <SimpleGrid columns={{ base: 4, md: 4 }} gap={3}>
                                    {formData.movesByKey && Object.values(formData.movesByKey)
                                        .filter((m) => m.moveColor === "WhiteMove")
                                        .sort((a, b) => a.moveNumber - b.moveNumber)
                                        .map((whiteMove) => {
                                            const blackKey = `${whiteMove.moveNumber}-BlackMove`;
                                            const blackMove = formData.movesByKey[blackKey];

                                            const whiteStyle = getMoveStyle(formData, whiteMove);
                                            const blackStyle = getMoveStyle(formData, blackMove || {});

                                            return (
                                                <React.Fragment key={whiteMove.moveNumber}>
                                                    {
                                                        <>
                                                            <Field.Root>
                                                                <Field.Label color="black" fontSize={"xs"}>White Move{whiteMove.moveNumber}</Field.Label>
                                                                <Input
                                                                    name={`whiteMove_${whiteMove.moveNumber}`}
                                                                    value={
                                                                        localMoveValues[`${whiteMove.moveNumber}-WhiteMove`] ??
                                                                        whiteMove.move ??
                                                                        ""
                                                                    }
                                                                    onChange={(e) => handleChange(e, whiteMove.moveNumber, "WhiteMove")}
                                                                    placeholder="White Move"
                                                                    bg={whiteStyle.bgColor}
                                                                    color="black"
                                                                    height="35px"
                                                                    borderColor={whiteStyle.borderColor}
                                                                    borderWidth="2px"
                                                                />
                                                            </Field.Root>


                                                            <Field.Root>
                                                                <Field.Label color="black" fontSize={"xs"}>White Move Image</Field.Label>
                                                                {whiteMove.url && (
                                                                    <Box
                                                                        bg={whiteStyle.bgColor}
                                                                        borderRadius="md"
                                                                        height="35px"
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        justifyContent="center"
                                                                        borderColor={whiteStyle.borderColor}
                                                                        borderWidth="2px"
                                                                    >
                                                                        <Image
                                                                            src={whiteMove.url}
                                                                            alt="White move"
                                                                            height="35px"
                                                                            width="100%"
                                                                            objectFit="cover"
                                                                        />
                                                                    </Box>
                                                                )}
                                                            </Field.Root>


                                                            <Field.Root>
                                                                <Field.Label color="black" fontSize={"xs"}>Black Move Image</Field.Label>
                                                                {blackMove?.url && (
                                                                    <Box
                                                                        bg={blackStyle.bgColor}
                                                                        borderRadius="md"
                                                                        height="35px"
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        justifyContent="center"
                                                                        borderColor={blackStyle.borderColor}
                                                                        borderWidth="2px"
                                                                    >
                                                                        <Image
                                                                            src={blackMove.url}
                                                                            alt="Black move"
                                                                            height="35px"
                                                                            width="100%"
                                                                            objectFit="cover"
                                                                        />
                                                                    </Box>
                                                                )}
                                                            </Field.Root>


                                                            <Field.Root>
                                                                <Field.Label color="black" fontSize={"xs"}>Black Move {whiteMove.moveNumber}</Field.Label>
                                                                <Input
                                                                    name={`blackMove_${whiteMove.moveNumber}`}
                                                                    value={
                                                                        localMoveValues[`${whiteMove.moveNumber}-BlackMove`] ??
                                                                        blackMove?.move ??
                                                                        ""
                                                                    }
                                                                    onChange={(e) => handleChange(e, whiteMove.moveNumber, "BlackMove")}
                                                                    placeholder="Black Move"
                                                                    bg={blackStyle.bgColor}
                                                                    color="black"
                                                                    height="35px"
                                                                    borderColor={blackStyle.borderColor}
                                                                    borderWidth="2px"
                                                                />
                                                            </Field.Root>
                                                        </>
                                                    }

                                                </React.Fragment>
                                            );
                                        })}
                                </SimpleGrid>


                            </Box>


                            <Box width="100%">
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} gap={2} width="100%" mb={2}>

                                    <HStack spacing={4} width="100%">
                                        <Button
                                            bg="#D32C32"
                                            color="white"
                                            height="45px"
                                            flex="1"
                                            disabled={!token}
                                            onClick={handleOpenPositionModal}
                                            borderRadius={"14.82px"}
                                            border={"1px solid"}
                                            borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                        >
                                            Save Position <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                        </Button>
                                        <Button
                                            bg="#D32C32"
                                            color="white"
                                            height="45px"
                                            flex="1"
                                            disabled={!token}
                                            onClick={handleOpenSaveModal}
                                            borderRadius={"14.82px"}
                                            border={"1px solid"}
                                            borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                        >
                                            {console.log(isLibraryView)}
                                            {isLibraryView ? "Update game" : "Save Game"}  <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                        </Button>
                                    </HStack>

                                    {isEdit && (
                                        <HStack spacing={4} width="100%">
                                            {/* <Button
                                                bg="#D32C32"
                                                color="white"
                                                height="45px"
                                                flex="1"
                                                disabled={!token}
                                                borderRadius={"14.82px"}
                                                border={"1px solid"}
                                                borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                            >
                                                Share Position <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                            </Button> */}
                                            <Button
                                                bg="#D32C32"
                                                color="white"
                                                height="45px"
                                                flex="1"
                                                borderRadius={"14.82px"}
                                                border={"1px solid"}
                                                borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                                onClick={handleOpenShareGameModal}

                                            >
                                                Share Game <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                            </Button>
                                        </HStack>
                                    )}

                                </SimpleGrid>
                                {!isEdit && (formData.correctMoves || previewUrls.length > 0) && (
                                    <Box bg="#D32C32" py={2} borderRadius={"8.82px"}>
                                        <Container maxW="container.xl">
                                            <HStack justify="space-between" align="center">
                                                <Text color="white" fontSize="sm">
                                                    Continuing previous analysis
                                                </Text>
                                                <Text color="white" fontSize="sm">
                                                    OR
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    bg="white"
                                                    color={"black"}
                                                    onClick={handleNewAnalysis}
                                                >
                                                    Start New Analysis
                                                </Button>
                                            </HStack>
                                        </Container>
                                    </Box>
                                )}
                            </Box>



                        </VStack>
                    </Flex>
                </Container>
            </GradientBg>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1" my={8}>
                {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                    <Box mt={6}>
                        <Text fontSize="xl" fontWeight="semibold" mb={3}>
                            Game Details from the Sheet.
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {Object.entries(formData.metadata).map(([key, value]) => (
                                <Field.Root key={key}>
                                    <Field.Label color="black">{key}</Field.Label>
                                    <Input
                                        value={value}
                                        onChange={(e) => handleMetadataChange(key, e.target.value)}
                                        placeholder={key}
                                        bg="white"
                                        color="black"
                                        height="45px"
                                    />
                                </Field.Root>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}



            </Container>
            <Box position="relative" overflow="hidden">


                <Container maxW="container.xl" px={{ base: 4, md: 8 }} position="relative" zIndex="1">
                    <Box mx="auto" py={{ base: 16, md: 24 }}>
                        {/* 2-Column Layout */}
                        <Box
                            display="grid"
                            gridTemplateColumns={{ base: "1fr", md: "65%" }}
                            alignItems="start"
                            gap={8}
                            mb={12}
                        >


                            {/* RIGHT COLUMN */}
                            <Box>
                                <Text
                                    fontSize="lg"
                                    letterSpacing="2px"
                                    textTransform="uppercase"
                                    fontFamily="'Clash Display', sans-serif"
                                    color="#D32C32"
                                    mb={4}
                                    fontWeight="semibold"
                                >
                                    <Text as="span" color="red" fontSize="18px">●</Text> DEEP ANALYZE BETA
                                </Text>
                                <Text
                                    fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                                    fontWeight="600"
                                    fontFamily="'Clash Display', sans-serif"
                                    mb={6}
                                    lineHeight="short"
                                    color={"black"}
                                >
                                    POWERED BY THE{" "}
                                    <Text as="span" color="#D32C32">
                                        STOCKFISH 17.1
                                    </Text>{" "}
                                    CHESS ENGINE
                                </Text>

                                <Text
                                    fontSize={{ base: "sm", md: "md" }}
                                    color="black"
                                    mb={6}
                                    opacity="0.9"
                                >
                                    Right now we analyze your full game up to depth 15 – higher depth and
                                    stronger evaluations are coming soon.
                                </Text>
                            </Box>
                        </Box>

                        {/* What You Get Section */}
                        <Box mb={12}>
                            <Text
                                fontSize="2xl"
                                fontWeight="semibold"
                                fontFamily="'Clash Display', sans-serif"
                                mb={6}
                                color="black"
                            >
                                When you hit Deep Analyze, ThinkMoves will
                            </Text>
                            <Box
                                display="grid"
                                gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                                gap={6}
                            >
                                {[
                                    {
                                        number: "01",
                                        title: "COMPARE HOW WHITE AND BLACK PLAYED ACROSS THE WHOLE GAME"
                                    },
                                    {
                                        number: "02",
                                        title: "SHOW MOVE-BY-MOVE LABELS LIKE BEST, GOOD, INACCURACY, MISTAKE, AND BLUNDER"
                                    },
                                    {
                                        number: "03",
                                        title: "HIGHLIGHT CRITICAL MOMENTS WHERE THE GAME TURNED IN YOUR FAVOR OR SLIPPED AWAY"
                                    },
                                    {
                                        number: "04",
                                        title: "SUGGEST STRONGER MOVES SO YOU CAN SEE WHAT YOU SHOULD HAVE PLAYED"
                                    },
                                ].map((item) => (
                                    <Box
                                        key={item.number}
                                        p={8}
                                        borderRadius="xl"
                                        bg={"gray.50"}
                                        border="1px solid"
                                        borderColor={"#18181b1a"}
                                        _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
                                        transition="0.2s"
                                        boxShadow={"0px 16px 24px #18181b1a"}
                                    >
                                        <Flex gap={6} align="start">
                                            <Text
                                                fontSize="xl"
                                                fontWeight="bold"
                                                color="#D32C32"
                                                minW="40px"
                                            >
                                                {item.number}
                                            </Text>
                                            <Text
                                                fontSize="md"
                                                fontWeight="semibold"
                                                lineHeight="short"
                                                fontFamily="'Clash Display', sans-serif"
                                                color={"black"}
                                            >
                                                {item.title}
                                            </Text>
                                        </Flex>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1" my={8}>


                            <ChessAnalysis correctMoves={formData.correctMoves} />

                        </Container>


                    </Box>
                </Container>
            </Box>

            <ImagePreviewModal
                isImageModalOpen={isImageModalOpen}
                setIsImageModalOpen={setIsImageModalOpen}
                formData={formData}
                imageList={imageList}
                metadataImages={metadataImages}
                moveImages={moveImages}
                type={imageModalType}

            />
            <SaveGameModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                payload={{ ...formData, gameImageUrls: previewUrls, cropImageUrls: analyzedImages, sheetType: data?.metadata?.SheetType }}
                isEdit={isLibraryView}
            />
            <SavePositionModal
                isOpen={isPositionModalOpen}
                onClose={() => setIsPositionModalOpen(false)}
                payload={{ fen: fen, whosTurn: whosturn }}
            />
            <ShareGameModal
                isOpen={isShareGameModal}
                onClose={() => setIsShareGameModal(false)}
                payload={{ gameId: formData.gameId }}
            />


        </>
    );
}
