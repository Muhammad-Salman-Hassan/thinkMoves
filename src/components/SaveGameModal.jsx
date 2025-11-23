"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    Portal,
    VStack,
    Textarea,
    Button,
    HStack,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { BASE_URL } from "../utils/service";
import axios from "axios";
import { toaster } from "./Toaster";

const SaveGameModal = ({ isOpen, onClose, payload = {}, isEdit = false }) => {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (isOpen && payload.notes) {
            setNotes(payload.notes);
        } else if (isOpen && !isEdit) {
            setNotes("");
        }
    }, [isOpen, payload.notes, isEdit]);

    const handleSave = async () => {
        const token = localStorage.getItem('id_token');
        if (!token) {
            toaster.create({
                title: "Error",
                description: "Missing authentication token",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);

            // Prepare payload for save
            const apiPayload = {
                sheetType: payload?.metadata?.SheetType || "thinkmoves_front",
                gameImageUrls: payload?.gameImageUrls || [],
                cropImageUrls: payload?.cropImageUrls || [],
                correctMoves: Array.isArray(payload.correctMoves)
                    ? JSON.stringify(payload.correctMoves)
                    : JSON.stringify(
                        payload.correctMoves
                            ?.split(",")
                            .map((m) => m.trim())
                            .filter(Boolean)
                    ) || "[]",
                remainingMoves: Array.isArray(payload.remainingMoves)
                    ? JSON.stringify(payload.remainingMoves)
                    : JSON.stringify(
                        payload.remainingMoves
                            ?.split(",")
                            .map((m) => m.trim())
                            .filter(Boolean)
                    ) || "[]",
                metadata: JSON.stringify(payload.metadata) || "{}",
                notes: notes || "",
            };

            let response;

            if (isEdit) {
              
                const updatePayload = {
                    ...apiPayload,
                    gameID: payload.gameId || payload.gameID,
                };

                response = await axios.post(
                    `${BASE_URL}/api/Game/UpdateGame`,
                    updatePayload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    toaster.create({
                        title: "Game Updated",
                        description: "Game updated successfully!",
                        type: "success",
                    });
                    onClose();
                }
            } else {
          
                response = await axios.post(
                    `${BASE_URL}/api/Game/SaveGame`,
                    apiPayload,
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
            }
        } catch (error) {
            console.error("❌ Error saving/updating game:", error);
            
            // Extract error message safely
            let errorMessage = isEdit ? "Error updating game" : "Error saving game";
            
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
            setLoading(false);
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
                                {isEdit ? "Update Game Notes" : "Save Game Notes"}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    {isEdit 
                                        ? "Update notes or description for this game:" 
                                        : "Add notes or description before saving the game:"
                                    }
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
                                    loading={loading}
                                >
                                    {isEdit ? "Update Game" : "Save Game"}
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