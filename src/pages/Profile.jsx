import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Input,
    Button,
    Image,
    Container,
    Avatar,
    AvatarGroup,
    
    Heading,
} from "@chakra-ui/react";
import { FiEdit2, FiX, FiCheck, FiUserPlus } from "react-icons/fi";

import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/Toaster";
import axios from "axios";
import { BASE_URL } from "../utils/service";
import AddFriendModal from "../components/AddFriendModal";

function FriendItem({ name, status, hasActions, onAccept, onReject, hasUnfriend, onUnfriend }) {
    return (
        <Flex
            align="center"
            justify="space-between"
            p={2}
            borderRadius="md"
            bg="gray.50"
            _hover={{ bg: "gray.100" }}
            border={"1px solid #e4e4e7"}
        >
            <Flex align="center" gap={3}>
                <Avatar.Root size="sm">
                    <Avatar.Fallback>{name.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                </Avatar.Root>
                <Box>
                    <Text fontSize="14px" fontWeight="medium">{name}</Text>
                    <Text fontSize="12px" color="gray.500">{status}</Text>
                </Box>
            </Flex>
            {hasActions && (
                <Flex gap={2}>
                    <IconButton
                        size="xs"
                        bg="#de252c"
                        borderRadius="full"
                        onClick={onReject}
                    >
                        <FiX />
                    </IconButton>
                    <IconButton
                        size="xs"
                        bg="green"
                        color={"white"}
                        variant={"outline"}
                        borderRadius="full"
                        onClick={onAccept}
                    >
                        <FiCheck />
                    </IconButton>
                </Flex>
            )}
            {hasUnfriend && (
                <Text fontSize={"xs"} color={"red"} cursor={"pointer"} fontWeight={"semibold"} onClick={onUnfriend}>Un Friend</Text>
            )}
        </Flex>
    );
}



export default function ProfileUI() {
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [friendsData, setFriendsData] = useState({
        friends: [],
        pendingInbound: [],
        pendingOutbound: []
    });
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const token = localStorage.getItem("id_token");

    useEffect(() => {
        fetchProfile();
        fetchFriendsOverview();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/Profile/GetProfileDetails`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );


            setProfile(res.data);
            setEmail(res.data.userName);
            setEditValue(res.data.userName);

        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    const fetchFriendsOverview = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/Friends/GetFriendsOverview`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("FRIENDS", res.data);
            setFriendsData(res.data);

        } catch (err) {
            console.error("Error fetching friends:", err);
            if (err.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
        }
    };

    const handleSendFriendRequest = async (username) => {
        try {
            await axios.post(
                `${BASE_URL}/api/Friends/SendFriendRequest?addFriendUserName=${username}&myUserName=${profile.userName}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toaster.create({
                title: "Friend Request Sent",
                description: `Friend request sent to ${username}`,
                type: "success",
            });

            fetchFriendsOverview();
            return true;

        } catch (error) {
            console.error("Error sending friend request:", error);
            toaster.create({
                title: "Error",
                description: error.response?.data || "Failed to send friend request",
                type: "error",
            });

            if (error.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
            return false;
        }
    };

    const handleAcceptFriendRequest = async (userId) => {
        try {
            await axios.post(
                `${BASE_URL}/api/Friends/AcceptFriendRequest?addFriendUserName=${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toaster.create({
                title: "Friend Request Accepted",
                description: "You are now friends!",
                type: "success",
            });

            fetchFriendsOverview();

        } catch (error) {
            console.error("Error accepting friend request:", error);
            toaster.create({
                title: "Error",
                description: error.response?.data || "Failed to accept friend request",
                type: "error",
            });
        }
    };

    const handleRejectFriendRequest = async (userId) => {
        try {
            await axios.post(
                `${BASE_URL}/api/Friends/RejectFriendRequest?addFriendUserName=${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toaster.create({
                title: "Friend Request Rejected",
                description: "Friend request has been rejected",
                type: "info",
            });

            fetchFriendsOverview();

        } catch (error) {
            console.error("Error rejecting friend request:", error);
            toaster.create({
                title: "Error",
                description: error.response?.data || "Failed to reject friend request",
                type: "error",
            });
        }
    };
    const handleUnfriend = async (userId) => {
        try {
            await axios.post(
                `${BASE_URL}/api/Friends/UnFriend?otherUserName=${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toaster.create({
                title: "Unfriend Successfully",
                description: "Friend request has been rejected",
                type: "info",
            });

            fetchFriendsOverview();

        } catch (error) {
            console.error("Error rejecting friend request:", error);
            toaster.create({
                title: "Error",
                description: error.response?.data || "Failed to reject friend request",
                type: "error",
            });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("id_token");

            const response = await axios.post(
                `${BASE_URL}/api/Profile/SetUserName`,
                { userName: editValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toaster.create({
                    title: "Username updated",
                    description: "Your username has been successfully changed.",
                    type: "success",
                });

                setEmail(editValue);
                setIsEditing(false);
            }

        } catch (error) {
            console.error("Error updating username:", error);

            let errorMessage = "Failed to update username";

            if (error.response?.data) {
                const errorData = error.response.data;


                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.setUserNameresponse) {
                    errorMessage = errorData.setUserNameresponse;
                } else if (errorData.errors && errorData.errors.length > 0) {
                    errorMessage = errorData.errors.join(', ');
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            }


            errorMessage = String(errorMessage);


            if (error.response?.status === 409) {
                toaster.create({
                    title: "Username Not Available",
                    description: errorMessage,
                    type: "warning",
                });
                return;
            }


            if (error.response?.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
                return;
            }

            toaster.create({
                title: "Error",
                description: errorMessage,
                type: "warning",
            });

        } finally {
            setLoading(false);
        }
    };
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
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
                <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={32} position="relative" zIndex="2">
                    <div className="about-heading">
                        <h1 className="about-title">Your</h1>
                        <h1 className="about-gradient">Profile</h1>
                    </div>
                </Container>
            </Box>
            <Box position="relative" overflow="hidden" fontFamily="'Clash Display', sans-serif">

                <Box
                    position="absolute"
                    top="17%"
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
                    bottom="10%"
                    left="20%"
                    width="350px"
                    height="350px"
                    bg="red"
                    borderRadius="full"
                    filter="blur(110px)"
                    opacity="0.2"
                    zIndex="0"
                />
                <Box bg="#fef5f5" minH="100vh" py={8}>

                    <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
                        <Heading fontSize={{ base: "2xl", sm: "4xl", md: "5xl", lg: "5xl" }} fontFamily="'Clash Display', sans-serif" color="black" fontWeight="600" mb={8}> Profile & Friends </Heading>

                        <Flex gap={6} wrap={{ base: "wrap", lg: "nowrap" }} align="flex-start">
                            <Flex direction="column" gap={6} w={{ base: "100%", lg: "320px" }} flexShrink={0}>

                                <Box
                                    p={6}
                                    borderRadius="3xl"
                                    boxShadow="sm"
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    w="100%"
                                    position="relative"
                                >
                                    <Flex direction="column" gap={4}>

                                        <Flex align="center" justify="space-between">
                                            <Flex align="center" gap={3}>
                                                <AvatarGroup>
                                                    <Avatar.Root size="xl">
                                                        <Avatar.Fallback
                                                            fontSize="16px"
                                                            fontWeight="bold"
                                                        >
                                                            {email ? email.substring(0, 2).toUpperCase() : 'TM'}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>
                                                </AvatarGroup>

                                                <Box>
                                                    <Text fontWeight="bold" fontSize="18px" color="gray.900">
                                                        {email || 'THINKMOVES#4832'}
                                                    </Text>
                                                    <Text fontSize="14px" color="gray.600" mt={0.5}>
                                                        @{email || 'thinkmoves@exm.com'}
                                                    </Text>
                                                </Box>
                                            </Flex>


                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                borderRadius="md"
                                                bg="gray.50"
                                                aria-label="Edit profile"
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                <FiEdit2 size={16} />
                                            </IconButton>
                                        </Flex>


                                        {isEditing && (
                                            <Box w="100%" pl="76px">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    placeholder="Enter username"
                                                    size="md"
                                                    borderRadius="lg"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                                    disabled={loading}
                                                    autoFocus
                                                />
                                                <Flex gap={2} mt={2}>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="red"
                                                        onClick={handleSave}
                                                        loading={loading}
                                                        flex={1}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setEditValue(email);
                                                        }}
                                                        flex={1}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        )}


                                        <Box w="100%" h="1px" bg="gray.100" />


                                        <Box w="100%">
                                            <Flex align="center" justify="space-between" py={3}>
                                                <Text fontSize="15px" color="gray.700">⭐ Player Rating:</Text>
                                                <Text fontSize="15px" fontWeight="semibold" color="gray.900">{profile?.rating || 0}</Text>
                                            </Flex>
                                            <Flex align="center" justify="space-between" py={3}>
                                                <Text fontSize="15px" color="gray.700">🎯 Games Saved:</Text>
                                                <Text fontSize="15px" fontWeight="semibold" color="gray.900">{profile?.totalGamesSaved || 0}</Text>
                                            </Flex>
                                            <Flex align="center" justify="space-between" py={3}>
                                                <Text fontSize="15px" color="gray.700">📍 Positions Saved:</Text>
                                                <Text fontSize="15px" fontWeight="semibold" color="gray.900">{profile?.totalPositionsSaved || 0}</Text>
                                            </Flex>
                                            <Flex align="center" justify="space-between" py={3}>
                                                <Text fontSize="15px" color="gray.700">💡 Contributions:</Text>
                                                <Text fontSize="15px" fontWeight="semibold" color="gray.900">{profile?.totalContribsSubmitted || 0}</Text>
                                            </Flex>
                                        </Box>

                                        <Flex alignItems={"center"} justifyContent={"space-between"}>
                                            <Button
                                                w="80%"

                                                onClick={handleLogout}
                                                borderRadius="full"
                                                size="lg"
                                                variant="outline"
                                                borderColor="gray.300"
                                                color="gray.700"
                                                fontWeight="medium"
                                                fontSize="14px"
                                                _hover={{
                                                    bg: 'gray.50'
                                                }}
                                            >
                                                LOGOUT
                                            </Button>



                                            <IconButton

                                                size="md"
                                                borderRadius="full"
                                                bg="#DE252C"
                                                color="white"
                                                aria-label="Go to profile"
                                                _hover={{
                                                    bg: 'red.200'
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </IconButton>
                                        </Flex>
                                    </Flex>
                                </Box>


                                <Box
                                  
                                    borderRadius="xl"
                                    boxShadow="sm"
                                    bg="white"
                                    border="1px solid #f0f0f0"
                                >


                                    <Flex direction="column" gap={6} w={{ base: "100%", lg: "320px" }} flexShrink={0} p={2}>


                                        <Box

                                            borderRadius="xl"

                                            bg="white"

                                        >
                                            <Flex align="center" justify="space-between" mb={4}>
                                                <Text fontWeight="bold" fontSize="18px">
                                                    FRIENDS ({friendsData.friends.length})
                                                </Text>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    onClick={() => setIsAddFriendModalOpen(true)}
                                                >
                                                    <FiUserPlus />
                                                </Button>
                                            </Flex>

                                            <Flex direction="column" gap={3}>
                                                {friendsData.friends.length > 0 ? (
                                                    friendsData.friends.map((friend) => (
                                                        <FriendItem
                                                            key={friend.userId}
                                                            name={friend.userName}
                                                            status={formatTimeAgo(friend.sinceOrUpdatedAt)}
                                                            hasActions={false}
                                                            hasUnfriend={true}
                                                            onUnfriend={() => handleUnfriend(friend.userName)}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text textAlign="center" color="gray.500" py={4} fontSize="sm">
                                                        No friends yet
                                                    </Text>
                                                )}
                                            </Flex>
                                        </Box>


                                        <Box

                                            borderRadius="xl"

                                            bg="white"

                                        >
                                            <Text fontWeight="bold" fontSize="18px" mb={4}>
                                                INCOMING REQUESTS ({friendsData.pendingInbound.length})
                                            </Text>

                                            <Flex direction="column" gap={3}>
                                                {friendsData.pendingInbound.length > 0 ? (
                                                    friendsData.pendingInbound.map((request) => (
                                                        <FriendItem
                                                            key={request.userId}
                                                            name={request.userName}
                                                            status={`Request ${formatTimeAgo(request.sinceOrUpdatedAt)}`}
                                                            hasActions={true}
                                                            onAccept={() => handleAcceptFriendRequest(request.userName)}
                                                            onReject={() => handleRejectFriendRequest(request.userName)}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text textAlign="center" color="gray.500" py={4} fontSize="sm">
                                                        No incoming requests
                                                    </Text>
                                                )}
                                            </Flex>
                                        </Box>


                                        <Box

                                            borderRadius="xl"

                                            bg="white"

                                        >
                                            <Text fontWeight="bold" fontSize="18px" mb={4}>
                                                SENT REQUESTS ({friendsData.pendingOutbound.length})
                                            </Text>

                                            <Flex direction="column" gap={3}>
                                                {friendsData.pendingOutbound.length > 0 ? (
                                                    friendsData.pendingOutbound.map((request) => (
                                                        <FriendItem
                                                            key={request.userId}
                                                            name={request.userName}
                                                            status={`Sent ${formatTimeAgo(request.sinceOrUpdatedAt)}`}
                                                            hasActions={false}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text textAlign="center" color="gray.500" py={4} fontSize="sm">
                                                        No sent requests
                                                    </Text>
                                                )}
                                            </Flex>
                                        </Box>


                                        {/* <Button
                                            w="100%"
                                            variant="outline"
                                            borderRadius="full"
                                            leftIcon={<FiUserPlus />}
                                            colorScheme="red"
                                            onClick={() => setIsAddFriendModalOpen(true)}
                                        >
                                            ADD FRIEND
                                        </Button> */}
                                    </Flex>

                                    <Flex justify="space-between" mb={4} p={2} borderTop="1px solid #f0f0f0">
                                        <Box textAlign="center">
                                            <Text fontSize="24px" fontWeight="bold">{friendsData.pendingOutbound.length}</Text>
                                            <Text fontSize="11px" color="gray.500">FRIENDS REQUEST SENT</Text>
                                        </Box>
                                        <Box textAlign="center">
                                            <Text fontSize="24px" fontWeight="bold">{friendsData.pendingInbound.length}</Text>
                                            <Text fontSize="11px" color="gray.500">FRIENDS INCOMING REQUEST</Text>
                                        </Box>
                                    </Flex>

                                    <Button
                                        w="100%"
                                        variant="outline"
                                        borderRadius="full"
                                        leftIcon={<FiUserPlus />}
                                        colorScheme="red"
                                        mb={2}
                                        onClick={() => setIsAddFriendModalOpen(true)}
                                    >
                                        ENTER USERNAME
                                    </Button>
                                </Box>
                            </Flex>

                            {/* RIGHT SIDE CONTENT */}
                            <Flex direction="column" flex={1} gap={6} w="100%">
                                <Box
                                    p={6}
                                    borderRadius="xl"
                                    boxShadow="sm"
                                    bg="white"
                                    border="1px solid #f0f0f0"
                                    flex="1"
                                    display="flex"
                                    flexDirection="column"
                                    height="100%"
                                >
                                    <Flex align="center" gap={2} mb={4}>
                                       
                                        <Text fontWeight="bold" fontSize="18px">
                                            GAMEPLAY INSIGHTS
                                        </Text>
                                    </Flex>

                                    <Flex flex="1" align="center" justify="center">
                                        <Text>Coming Soon</Text>
                                    </Flex>
                                </Box>

                                <Box
                                    p={6}
                                    borderRadius="xl"
                                    boxShadow="sm"
                                    bg="white"
                                    border="1px solid #f0f0f0"
                                    flex="1"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Flex align="center" gap={2} mb={4}>
                                       
                                        <Text fontWeight="bold" fontSize="18px">
                                            ADVANCED STATS
                                        </Text>
                                    </Flex>

                                    <Flex flex="1" align="center" justify="center">
                                        <Text>Coming Soon</Text>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>
                    </Container>
                </Box>
            </Box>


            <AddFriendModal
                isOpen={isAddFriendModalOpen}
                onClose={() => setIsAddFriendModalOpen(false)}
                onSendRequest={handleSendFriendRequest}
            />
        </>
    );
}