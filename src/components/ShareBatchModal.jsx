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
    Textarea,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../utils/service";

function ShareBatchModal({ isOpen, onClose, selectedItems = [], type = "game", onSuccess }) {
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
                `${BASE_URL}/api/Friends/FindUser`,
                {},
                {
                    params: { searchUserName: searchTerm },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const results = response.data && response.data.playerID ? [response.data] : [];

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

    const handleShareBatch = async () => {
        if (!selectedUser) {
            toaster.create({
                title: "Error",
                description: "Please select a user to share with",
                type: "error",
            });
            return;
        }

        if (selectedItems.length === 0) {
            toaster.create({
                title: "Error",
                description: "No items selected to share",
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

         
            const shareSingleItemRequest = selectedItems.map((itemId) => ({
                itemID: itemId,
                message: message || "",
            }));

            const sharePayload = {
                recipientUsername: selectedUser.userName,
                shareSingleItemRequest: shareSingleItemRequest,
            };

            const response = await axios.post(
                `${BASE_URL}/api/Shares/ShareBatchItems`,
                sharePayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toaster.create({
                    title: "Items Shared",
                    description: `Successfully shared ${selectedItems.length} ${type}${
                        selectedItems.length > 1 ? "s" : ""
                    } with ${selectedUser.userName}`,
                    type: "success",
                });

               
                setUsername("");
                setMessage("");
                setSearchResults([]);
                setSelectedUser(null);
                
                if (onSuccess) {
                    onSuccess();
                }
                
                onClose();
            }
        } catch (error) {
            console.error("Error sharing items:", error);

            let errorMessage = "Failed to share items";

            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === "string") {
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
                        p="1"
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
                            zIndex="10"
                        >
                            <FaTimes />
                        </Button>

                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="bold">
                                Share Multiple {type === "game" ? "Games" : "Positions"}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                <Box
                                    bg="blue.50"
                                    p={3}
                                    borderRadius="md"
                                    borderLeft="4px solid"
                                    borderColor="blue.500"
                                >
                                    <Text fontSize="sm" color="blue.800">
                                        You are sharing {selectedItems.length} {type}
                                        {selectedItems.length > 1 ? "s" : ""}
                                    </Text>
                                </Box>

                                <Text fontSize="sm" color="gray.600" fontWeight="600">
                                    Search for a user:
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
                                                bg={
                                                    selectedUser?.playerID === user.playerID
                                                        ? "red.50"
                                                        : "gray.50"
                                                }
                                                cursor="pointer"
                                                _hover={{ bg: "gray.100" }}
                                                onClick={() => handleSelectUser(user)}
                                                border="2px solid"
                                                borderColor={
                                                    selectedUser?.playerID === user.playerID
                                                        ? "red.500"
                                                        : "transparent"
                                                }
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

                              
                                {!searchLoading &&
                                    username.trim().length > 0 &&
                                    searchResults.length === 0 && (
                                        <Box
                                            p={4}
                                            textAlign="center"
                                            color="gray.500"
                                            bg="gray.50"
                                            borderRadius="md"
                                        >
                                            <Text fontSize="sm">
                                                No users found with username "{username}"
                                            </Text>
                                        </Box>
                                    )}

                               
                                <Box>
                                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="600">
                                        Add a message
                                    </Text>
                                    <Textarea
                                        placeholder={`Write a message to share with all ${selectedItems.length} ${type}${selectedItems.length > 1 ? "s" : ""}...`}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        bg="gray.50"
                                        minH="120px"
                                        resize="vertical"
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                        This message will be sent with all {selectedItems.length} items
                                    </Text>
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
                                    onClick={handleShareBatch}
                                    loading={requestSending}
                                    disabled={!selectedUser || requestSending || selectedItems.length === 0}
                                >
                                    Share {selectedItems.length} Item{selectedItems.length > 1 ? "s" : ""}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default ShareBatchModal;