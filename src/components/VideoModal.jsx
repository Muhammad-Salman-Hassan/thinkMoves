"use client";

import React, { useState } from "react";
import {
    Dialog,
    Portal,
    VStack,
    Input,
    Button,
    HStack,
    Text,
    Box,
    AspectRatio,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

const VideoPlayerModal = ({ isOpen, onClose, videoUrl: propVideoUrl = "https://youtu.be/Ux06UVWjGqc" }) => {
    const [videoUrl, setVideoUrl] = useState("");
    const [embedUrl, setEmbedUrl] = useState("");
   

   
    const getYouTubeVideoId = (url) => {
        if (!url) return null;

       
        url = url.trim();

        
        let match = url.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];

        
        match = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];

        
        match = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];

        
        match = url.match(/(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];

        return null;
    };

   

    const handleClose = () => {
        
        setEmbedUrl("");
      
        onClose();
    };

  
    React.useEffect(() => {
        if (isOpen && propVideoUrl) {
            setVideoUrl(propVideoUrl);
            const videoId = getYouTubeVideoId(propVideoUrl);
            if (videoId) {
                setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
            }
        }
    }, [isOpen, propVideoUrl]);

    

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW={{ base: "95%", sm: "90%", md: "3xl", lg: "5xl" }}
                        p={{ base: "4", md: "6" }}
                        borderRadius="2xl"
                        bg="linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
                        position="relative"
                        boxShadow="0 20px 60px rgba(211, 44, 50, 0.3)"
                    >
                        <Button
                            position="absolute"
                            top={{ base: "2", md: "3" }}
                            right={{ base: "2", md: "3" }}
                            variant="ghost"
                            onClick={handleClose}
                            color="white"
                            bg="rgba(211, 44, 50, 0.8)"
                            _hover={{ bg: "#D32C32" }}
                            borderRadius="full"
                            size={{ base: "sm", md: "md" }}
                            zIndex={10}
                        >
                            <FaTimes />
                        </Button>

                        <Dialog.Header pb={{ base: "3", md: "4" }}>
                            <Dialog.Title 
                                fontSize={{ base: "lg", md: "2xl" }} 
                                fontWeight="bold"
                                color="white"
                                textAlign="center"
                            >
                                🎬 Video Tutorial
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body py={{ base: "2", md: "4" }}>
                            <VStack spacing={4} align="stretch">
                                {embedUrl && (
                                    <Box
                                        position="relative"
                                        overflow="hidden"
                                        borderRadius={{ base: "xl", md: "2xl" }}
                                        boxShadow="0 10px 40px rgba(0, 0, 0, 0.5)"
                                        border="3px solid"
                                        borderColor="#D32C32"
                                        bg="black"
                                    >
                                        <AspectRatio ratio={16 / 9}>
                                            <iframe
                                                src={embedUrl}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{
                                                    width: "100%",
                                                    height: "100%"
                                                }}
                                            />
                                        </AspectRatio>
                                    </Box>
                                )}

                                {!embedUrl && (
                                    <Box
                                        bg="rgba(255, 255, 255, 0.05)"
                                        borderRadius={{ base: "xl", md: "2xl" }}
                                        p={{ base: "8", md: "12" }}
                                        textAlign="center"
                                        color="gray.400"
                                        border="2px dashed"
                                        borderColor="rgba(211, 44, 50, 0.3)"
                                    >
                                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                                            🎥 Loading video...
                                        </Text>
                                        <Text fontSize="sm" mt={2} color="gray.500">
                                            Please wait a moment
                                        </Text>
                                    </Box>
                                )}
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer pt={{ base: "3", md: "4" }}>
                            <HStack justify="center" spacing={3} w="100%">
                                <Button 
                                    onClick={handleClose} 
                                    bg="rgba(255, 255, 255, 0.1)"
                                    color="white"
                                    _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
                                    borderRadius="full"
                                    px={{ base: "6", md: "8" }}
                                    size={{ base: "md", md: "lg" }}
                                >
                                    Close
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default VideoPlayerModal;