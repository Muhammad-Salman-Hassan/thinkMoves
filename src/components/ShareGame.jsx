import { useState, useEffect, useRef } from "react";
import { toaster } from "./Toaster";
import {
    Button,
    Dialog,
    HStack,
    Input,
    Portal,
    Text,
    VStack,
    Box,
    Flex,
    Avatar,
    Spinner,
    Textarea
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../utils/service";

function ShareGameModal({ isOpen, onClose, payload, type = "game" }) {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestSending, setRequestSending] = useState(false);
    const debounceTimer = useRef(null);


    useEffect(() => {
        if (!isOpen) {
            setUsername("");
            setMessage("");
            setSearchResults([]);
            setSelectedUser(null);
            setSearchLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (username.trim().length > 0) {
            setSearchLoading(true);
            debounceTimer.current = setTimeout(() => {
                searchUsers(username.trim());
            }, 500);
        } else {
            setSearchResults([]);
            setSearchLoading(false);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [username]);

    const searchUsers = async (searchTerm) => {
        try {
            const token = localStorage.getItem("id_token");
            const response = await axios.post(
                `${BASE_URL}/api/Friends/FindUser`, {},
                {
                    params: { searchUserName: searchTerm },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );


            const results = response.data && response.data.playerID
                ? [response.data]
                : [];

            setSearchResults(results);
            setSearchLoading(false);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
            setSearchLoading(false);

            if (error.response?.status === 404) {

                return;
            }

            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleShareGame = async () => {
        if (!selectedUser) {
            toaster.create({
                title: "Error",
                description: "Please select a user to share the game with",
                type: "error",
            });
            return;
        }

        if (!payload?.gameId) {
            toaster.create({
                title: "Error",
                description: "Game ID is missing",
                type: "error",
            });
            return;
        }


        if (requestSending) {
            return;
        }

        setRequestSending(true);

        try {
            const token = localStorage.getItem("id_token");

            const sharePayload = {
                recipientUsername: selectedUser.userName,
                itemID: payload.gameId,
                message: message || ""
            };

            const response = await axios.post(
                `${BASE_URL}/api/Shares/ShareSingleItem`,
                sharePayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toaster.create({
                    title: "Game Shared",
                    description: `Game shared successfully with ${selectedUser.userName}`,
                    type: "success",
                });


                setUsername("");
                setMessage("");
                setSearchResults([]);
                setSelectedUser(null);
                onClose();
            }
        } catch (error) {
            console.error("Error sharing game:", error);

            let errorMessage = "Failed to share game";

            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.errors) {
                    errorMessage = errorData.errors;
                }
            }

            toaster.create({
                title: "Error",
                description: String(errorMessage),
                type: "error",
            });

            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
        } finally {
            setRequestSending(false);
        }
    };

    const handleClose = () => {
        setUsername("");
        setMessage("");
        setSearchResults([]);
        setSelectedUser(null);
        setRequestSending(false);
        onClose();
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="md"
                        p="5"
                        borderRadius="xl"
                        bg="white"
                        position="relative"
                    >
                        <Button
                            position="absolute"
                            top="3"
                            right="3"
                            variant="ghost"
                            onClick={handleClose}
                            color="gray.500"
                        >
                            <FaTimes />
                        </Button>

                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="bold">
                                Share {type === "game" ? "Game" : "Position"}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    Search for a user by their username:
                                </Text>

                                <Box position="relative">
                                    <Input
                                        placeholder="Enter username..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        bg="gray.50"
                                    />
                                    {searchLoading && (
                                        <Box
                                            position="absolute"
                                            right="3"
                                            top="50%"
                                            transform="translateY(-50%)"
                                        >
                                            <Spinner size="sm" />
                                        </Box>
                                    )}
                                </Box>


                                {searchResults.length > 0 && (
                                    <VStack
                                        align="stretch"
                                        spacing={2}
                                        maxH="200px"
                                        overflowY="auto"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        p={2}
                                    >
                                        {searchResults.map((user) => (
                                            <Flex
                                                key={user.playerID}
                                                align="center"
                                                justify="space-between"
                                                p={3}
                                                borderRadius="md"
                                                bg={selectedUser?.playerID === user.playerID ? "red.50" : "gray.50"}
                                                cursor="pointer"
                                                _hover={{ bg: "gray.100" }}
                                                onClick={() => handleSelectUser(user)}
                                                border="2px solid"
                                                borderColor={selectedUser?.playerID === user.playerID ? "red.500" : "transparent"}
                                            >
                                                <Flex align="center" gap={3}>
                                                    <Avatar.Root size="sm">
                                                        <Avatar.Fallback>
                                                            {user.userName.substring(0, 2).toUpperCase()}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>
                                                    <Box>
                                                        <Text fontSize="14px" fontWeight="medium">
                                                            {user.userName}
                                                        </Text>
                                                        {user.email && (
                                                            <Text fontSize="12px" color="gray.500">
                                                                {user.email}
                                                            </Text>
                                                        )}
                                                    </Box>
                                                </Flex>
                                                {selectedUser?.playerID === user.playerID && (
                                                    <Box color="red.500">
                                                        <FiCheck size={20} />
                                                    </Box>
                                                )}
                                            </Flex>
                                        ))}
                                    </VStack>
                                )}

                                {/* No Results Message */}
                                {!searchLoading && username.trim().length > 0 && searchResults.length === 0 && (
                                    <Box
                                        p={4}
                                        textAlign="center"
                                        color="gray.500"
                                        bg="gray.50"
                                        borderRadius="md"
                                    >
                                        <Text fontSize="sm">No users found with username "{username}"</Text>
                                    </Box>
                                )}




                                <Box>
                                    <Text fontSize="sm" color="gray.600" mb={2}>
                                        Add a message
                                    </Text>
                                    <Textarea
                                        placeholder="Write a message to share with the game..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        bg="gray.50"
                                        minH="100px"
                                        resize="vertical"
                                    />
                                </Box>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack justify="flex-end" spacing={3}>
                                <Button onClick={handleClose} variant="outline">
                                    Cancel
                                </Button>
                                <Button
                                    bg="#D32C32"
                                    color="white"
                                    _hover={{ bg: "#b0262b" }}
                                    onClick={handleShareGame}
                                    loading={requestSending}
                                    disabled={!selectedUser || requestSending}
                                >
                                    Share {type === "game" ? "Game" : "Position"}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default ShareGameModal;