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
    Textarea,
    IconButton,
    useBreakpointValue,
    Field,
    Spinner,
    InputGroup,

} from "@chakra-ui/react";
import { Chess } from "chess.js";
import ChessGame from "./ChessGame";
import { FaInfoCircle, FaRandom } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { Tooltip } from "./ToolTip";
import GradientBg from "./GradientBg";
import Loader from "./Loader";
import { API, BASE_URL } from "../utils/service";
import ImagePreviewModal from "./ImageModal";
import SaveGameModal from "./SaveGameModal";
import { separateImages } from "../utils/DefaultFunctions";
import SavePositionModal from "./SavePosition";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import ChessAnalysis from "./DeepAnalyse";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LuSearch } from "react-icons/lu";

export default function HeroSectionWithChess({ isEdit }) {
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
        remainingMoves: "",
        suggestedMoves: "",
        error: "",
        textBox1: "",
        whiteMove: "",
        blackMove: "",
        textBox2: "",
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
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [data, setData] = useState({});
    const [imageModalType, setImageModalType] = useState("");
    const { id } = useParams();
    const decodedGameID = decodeURIComponent(id);
    const { metadataImages, moveImages } = separateImages(data?.croppedImages, data?.metadata);
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

      
        chessGame.reset();
        setChessPosition(chessGame.fen());
        setMoveHistory(movesOnly);
        setCurrentMoveIndex(movesOnly?.length);
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

                    const { correctMoves, remainingMoves, metadata, gameImageUrls, notes, timeSaved } =
                        response.data;


                    const parsedCorrectMoves = parseSafely(correctMoves);
                    const parsedRemainingMoves = parseSafely(remainingMoves);
                    const parsedMetadata = JSON.parse(JSON.parse(metadata));

                    // setAnalyzedImages(response.data.moveImageUrls || []);

                    setFormData({
                        correctMoves: parsedCorrectMoves || "",
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
                    });


                    setData({
                        correctMoves: parsedCorrectMoves,
                        remainingMoves: parsedRemainingMoves,
                        metadata: parsedMetadata,
                        gameImages: gameImageUrls || [],
                        croppedImages: response.data.moveImageUrls || []
                    });

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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTextBoxChange = (boxNumber, value) => {

        const remainingText = Array.isArray(formData.remainingMoves)
            ? formData.remainingMoves[0] || ""
            : String(formData.remainingMoves || "");

        const remainingLines = remainingText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);


        if (value.trim() === "") {
            setFormData((prev) => ({
                ...prev,
                [`textBox${boxNumber}`]: value,
            }));
            return;
        }

        if (remainingLines.length === 0) {
            setFormData((prev) => ({
                ...prev,
                [`textBox${boxNumber}`]: value,
            }));
            return;
        }


        let firstLine = remainingLines[0];
        const parts = firstLine.split(/\s+/);

        if (boxNumber === 1) {

            parts[1] = value;
        } else if (boxNumber === 2) {

            while (parts.length < 3) parts.push("");
            parts[2] = value;
        }

        const updatedFirstLine = parts.join(" ");
        const updatedRemainingMoves = [updatedFirstLine, ...remainingLines.slice(1)].join("\n");

        setFormData((prev) => ({
            ...prev,
            remainingMoves: updatedRemainingMoves,
            [`textBox${boxNumber}`]: value,
        }));
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


            for (let i = 0; i <= newIndex - 1; i++) {
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



    const flexDirection = useBreakpointValue({ base: "column", lg: "row" });
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    };

    const uploadImages = () => {
        fileInputRef.current.click();
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

            const { metadataImages, moveImages } = separateImages(data?.croppedImages, data?.metadata);

            const remainingMoves = data?.remainingPGN?.join(" ") || "";
            const moves = remainingMoves
                .replace(/\d+\.\s*/g, "")
                .trim()
                .split(/\s+/)
                .filter((m) => m);

            const whiteMoveFirst = moves[0] || "";
            const blackMoveFirst = moves[1] || "";


            const whiteMoveImage = moveImages.find(
                (m) => m.moveNumber === 1 && m.moveColor === "WhiteMove"
            );
            const blackMoveImage = moveImages.find(
                (m) => m.moveNumber === 1 && m.moveColor === "BlackMove"
            );

            const errorMsg = data?.gameError || "";
            const match = errorMsg.match(/(White|Black) move (\d+) failed/i);
            const nextErrorColor = match?.[1] || null;
            const nextErrorMoveNumber = match ? Number(match[2]) : null;



            setFormData((prev) => ({
                ...prev,
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

    const game = new Chess(data?.lastValidFEN);
    const whosturn = game.turn();



    const handleRecheck = async () => {
        try {
            setRechecingLoading(true);

            const aws_accessKey = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
            const aws_secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
            const lambdaFunctionName = import.meta.env.VITE_LAMBDA_RECHECK_FUNCTION_NAME;


            const combinedText = `${formData?.correctMoves} ${formData?.remainingMoves}`;

            const thinkmovessScannedGame = {};
            const moves = combinedText
                .replace(/\d+\.\s*/g, "")
                .split(/\s+/)
                .filter((move) => move.trim());

            for (let i = 0; i < moves.length; i += 2) {
                const moveNumber = Math.floor(i / 2) + 1;
                const whiteMove = moves[i];
                const blackMove = moves[i + 1] || "";
                thinkmovessScannedGame[moveNumber.toString()] = { whiteMove, blackMove };
            }


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
                    whiteMoveImage = moveImages.find(
                        (m) => m.moveNumber === nextErrorMoveNumber && m.moveColor === "WhiteMove"
                    );
                    blackMoveImage = moveImages.find(
                        (m) => m.moveNumber === nextErrorMoveNumber && m.moveColor === "BlackMove"
                    );
                }


                setChessPosition(parsedBody?.LastValidFEN)
                setFormData((prev) => ({
                    ...prev,
                    correctMoves: parsedBody.CorrectMovesPGN?.join("\n") || "",
                    remainingMoves: parsedBody.RemainingPGN?.join("\n") || "",
                    suggestedMoves: parsedBody.SuggestedMoves?.join("\n") || "",
                    error: parsedBody.Errors?.[0] || parsedBody.gameError || "",
                    textBox1: prev.textBox1,
                    whiteMove: "",
                    blackMove: "",
                    textBox2: prev.textBox2,
                    errorWhiteImageUrl: whiteMoveImage?.url || null,
                    errorBlackImageUrl: blackMoveImage?.url || null,

                    errorColor: nextErrorColor || null,
                    // ...resetBoxes,
                }));
                setFen(parsedBody?.LastValidFEN)

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

        const [, color, moveNumber, invalidMove] = match;
        const isBlack = color.toLowerCase() === "black";

        const remainingLines = formData.remainingMoves
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        if (remainingLines.length === 0) return;

        let firstLine = remainingLines[0];

        const parts = firstLine.split(/\s+/);

        if (!isBlack && parts.length > 1) {
            parts[1] = selectedMove;
        } else if (isBlack && parts.length > 2) {
            parts[2] = selectedMove;
        }

        const updatedFirstLine = parts.join(" ");


        const updatedRemainingMoves = [updatedFirstLine, ...remainingLines.slice(1)].join("\n");


        const textBoxUpdates = isBlack
            ? { textBox2: selectedMove }
            : { textBox1: selectedMove };


        setFormData((prev) => ({
            ...prev,
            remainingMoves: updatedRemainingMoves,
            ...textBoxUpdates,
        }));
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
                                        Upload Image
                                        <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                                            <IoMdArrowRoundForward />
                                        </Box>
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


                            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                                <Field.Root >
                                    <Field.Label color="white">Correct Moves</Field.Label>
                                    <Textarea
                                        name="correctMoves"
                                        value={formData.correctMoves}
                                        onChange={handleChange}
                                        placeholder="Correct Moves"
                                        bg="white"
                                        color="black"
                                        height="120px"
                                    />
                                </Field.Root>
                                <Field.Root >
                                    <Field.Label color="white">Remaining Moves</Field.Label>
                                    <Textarea
                                        name="remainingMoves"
                                        value={formData.remainingMoves}
                                        onChange={handleChange}
                                        placeholder="Remaining Moves"
                                        bg="white"
                                        color="black"
                                        height="120px"
                                    />
                                </Field.Root>
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

                            <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
                                <Field.Root >
                                    <Field.Label color="white">Text Box 1</Field.Label>
                                    <Input
                                        name="textBox1"
                                        value={formData.textBox1}
                                        onChange={(e) => handleTextBoxChange(1, e.target.value)}
                                        placeholder="Text Box 1"
                                        bg="white"
                                        color="black"
                                        height="45px"
                                        borderColor={
                                            formData.errorColor === "White" ? "red" : "green"
                                        }
                                        borderWidth={"2px"}

                                    />
                                </Field.Root>


                                {formData.errorWhiteImageUrl ? (
                                    <Field.Root w={"100%"}>
                                        <Field.Label color="white">White Move</Field.Label>
                                        <Box
                                            bg="white"
                                            borderRadius="md"
                                            height="45px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w={"100%"}
                                        >
                                            <Image
                                                src={formData.errorWhiteImageUrl}
                                                alt="White move image"
                                                height="45px"
                                                width="auto"
                                                objectFit="contain"
                                            />
                                        </Box>
                                    </Field.Root>
                                ) : (
                                    <Field.Root >
                                        <Field.Label color="white">White Move</Field.Label>
                                        <Input
                                            name="whiteMove"
                                            value={formData.whiteMove}
                                            onChange={handleChange}
                                            placeholder="White Move"
                                            bg="white"
                                            color="black"
                                            height="45px"
                                        />
                                    </Field.Root>
                                )}

                                {/* Black Move area */}
                                {formData.errorBlackImageUrl ? (
                                    <Field.Root w={"100%"}>
                                        <Field.Label color="white">Black Move</Field.Label>
                                        <Box
                                            bg="white"
                                            borderRadius="md"
                                            height="45px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            w={"100%"}
                                        >

                                            <Image
                                                src={formData.errorBlackImageUrl}
                                                alt="Black move image"
                                                height="45px"
                                                width="auto"
                                                objectFit="contain"
                                            />
                                        </Box>
                                    </Field.Root>
                                ) : (
                                    <Field.Root>
                                        <Field.Label color="white">Black Move</Field.Label>
                                        <Input
                                            name="blackMove"
                                            value={formData.blackMove}
                                            onChange={handleChange}
                                            placeholder="Black Move"
                                            bg="white"
                                            color="black"
                                            height="45px"
                                        />
                                    </Field.Root>
                                )}
                                <Field.Root>
                                    <Field.Label color="white">Text Box 2</Field.Label>
                                    <Input
                                        name="textBox2"
                                        value={formData.textBox2}
                                        onChange={(e) => handleTextBoxChange(2, e.target.value)}
                                        placeholder="Text Box 2"
                                        bg="white"
                                        color="black"
                                        height="45px"
                                        borderColor={
                                            formData.errorColor === "Black" ? "red" : "green"
                                        }
                                        borderWidth="2px"

                                    />
                                </Field.Root>
                            </SimpleGrid>


                            <Box width="100%">
                                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} width="100%">

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
                                            Save Game <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                        </Button>
                                    </HStack>


                                    <HStack spacing={4} width="100%">
                                        <Button
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
                                        </Button>
                                        <Button
                                            bg="#D32C32"
                                            color="white"
                                            height="45px"
                                            flex="1"
                                            borderRadius={"14.82px"}
                                            border={"1px solid"}
                                            borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                        >
                                            Share Game <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                        </Button>
                                    </HStack>
                                </SimpleGrid>
                            </Box>




                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                                <Button
                                    bg="#D32C32"
                                    color="white"
                                    height="45px"
                                    onClick={() => openImageModal("game")}
                                    disabled={previewUrls.length === 0}
                                    borderRadius={"14.82px"}
                                    border={"1px solid"}
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
                                    borderColor={"linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"}
                                >
                                    Moves Images <Box bg={"black"} p={1} borderRadius={"full"} border={"1px solid white"}> <IoMdArrowRoundForward /></Box>
                                </Button>
                            </SimpleGrid>
                        </VStack>
                    </Flex>
                </Container>
            </GradientBg>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1" my={8}>
                {formData.metadata && Object.keys(formData.metadata).length > 0 && (
                    <Box mt={6}>
                        <Text fontSize="xl" fontWeight="semibold" mb={3}>
                            Game Metadata
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
            <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1" my={8}>


                <ChessAnalysis correctMoves={formData.correctMoves} />

            </Container>
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
            />
            <SavePositionModal
                isOpen={isPositionModalOpen}
                onClose={() => setIsPositionModalOpen(false)}
                payload={{ fen: fen, whosTurn: whosturn }}
            />

        </>
    );
}
