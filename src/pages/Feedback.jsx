import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    Textarea,
    VStack,
    Heading,
    Text,
    Field,
    HStack,
    Spinner
} from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../utils/service";
import { toaster } from "../components/Toaster";
import GradientBg from "../components/GradientBg";
import { IoMdArrowRoundForward } from "react-icons/io";

const Feedback = () => {
    const [orgName, setOrgName] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [gameImages, setGameImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const files = [...e.target.files];
        setGameImages(files);
        
        if (files.length > 0) {
            toaster.create({
                title: "Images Uploaded",
                description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully!`,
                type: "success",
            });
        }
    };

    const uploadImages = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!orgName || !suggestions) {
            toaster.create({
                title: "Missing Information",
                description: "Please fill in all required fields",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("id_token");
            const formData = new FormData();

            formData.append("orgName", orgName);
            formData.append("suggestions", suggestions);
            gameImages.forEach((img) => formData.append("gameImages", img));

            await axios.post(`${BASE_URL}/api/ThinkMoves/ContributeThings`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toaster.create({
                title: "Feedback Saved",
                description: "Feedback saved successfully!",
                type: "success",
            });

            setOrgName("");
            setSuggestions("");
            setGameImages([]);
            
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toaster.create({
                title: "Error",
                description: error.response?.data || "Error submitting feedback",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBg>
            <Flex minH="100vh" align="center" justify="center" px={4}>
                <Box
                    bg="white"
                    p={8}
                    rounded="xl"
                    shadow="lg"
                    w="100%"
                    maxW="520px"
                    zIndex={5}
                >
                    <Heading size="lg" textAlign="center" mb={2} color={"black"}>
                        Share Your Feedback
                    </Heading>

                    <Text textAlign="center" color="gray.500" mb={6}>
                        We appreciate your contribution
                    </Text>

                    <VStack spacing={5}>
                        {/* ORG NAME FIELD */}
                        <Field.Root w="100%">
                            <Field.Label color="black">Organization Name</Field.Label>
                            <Input
                                placeholder="Enter organization name"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                color={"black"}
                            />
                        </Field.Root>

                        {/* SUGGESTIONS FIELD */}
                        <Field.Root w="100%">
                            <Field.Label color="black">Suggestions</Field.Label>
                            <Textarea
                                placeholder="Enter your suggestions"
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                color={"black"}
                                minH="120px"
                            />
                        </Field.Root>

                        {/* IMAGE UPLOAD SECTION */}
                        <Field.Root w="100%">
                            <Field.Label color="black">Upload Game Sheet</Field.Label>
                            
                           
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                            />

                           
                            <Button
                                bg="#D32C32"
                                color="white"
                                onClick={uploadImages}
                                width="100%"
                                borderRadius="14.82px"
                                border="1px solid"
                                borderColor="rgba(255, 255, 255, 0.3)"
                                display="flex"
                                alignItems="center"
                                textAlign={"center"}
                                // justifyContent="space-between"
                                p={4}
                                _hover={{
                                    bg: "#b0262b"
                                }}
                            >
                                {gameImages.length > 0 
                                    ? `${gameImages.length} Image${gameImages.length > 1 ? 's' : ''} Selected` 
                                    : "Upload Games Sheet"
                                }
                              
                            </Button>

                        
                            {gameImages.length > 0 && (
                                <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="black">
                                        Selected Files:
                                    </Text>
                                    {gameImages.map((file, index) => (
                                        <Text key={index} fontSize="xs" color="gray.600">
                                            • {file.name}
                                        </Text>
                                    ))}
                                </Box>
                            )}
                        </Field.Root>

                       
                        <Button
                            bg="#D32C32"
                            color="white"
                            width="100%"
                            loading={loading}
                            onClick={handleSubmit}
                            borderRadius="14.82px"
                            p={4}
                            _hover={{
                                bg: "#b0262b"
                            }}
                        >
                            {loading ? (
                                <Flex align="center" gap={2}>
                                    <Spinner size="sm" />
                                    <Text>Submitting...</Text>
                                </Flex>
                            ) : (
                                "Submit Feedback"
                            )}
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </GradientBg>
    );
};

export default Feedback;