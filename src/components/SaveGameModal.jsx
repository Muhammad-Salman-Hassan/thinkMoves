"use client";

import React, { useState } from "react";
import {
    Dialog,
    Portal,
    VStack,
    Textarea,
    Button,
    HStack,
    Text,
    Spinner,
    //   useToast,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { API, BASE_URL } from "../utils/service";
import axios from "axios";
import { toaster } from "./Toaster";

const SaveGameModal = ({ isOpen, onClose, payload = {} }) => {
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);



    const handleSave = async () => {
        const token = localStorage.getItem('id_token');
        if (!token) {
            alert('Missing token');
            return;
        }

        try {
            setLoading(true)
            const Apipayload = {
                sheetType: payload?.metadata.SheetType || "thinkmoves_front",
                gameImageUrls: payload?.gameImageUrls || [],
                cropImageUrls: payload?.cropImageUrls || [],
                correctMoves: Array.isArray(payload.correctMoves)
                    ? JSON.stringify(payload.correctMoves)
                    : JSON.stringify(payload.correctMoves
                        ?.split(",")
                        .map((m) => m.trim())
                        .filter(Boolean)) || [],
                remainingMoves: Array.isArray(payload.remainingMoves)
                    ? JSON.stringify(payload.remainingMoves)
                    : JSON.stringify(payload.remainingMoves
                        ?.split(",")
                        .map((m) => m.trim())
                        .filter(Boolean)) || [],
                metadata: JSON.stringify(payload.metadata) || {},
                notes: notes || "",
            };



            const response = await axios.post(
                `${BASE_URL}/api/Game/SaveGame`,
                Apipayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            if (response.status === 200) {
                toaster.create({
                    title: "Game Saved",
                    description: "Game saved successfully!",
                    type: "success",

                });
                onClose();
            }
        } catch (error) {
            console.error("❌ Error saving game:", error);
            toaster.create({
                title: "Error",
                description: "Error saving game:",
                type: "error",

            });
            if (error.status === 401) {
                localStorage.clear()
                window.location.href = "/login"
            }

        }finally{
            setLoading(false)

        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        maxW="lg"
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
                            onClick={onClose}
                            color="gray.500"
                        >
                            <FaTimes />
                        </Button>

                        <Dialog.Header>
                            <Dialog.Title fontSize="xl" fontWeight="bold">
                                Save Game Notes
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    Add notes or description before saving the game:
                                </Text>
                                <Textarea
                                    placeholder="Write your game notes here..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    bg="gray.50"
                                    color="black"
                                    minH="120px"
                                    resize="vertical"
                                />
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <HStack justify="flex-end" spacing={3}>
                                <Button onClick={onClose} variant="outline">
                                    Cancel
                                </Button>
                                <Button
                                    bg="#D32C32"
                                    color="white"
                                    _hover={{ bg: "#b0262b" }}
                                    onClick={handleSave}
                                    isLoading={loading}
                                >
                                    Save Game {loading && <Spinner size={"sm"}/>}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default SaveGameModal;
