import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Container,
    SimpleGrid,
    Image,
    Text,
    Heading,
    Button,
    VStack,
    HStack,
    IconButton,
    Flex,
    Skeleton,
    SkeletonCircle,
    Spinner,
    Tabs,
} from "@chakra-ui/react";

import { MdDelete, MdOutlineArrowOutward } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/service";
import { toaster } from "../components/Toaster";
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";

import ConfirmDeleteButton from "../components/DeleteConfirmation";

const Library = () => {
    const [games, setGames] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState("");
    const navigate = useNavigate();

    const fetchGames = async () => {
        const token = localStorage.getItem("id_token");
        if (!token) {
            console.warn("⚠️ No token found — redirecting to login");
            window.location.href = "/login";
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}/api/Game/GetAllGames`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (Array.isArray(response.data)) setGames(response.data);
            else setGames([]);
        } catch (error) {
            console.error("❌ Error fetching games:", error);
            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPositions = async () => {
        const token = localStorage.getItem("id_token");
        try {
            const response = await axios.post(
                `${BASE_URL}/api/Position/GetAllPositions`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (Array.isArray(response.data)) setPositions(response.data);
        } catch (error) {
            console.error("Error fetching positions:", error);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchPositions();
    }, []);

    const handleViewGame = (gameId) => {
        navigate(`/analyze/${encodeURIComponent(gameId)}`);
    };

    const handleViewPosition = (fen, posID) => {
        navigate(`/view-position?fen=${encodeURIComponent(fen)}&posID=${encodeURIComponent(posID)}`);

    };

    const handleDelete = async (id, type = "game") => {
        try {
            setLoadingId(id);
            const token = localStorage.getItem("id_token");

            const endpoint =
                type === "game"
                    ? `${BASE_URL}/api/Game/DeleteGame`
                    : `${BASE_URL}/api/Position/DeletePosition`;
            let payload = type === "game" ? { gameId: id } : {
                "positionID": id
            }

            await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });

            if (type === "game") setGames((prev) => prev.filter((g) => g.gameId !== id));
            else setPositions((prev) => prev.filter((p) => p.posID !== id));

            toaster.create({
                title: `${type === "game" ? "Game" : "Position"} Deleted`,
                description: "Successfully removed from your library.",
                type: "success",
            });
        } catch (error) {
            console.error("Error deleting:", error);
            toaster.create({
                title: "Error",
                description: "Something went wrong",
                type: "error",
            });
        } finally {
            setLoadingId(null);
        }
    };

    const renderCard = (item, type = "game") => {
        const imageUrl =
            item?.gameImageUrls?.[0] || item?.imageUrl || "https://placehold.co/600x400";
        const name = item?.notes || (type === "game" ? "Game" : "Position");
        const savedTime = item?.timeSaved
            ? new Date(item.timeSaved).toLocaleString()
            : "Unknown";
        let metadata = JSON.parse(item.metadata)
        return (
            <Box
                key={item.gameId || item.positionId}
                bg="white"
                borderRadius="lg"
                boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                }}
                display="flex"
                flexDir="column"
            >
                <Box h="220px" w="100%" overflow="hidden" padding={2} borderRadius="lg">
                    <Image
                        src={imageUrl}
                        alt={name}
                        borderRadius="lg"
                        h="100%"
                        w="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                    />
                </Box>

                <VStack align="start" p={4} spacing={2} flex="1">
                    <Text fontWeight="700" fontSize="md" noOfLines={1} title={name}>
                        {metadata?.WhiteName} vs {metadata?.BlackName}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        {savedTime}
                    </Text>
                </VStack>

                <HStack
                    justify="space-between"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    p={3}
                    spacing={3}
                >
                    <Flex align={"center"}>
                        <Button
                            variant="outline"
                            size="sm"
                            border={"1px solid"}
                            borderColor={"black"}
                            borderRadius={"full"}
                            onClick={() =>
                                type === "game"
                                    ? handleViewGame(item.gameId)
                                    : handleViewPosition(item.fen, item.posID)
                            }
                            px={8}
                            me={2}
                        >
                            View
                        </Button>
                        <Box
                            as="button"
                            bg="#D32C32"
                            color="white"
                            borderRadius="full"
                            w="25px"
                            h="25px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() =>
                                type === "game"
                                    ? handleViewGame(item.gameId)
                                    : handleViewPosition(item.fen, item.posID)
                            }
                            _hover={{ bg: "#b92027" }}
                        >
                            <MdOutlineArrowOutward style={{ fontSize: "12px" }} />
                        </Box>
                    </Flex>

                    <HStack spacing={2}>
                        <ConfirmDeleteButton
                            type="game"
                            isLoading={loadingId === item.gameId}
                            onConfirm={() => handleDelete(item.gameId, "game")}
                        />
                        {/* <IconButton
                            bg="#D32C32"
                            color="white"
                            width={["100%", "100px"]}
                            borderRadius="10px"
                            border="1px solid"
                            borderColor="linear-gradient(265.38deg, rgba(255,255,255,0.6) 24.8%, rgba(255,255,255,0.3) 85.32%)"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p={4}
                            onClick={() => handleDelete(item.gameId || item.positionId, type)}
                        >
                            Delete {loadingId === (item.gameId || item.positionId) ? <Spinner size="sm" /> : <MdDelete />}
                        </IconButton> */}
                    </HStack>
                </HStack>
            </Box>
        );
    };
    const PositionCard = (position) => {

        const imageUrl =
            position?.imageUrl ||
            `https://www.chess.com/dynboard?fen=${encodeURIComponent(position.fen)}&size=2`;
        const name = position?.whosTurn === "w" ? "Last Position - White" : "Last Position - Black" || "Position";
        const savedTime = position?.createdTime
            ? new Date(position.createdTime).toLocaleString()
            : "Unknown";

        return (
            <Box
                bg="white"
                borderRadius="lg"
                boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                }}
                display="flex"
                flexDir="column"
            >
                <Box h="220px" w="100%" overflow="hidden" padding={2} borderRadius="lg">
                    <Image
                        src={imageUrl}
                        alt={name}
                        borderRadius="lg"
                        h="100%"
                        w="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                    />
                </Box>

                <VStack align="start" p={4} spacing={2} flex="1">
                    <Text fontWeight="700" fontSize="md" noOfLines={1} title={name}>
                        {name}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        {savedTime}
                    </Text>
                </VStack>

                <HStack
                    justify="space-between"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    p={3}
                    spacing={3}
                >
                    <Flex align={"center"}>
                        <Button
                            variant="outline"
                            size="sm"
                            border={"1px solid"}
                            borderColor={"black"}
                            borderRadius={"full"}
                            onClick={() => handleViewPosition(position.fen, position.posID)}
                            px={8}
                            me={2}
                        >
                            View
                        </Button>
                        <Box
                            as="button"
                            bg="#D32C32"
                            color="white"
                            borderRadius="full"
                            w="25px"
                            h="25px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() => handleViewPosition(position.fen, position.posID)}
                            _hover={{ bg: "#b92027" }}
                        >
                            <MdOutlineArrowOutward style={{ fontSize: "12px" }} />
                        </Box>
                    </Flex>
                    <ConfirmDeleteButton
                        type="position"
                        isLoading={loadingId === position.posID}
                        onConfirm={() => handleDelete(position.posID, "position")}
                    />
                    {/* <IconButton
                        bg="#D32C32"
                        color="white"
                        width={["100%", "100px"]}
                        borderRadius="10px"
                        border="1px solid"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        p={4}
                        onClick={() => handleDelete(position.posID, "position")}
                    >
                        Delete {loadingId === position.posID ? <Spinner size="sm" /> : <MdDelete />}
                    </IconButton> */}
                </HStack>
            </Box>
        );
    };

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
                    <Heading
                        fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                        fontFamily="'Clash Display', sans-serif"
                        color="white"
                        fontWeight="600"
                        textAlign="center"
                        mb={10}
                    >
                        Your Library
                    </Heading>
                </Container>
            </Box>

            <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
                <VStack align={"start"} mb={8}> <Heading fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "5xl" }} fontFamily="'Clash Display', sans-serif" color="black" fontWeight="600" > Library </Heading> <Text>All your analyzed games and </Text> <Text>saved positions — organized and easy to explore.</Text> </VStack>

                <Tabs.Root defaultValue="games">
                    <Tabs.List>
                        <Tabs.Trigger value="games">
                            {/* <LuFolder /> */}
                            Games
                        </Tabs.Trigger>
                        <Tabs.Trigger value="positions">
                            {/* <RiLayoutGridFill /> */}
                            Positions
                        </Tabs.Trigger>
                    </Tabs.List>


                    <Tabs.Content value="games">
                        {loading ? (
                            <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }} gap={8}>
                                {[...Array(6)].map((_, i) => (
                                    <Box
                                        key={i}
                                        bg="white"
                                        borderRadius="lg"
                                        boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                                        overflow="hidden"
                                        display="flex"
                                        flexDir="column"
                                    >
                                        <Skeleton height="220px" borderRadius="lg" />
                                        <VStack align="start" p={4} spacing={2} flex="1">
                                            <Skeleton height="20px" width="70%" />
                                            <Skeleton height="16px" width="50%" />
                                        </VStack>
                                        <HStack
                                            justify="space-between"
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                            p={3}
                                            spacing={3}
                                        >
                                            <HStack spacing={3}>
                                                <Skeleton height="35px" width="80px" borderRadius="full" />
                                                <SkeletonCircle size="8" />
                                            </HStack>
                                            <HStack spacing={2}>
                                                <Skeleton height="35px" width="90px" borderRadius="10px" />
                                                <Skeleton height="35px" width="90px" borderRadius="10px" />
                                            </HStack>
                                        </HStack>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        ) : games.length === 0 ? (
                            <Flex justify="center" align="center" minH="50vh">
                                <Text color="gray.600" fontSize="xl">
                                    No games found in your library.
                                </Text>
                            </Flex>
                        ) : (
                            <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }} gap={8}>
                                {games.map((game) => renderCard(game, "game"))}
                            </SimpleGrid>
                        )}
                    </Tabs.Content>


                    <Tabs.Content value="positions">
                        {loading ? (

                            <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }} gap={8}>
                                {[...Array(6)].map((_, i) => (
                                    <Box
                                        key={i}
                                        bg="white"
                                        borderRadius="lg"
                                        boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                                        overflow="hidden"
                                        display="flex"
                                        flexDir="column"
                                    >
                                        <Skeleton height="220px" borderRadius="lg" />
                                        <VStack align="start" p={4} spacing={2} flex="1">
                                            <Skeleton height="20px" width="70%" />
                                            <Skeleton height="16px" width="50%" />
                                        </VStack>
                                        <HStack
                                            justify="space-between"
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                            p={3}
                                            spacing={3}
                                        >
                                            <HStack spacing={3}>
                                                <Skeleton height="35px" width="80px" borderRadius="full" />
                                                <SkeletonCircle size="8" />
                                            </HStack>
                                            <HStack spacing={2}>
                                                <Skeleton height="35px" width="90px" borderRadius="10px" />
                                                <Skeleton height="35px" width="90px" borderRadius="10px" />
                                            </HStack>
                                        </HStack>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        ) : positions.length === 0 ? (
                            <Flex justify="center" align="center" minH="50vh">
                                <Text color="gray.600" fontSize="xl">
                                    No positions saved yet.
                                </Text>
                            </Flex>
                        ) : (

                            <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }} gap={8}>

                                {positions.map((pos) => PositionCard(pos))}
                            </SimpleGrid>
                        )}
                    </Tabs.Content>

                </Tabs.Root>
            </Container>
        </>
    );
};

export default Library;
