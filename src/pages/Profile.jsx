import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Text,
    Avatar,
    IconButton,
    Input,
    SimpleGrid,
    Button,
    AvatarGroup,
    Image,
    Heading,
    Container,
} from "@chakra-ui/react";
import { FiEdit2, FiX, FiCheck } from "react-icons/fi";
import orb1 from "../assets/orb1.png";
import gradient from "../assets/gradientbg.png";
import gradient1 from "../assets/gradientbg1.png";
import whitegradient from "../assets/whitebg.png";
import whitegradient1 from "../assets/whitebg1.png";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/Toaster";
import axios from "axios";
import { BASE_URL } from "../utils/service";

function EditableUsername({ value, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [temp, setTemp] = useState(value);

    const save = () => {
        onSave(temp);
        setIsEditing(false);
    };

    const cancel = () => {
        setTemp(value);
        setIsEditing(false);
    };

    return (
        <Box>
            {!isEditing ? (
                <Flex align="center" gap={2}>
                    <Text fontSize="14px" color="gray.600">{value}</Text>
                    <IconButton
                        size="xs"

                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                    ><FiEdit2 /></IconButton>
                </Flex>
            ) : (
                <Flex align="center" gap={2}>
                    <Input
                        size="sm"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                        autoFocus
                    />
                    <IconButton size="xs" colorScheme="green" onClick={save} ><FiCheck /></IconButton>
                    <IconButton size="xs" colorScheme="red" onClick={cancel} ><FiX /></IconButton>
                </Flex>
            )}
        </Box>
    );
}

export default function ProfileUI() {
    const [email, setEmail] = useState("thinkmoves@exm.com");
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null);
    const token = localStorage.getItem("id_token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.post(
                `${BASE_URL}/api/Profile/GetProfileDetails`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("PROFILE", res.data);
            setProfile(res.data);

        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();

        navigate("/");
    };

    const updateUserName = async (newUserName) => {
        try {
            const token = localStorage.getItem("id_token");

            await axios.post(
                `${BASE_URL}/api/Profile/SetUserName`,
                { userName: newUserName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toaster.create({
                title: "Username updated",
                description: "Your username has been successfully changed.",
                type: "success",
            });

            return true;

        } catch (error) {
            console.error("Error updating username:", error);
            if (error.status === 401) {
                localStorage.clear()
                window.location.href = "/login"
            }
            toaster.create({
                title: "Error",
                description: error.response?.data || "Failed to update username.",
                type: "error",
            });

            return false;
        }
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
                    <div className="about-heading">
                        <h1 className="about-title">Your</h1>
                        <h1 className="about-gradient">Profile</h1>
                    </div>
                </Container>
            </Box>
            <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
                <Box p={8} bg="gray.50" minH="100vh">
                    <Text fontSize="44px" fontWeight="bold" mb={6}>PROFILE</Text>

                    <Flex gap={6} wrap="wrap">
                        {/* LEFT PROFILE CARD */}
                        <Box
                            w="320px"
                            p={4}
                            borderRadius="lg"
                            boxShadow="md"
                            bg="white"
                        >
                            <Flex direction="column" align="center" gap={2}>
                                {/* <Avatar size="xl" name="Chess" icon={<FaChess fontSize="42px" />} /> */}
                                <AvatarGroup mb={2}>
                                    <Avatar.Root width="80px" height="80px">
                                        <Avatar.Fallback
                                            fontSize="28px"
                                            fontWeight="bold"
                                        >
                                            TM
                                        </Avatar.Fallback>

                                        {/* If you have a profile image, add here */}
                                        {/* <Avatar.Image src="/profile.jpg" alt="User" /> */}
                                    </Avatar.Root>
                                </AvatarGroup>
                                <Text fontWeight="bold" fontSize="18px">
                                    THINKMOVES#4832
                                </Text>

                                <EditableUsername
                                    value={email}
                                    onSave={async (newValue) => {
                                        const ok = await updateUserName(newValue);
                                        if (ok) setEmail(newValue);
                                    }}
                                />

                                <Box mt={4} w="100%">
                                    <Flex justify="space-between" py={1}>
                                        <Text>Player Rating:</Text><Text>4.5</Text>
                                    </Flex>
                                    <Flex justify="space-between" py={1}>
                                        <Text>Games Saved:</Text><Text>4.5</Text>
                                    </Flex>
                                    <Flex justify="space-between" py={1}>
                                        <Text>Positions Saved:</Text><Text>4.5</Text>
                                    </Flex>
                                    <Flex justify="space-between" py={1}>
                                        <Text>Contributions:</Text><Text>4.5</Text>
                                    </Flex>
                                </Box>

                                <Button colorScheme="red" w="100%" mt={6} onClick={handleLogout}>
                                    LOGOUT
                                </Button>
                            </Flex>
                        </Box>

                        {/* RIGHT CONTENT */}
                        <Flex direction="column" flex={1} gap={6}>
                            {/* GAMEPLAY INSIGHTS */}
                            <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                                <Text fontWeight="bold" fontSize="20px" mb={4}>
                                    ♟ GAMEPLAY INSIGHTS
                                </Text>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <StatBox title="MOST PLAYED OPENING" value="Sicilian Defense (820)" />
                                    <StatBox title="WIN/LOSS/DRAW" value="31W | 21L | 20D" />
                                    <StatBox title="WIN RATE AS WHITE" value="60% (57/5)" />
                                    <StatBox title="WIN RATE AS BLACK" value="33% (11/3)" />
                                    <StatBox title="AVG. GAME LENGTH" value="32 moves" />
                                </SimpleGrid>
                            </Box>

                            {/* ADVANCED STATS */}
                            <Box p={4} borderRadius="lg" boxShadow="md" bg="white">
                                <Text fontWeight="bold" fontSize="20px" mb={4}>
                                    📊 ADVANCED STATS
                                </Text>

                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <StatBox title="BLUNDERS PER GAME" value="1.6" />
                                    <StatBox title="BEST GAME ACCURACY" value="92%" />
                                    <StatBox title="GAME MISTAKE SUMMARY" value="Blunders: 5 | Mistakes: 8 | Inaccuracies: 12" />
                                    <StatBox title="RAPID WIN RATE" value="85%" />
                                    <StatBox title="BLITZ WIN RATE" value="40%" />
                                    <StatBox title="BULLET WIN RATE" value="20%" />
                                    <StatBox title="ENDGAME CONVERSION" value="Won: 70% | Drawn: 20% | Lost: 10%" />
                                    <StatBox title="GAME QUALITY TREND" value="Accuracy ↑ 12% over last 10 games" />
                                    <StatBox title="OPENING DIVERSITY" value="4 as White | 2 as Black" />
                                </SimpleGrid>
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            </Container>
        </>

    );
}

function StatBox({ title, value }) {
    return (
        <Box
            p={4}
            borderRadius="md"
            border="1px solid #e2e8f0"
            bg="white"
        >
            <Text fontSize="12px" color="gray.500" fontWeight="semibold">
                {title}
            </Text>
            <Text fontSize="16px" mt={1} fontWeight="bold">
                {value}
            </Text>
        </Box>
    );
}
