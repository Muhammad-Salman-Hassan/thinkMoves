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
    Spinner
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../utils/service";

function AddFriendModal({ isOpen, onClose, onSendRequest }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [requestSending, setRequestSending] = useState(false);
    const debounceTimer = useRef(null);

    // Clear search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setUsername("");
            setSearchResults([]);
            setSelectedUser(null);
            setSearchLoading(false);
        }
    }, [isOpen]);

    // Debounced search when user stops typing
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (username.trim().length > 0) {
            setSearchLoading(true);
            debounceTimer.current = setTimeout(() => {
                searchUsers(username.trim());
            }, 500); // Wait 500ms after user stops typing
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
                `${BASE_URL}/api/Friends/FindUser`,{},
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
                // User not found - not an error, just no results
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

    const handleSendRequest = async () => {
        if (!selectedUser) {
            toaster.create({
                title: "Error",
                description: "Please select a user to send friend request",
                type: "error",
            });
            return;
        }

        // Prevent multiple requests at once
        if (requestSending) {
            return;
        }

        setRequestSending(true);
        const success = await onSendRequest(selectedUser.userName);
        setRequestSending(false);
        
        if (success) {
            setUsername("");
            setSearchResults([]);
            setSelectedUser(null);
            onClose();
        }
    };

    const handleClose = () => {
        setUsername("");
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
                                Add Friend
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

                                {/* Search Results */}
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

                                {/* Selected User Display */}
                                {selectedUser && (
                                    <Box
                                        p={3}
                                        bg="red.50"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="red.200"
                                    >
                                        <Text fontSize="sm" color="gray.600" mb={2}>
                                            Selected user:
                                        </Text>
                                        <Flex align="center" gap={3}>
                                            <Avatar.Root size="sm">
                                                <Avatar.Fallback>
                                                    {selectedUser.userName.substring(0, 2).toUpperCase()}
                                                </Avatar.Fallback>
                                            </Avatar.Root>
                                            <Text fontSize="14px" fontWeight="bold">
                                                {selectedUser.userName}
                                            </Text>
                                        </Flex>
                                    </Box>
                                )}
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
                                    onClick={handleSendRequest}
                                    loading={requestSending}
                                    disabled={!selectedUser || requestSending}
                                >
                                    Send Request
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export default AddFriendModal;