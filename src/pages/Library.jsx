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
    Tabs,
    Checkbox,
} from "@chakra-ui/react";

import { MdShare } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/service";
import { toaster } from "../components/Toaster";
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";

import ConfirmDeleteButton from "../components/DeleteConfirmation";
import ShareGameModal from "../components/ShareGame";
import ShareBatchModal from "../components/ShareBatchModal";

const Library = () => {
    const [games, setGames] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState("");
    const [isShareGameModal, setIsShareGameModal] = useState(false);
    const [sharePayload, setSharePayload] = useState({ type: "game", id: null });


    const [selectedGames, setSelectedGames] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [isShareBatchModal, setIsShareBatchModal] = useState(false);
    const [activeTab, setActiveTab] = useState("games");

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
        // navigate(`/analyze/${encodeURIComponent(gameId)}`);
        const url = `/analyze/${encodeURIComponent(gameId)}`;
        window.open(url, "_blank");
    };

    const handleViewPosition = (fen, posID) => {
        // navigate(`/view-position?fen=${encodeURIComponent(fen)}&posID=${encodeURIComponent(posID)}`);
        window.open(
  `/view-position?fen=${encodeURIComponent(fen)}&posID=${encodeURIComponent(posID)}`,
  "_blank",
  "noopener,noreferrer"
);
    };

    const handleShare = (id, type) => {
        setSharePayload({ type, id });
        setIsShareGameModal(true);
    };

    const handleDelete = async (id, type = "game") => {
        try {
            setLoadingId(id);
            const token = localStorage.getItem("id_token");

            const endpoint =
                type === "game"
                    ? `${BASE_URL}/api/Game/DeleteGame`
                    : `${BASE_URL}/api/Position/DeletePosition`;
            let payload = type === "game" ? { gameId: id } : { "positionID": id };

            await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });

            if (type === "game") {
                setGames((prev) => prev.filter((g) => g.gameId !== id));
                setSelectedGames((prev) => prev.filter((gId) => gId !== id));
            } else {
                setPositions((prev) => prev.filter((p) => p.posID !== id));
                setSelectedPositions((prev) => prev.filter((pId) => pId !== id));
            }

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


    const handleSelectGame = (gameId, isChecked) => {
        if (isChecked) {
            setSelectedGames((prev) => [...prev, gameId]);
        } else {
            setSelectedGames((prev) => prev.filter((id) => id !== gameId));
        }
    };

    const handleSelectPosition = (posID, isChecked) => {
        if (isChecked) {
            setSelectedPositions((prev) => [...prev, posID]);
        } else {
            setSelectedPositions((prev) => prev.filter((id) => id !== posID));
        }
    };

    const handleSelectAllGames = (isChecked) => {
        if (isChecked) {
            setSelectedGames(games.map((g) => g.gameId));
        } else {
            setSelectedGames([]);
        }
    };

    const handleSelectAllPositions = (isChecked) => {
        if (isChecked) {
            setSelectedPositions(positions.map((p) => p.posID));
        } else {
            setSelectedPositions([]);
        }
    };

    const handleOpenBatchShare = () => {
        const itemsToShare = activeTab === "games" ? selectedGames : selectedPositions;
        if (itemsToShare.length === 0) {
            toaster.create({
                title: "No items selected",
                description: `Please select at least one ${activeTab === "games" ? "game" : "position"} to share`,
                type: "warning",
            });
            return;
        }
        setIsShareBatchModal(true);
    };

    const handleClearSelection = () => {
        if (activeTab === "games") {
            setSelectedGames([]);
        } else {
            setSelectedPositions([]);
        }
    };

    const renderCard = (item, type = "game") => {
        const imageUrl =
            item?.gameImageUrls?.[0] || item?.imageUrl || "https://placehold.co/600x400";
        const name = item?.notes || (type === "game" ? "Game" : "Position");
        const savedTime = item?.timeSaved
            ? new Date(item.timeSaved).toLocaleString()
            : "Unknown";
        let metadata = JSON.parse(item.metadata);
        const isSelected = selectedGames.includes(item.gameId);

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
                position="relative"
                border={isSelected ? "2px solid #D32C32" : "2px solid transparent"}
            >
                <Flex justifyContent={"flex-end"}>
                    <Checkbox.Root
                        checked={isSelected}
                        onCheckedChange={(e) => handleSelectGame(item.gameId, e.checked)}
                        size="lg"
                        // 
                        bg="white"
                        borderRadius="md"
                        variant={"solid"}
                        p={1}
                    >

                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Flex>

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
                    </Flex>

                    <HStack spacing={2}>
                        <ConfirmDeleteButton
                            type="game"
                            isLoading={loadingId === item.gameId}
                            onConfirm={() => handleDelete(item.gameId, "game")}
                        />
                        <IconButton
                            bg="#D32C32"
                            color="white"
                            width={["100%", "100px"]}
                            borderRadius="10px"
                            border="1px solid"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p={4}
                            onClick={() => handleShare(item.gameId, "game")}
                        >
                            Share <MdShare />
                        </IconButton>
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
        const isSelected = selectedPositions.includes(position.posID);

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
                position="relative"
                border={isSelected ? "2px solid #D32C32" : "2px solid transparent"}
            >
                <Flex justifyContent={"flex-end"}>
                    <Checkbox.Root
                        checked={isSelected}
                        onCheckedChange={(e) => handleSelectPosition(position.posID, e.checked)}
                        size="lg"
                        // 
                        bg="white"
                        borderRadius="md"
                        p={1}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Flex>

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
                    </Flex>

                    <HStack spacing={2}>
                        <ConfirmDeleteButton
                            type="position"
                            isLoading={loadingId === position.posID}
                            onConfirm={() => handleDelete(position.posID, "position")}
                        />
                        <IconButton
                            bg="#D32C32"
                            color="white"
                            width={["100%", "100px"]}
                            borderRadius="10px"
                            border="1px solid"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            p={4}
                            onClick={() => handleShare(position.posID, "position")}
                        >
                            Share <MdShare />
                        </IconButton>
                    </HStack>
                </HStack>
            </Box>
        );
    };

    const selectedCount = activeTab === "games" ? selectedGames.length : selectedPositions.length;
    const totalCount = activeTab === "games" ? games.length : positions.length;

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
                    <Text textAlign={"center"}>Save and finish more games here – your Library powers the personalized gameplay stats and insights that are coming soon to your Profile</Text>
                </Container>
            </Box>

            <Box
                position="absolute"
                top="40%"
                left="15%"
                width="300px"
                height="300px"
                bg="red"
                borderRadius="full"
                filter="blur(100px)"
                opacity="0.3"
                zIndex="0"
            />
            <Box
                position="absolute"
                top="40%"
                right="15%"
                width="350px"
                height="350px"
                bg="red"
                borderRadius="full"
                filter="blur(110px)"
                opacity="0.2"
                zIndex="0"
            />
            <Box
                position="absolute"
                top="45%"
                right="40%"
                width="350px"
                height="350px"
                bg="red"
                borderRadius="full"
                filter="blur(110px)"
                opacity="0.2"
                zIndex="0"
            />

            <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>

                {selectedCount > 0 && (
                    <Flex
                        bg="#D32C32"
                        color="white"
                        p={4}
                        borderRadius="lg"
                        mb={4}
                        justify="space-between"
                        align="center"
                        boxShadow="lg"
                        wrap={"wrap"}
                    >
                        <HStack spacing={4}>
                            <Text fontWeight="200">
                                {selectedCount} {activeTab === "games" ? "game" : "position"}{selectedCount > 1 ? "s" : ""} selected
                            </Text>
                            <Button
                                size="sm"
                                variant="outline"
                                color="white"
                                borderColor="white"
                                _hover={{ bg: "whiteAlpha.200" }}
                                onClick={handleClearSelection}
                            >
                                Clear Selection
                            </Button>
                        </HStack>
                        <Button
                            bg="white"
                            color="#D32C32"
                            _hover={{ bg: "gray.100" }}
                            leftIcon={<FaShareAlt />}
                            onClick={handleOpenBatchShare}
                        >
                            Share Selected
                        </Button>
                    </Flex>
                )}

                <Tabs.Root defaultValue="games" onValueChange={(e) => setActiveTab(e.value)}>
                    <Tabs.List>
                        <Tabs.Trigger value="games">Games</Tabs.Trigger>
                        <Tabs.Trigger value="positions">Positions</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="games">

                        {games.length > 0 && (
                            <Flex justify="space-between" align="center" mb={4} mt={4}>
                                <Checkbox.Root
                                    checked={selectedGames.length === games.length && games.length > 0}
                                    onCheckedChange={(e) => handleSelectAllGames(e.checked)}

                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        <Text fontWeight="500">
                                            Select All ({games.length})
                                        </Text>
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            </Flex>
                        )}

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
                                                <Skeleton height="35px" width="40px" borderRadius="md" />
                                                <Skeleton height="35px" width="40px" borderRadius="md" />
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

                        {positions.length > 0 && (
                            <Flex justify="space-between" align="center" mb={4} mt={4}>
                                <Checkbox.Root
                                    checked={selectedPositions.length === positions.length && positions.length > 0}
                                    onCheckedChange={(e) => handleSelectAllPositions(e.checked)}

                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>
                                        <Text fontWeight="500">
                                            Select All ({positions.length})
                                        </Text>
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            </Flex>
                        )}

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
                                                <Skeleton height="35px" width="40px" borderRadius="md" />
                                                <Skeleton height="35px" width="40px" borderRadius="md" />
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


            <ShareGameModal
                isOpen={isShareGameModal}
                onClose={() => setIsShareGameModal(false)}
                type={sharePayload.type}
                payload={{ gameId: sharePayload.id }}
            />


            <ShareBatchModal
                isOpen={isShareBatchModal}
                onClose={() => setIsShareBatchModal(false)}
                selectedItems={activeTab === "games" ? selectedGames : selectedPositions}
                type={activeTab === "games" ? "game" : "position"}
                onSuccess={() => {
                    if (activeTab === "games") {
                        setSelectedGames([]);
                    } else {
                        setSelectedPositions([]);
                    }
                }}
            />
        </>
    );
};

export default Library;