"use client";
import React, { useState } from "react";
import {
    Box,
    Dialog,
    Portal,
    VStack,
    Text,
    SimpleGrid,
    Image,
    IconButton,
    HStack,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const ImagePreviewModal = ({
    isImageModalOpen,
    setIsImageModalOpen,
    metadataImages = [],
    moveImages = [],
    imageList = [],
    type = "",
}) => {
  
    const groupedMoves = moveImages.reduce((acc, move) => {
        acc[move.moveNumber] = acc[move.moveNumber] || {};
        acc[move.moveNumber][move.moveColor] = move.url;
        return acc;
    }, {});

    const moveKeys = Object.keys(groupedMoves).sort((a, b) => a - b);
    const totalMoves = moveKeys.length;

    const movesPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(totalMoves / movesPerPage);

    const currentMoveGroup = moveKeys.slice(
        currentPage * movesPerPage,
        currentPage * movesPerPage + movesPerPage
    );

    const handlePrevGroup = () => {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNextGroup = () => {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    return (
        <Dialog.Root open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={["95vw", "80vw", "7xl"]}
                        p="6"
                        borderRadius="xl"
                        bg="white"
                        position="relative"
                    >
                     
                        <IconButton
                            aria-label="Close modal"
                            position="absolute"
                            top="3"
                            right="3"
                            variant="ghost"
                            color="gray.600"
                            _hover={{ bg: "gray.100" }}
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            <FaTimes />
                        </IconButton>

                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="bold">
                                {type === "game"
                                    ? "Game Image Preview"
                                    : "Move Images Preview"}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={8} align="stretch">
                               
                                {type === "game" && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="semibold" mb={3}>
                                            Game Images
                                        </Text>
                                        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                                            {imageList.map((img, index) => (
                                                <Box
                                                    key={index}
                                                    borderRadius="md"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    overflow="hidden"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    bg="gray.50"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`Game ${index}`}
                                                        objectFit="cover"
                                                        width="100%"
                                                        height="auto"
                                                        maxH={["150px", "200px", "600px"]}
                                                    />
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )}

                             
                                {metadataImages?.length > 0 && type === "moves" && (
                                    <Box>
                                        <Text fontSize="lg" fontWeight="semibold" mb={3}>
                                            Metadata Images
                                        </Text>
                                        <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                                            {metadataImages.map((item, index) => (
                                                <HStack key={index} spacing={2} align="start">
                                                    <Text fontSize="sm" color="gray.700" fontWeight="medium">
                                                        {item.key} :
                                                    </Text>
                                                    <Box
                                                        w="100%"
                                                        borderRadius="md"
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        overflow="hidden"
                                                        bg="gray.50"
                                                        textAlign="center"
                                                        p={2}
                                                    >
                                                        <Image
                                                            src={item.url}
                                                            alt={`Metadata ${item.key}`}
                                                            objectFit="cover"
                                                            width="100%"
                                                            height="auto"
                                                            maxH={["120px", "150px", "180px"]}
                                                            borderRadius="sm"
                                                            mb={2}
                                                        />
                                                    </Box>
                                                </HStack>
                                            ))}
                                        </SimpleGrid>
                                    </Box>
                                )}


                              
                                {type === "moves" && moveImages?.length > 0 ? (
                                    <VStack spacing={6}>
                                        <Text fontSize="lg" fontWeight="semibold">
                                            Showing Moves {currentPage * movesPerPage + 1} –{" "}
                                            {Math.min(
                                                (currentPage + 1) * movesPerPage,
                                                totalMoves
                                            )}
                                        </Text>
                                        <HStack justify="center" spacing={[2,4,8]} wrap="wrap">
                                         
                                            {currentMoveGroup.map((moveNum) => {
                                                const move = groupedMoves[moveNum];
                                                return (
                                                    <Box 
                                                        key={moveNum} 
                                                        border="1px solid #D32C32" 
                                                        borderRadius="md" 
                                                        padding={2}
                                                        minW={["150px", "200px", "250px"]}
                                                        flex="1"
                                                    >
                                                        <Text
                                                            fontWeight="semibold"
                                                            textAlign="center"
                                                            mb={2}
                                                            color="gray.700"
                                                        >
                                                            Move {moveNum}
                                                        </Text>

                                                        <HStack justify="center" spacing={[2,4,8]} wrap="wrap">
                                                            {move?.WhiteMove && (
                                                                <Box flex="1" minW={["120px", "150px", "200px"]}>
                                                                    <Text textAlign="center" mb={1} color="#D32C32">
                                                                        White Move
                                                                    </Text>
                                                                    <Image
                                                                        src={move.WhiteMove}
                                                                        alt={`White Move ${moveNum}`}
                                                                        borderRadius="md"
                                                                        border="1px solid"
                                                                        borderColor="gray.200"
                                                                        width="100%"
                                                                        height="auto"
                                                                        maxH={["150px", "200px", "250px"]}
                                                                        objectFit="contain"
                                                                    />
                                                                </Box>
                                                            )}

                                                            {move?.BlackMove && (
                                                                <Box flex="1" minW={["120px", "150px", "200px"]}>
                                                                    <Text textAlign="center" mb={1} color="#D32C32">
                                                                        Black Move
                                                                    </Text>
                                                                    <Image
                                                                        src={move.BlackMove}
                                                                        alt={`Black Move ${moveNum}`}
                                                                        borderRadius="md"
                                                                        border="1px solid"
                                                                        borderColor="gray.200"
                                                                        width="100%"
                                                                        height="auto"
                                                                        maxH={["150px", "200px", "250px"]}
                                                                        objectFit="contain"
                                                                    />
                                                                </Box>
                                                            )}
                                                        </HStack>
                                                    </Box>
                                                );
                                            })}
                                        </HStack>
                                   
                                        <HStack justify="center" spacing={4} mt={4}>
                                            <IconButton
                                                aria-label="Previous 5 moves"
                                                onClick={handlePrevGroup}
                                                bg="#D32C32"
                                                color="white"
                                                _hover={{ bg: "rgba(0,0,0,0.8)" }}
                                            >
                                                <FaArrowLeft />
                                            </IconButton>

                                            <Text fontSize="sm" color="gray.500">
                                                Page {currentPage + 1} / {totalPages}
                                            </Text>

                                            <IconButton
                                                aria-label="Next 5 moves"
                                                onClick={handleNextGroup}
                                                bg="#D32C32"
                                                color="white"
                                                _hover={{ bg: "rgba(0,0,0,0.8)" }}
                                            >
                                                <FaArrowRight />
                                            </IconButton>
                                        </HStack>
                                    </VStack>
                                ) : (
                                    type === "moves" && (
                                        <Text textAlign="center" color="gray.600">
                                            No move images to display.
                                        </Text>
                                    )
                                )}
                            </VStack>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default ImagePreviewModal;
