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

const SavePositionModal = ({ isOpen, onClose, payload = {} }) => {
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const token = localStorage.getItem('id_token');
        if (!token) {
            alert('Missing token');
            return;
        }

        let newpayload = { ...payload, notes }
        try {
            setLoading(true);


            const response = await axios.post(`${BASE_URL}/api/Position/SavePosition`, newpayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            toaster.create({
                title: "Position Saved",
                description: "Position saved successfully!",
                type: "success",

            });
            setLoading(false);
            onClose();

        } catch (error) {
            console.error(error);
            setLoading(false);
            toaster.create({
                title: "Error",
                description: "Some thing Went Wrong",
                type: "error",

            });
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
                                Save Position Notes
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                <Text fontSize="sm" color="gray.600">
                                    Add notes or description before saving the Position:
                                </Text>
                                <Textarea
                                    placeholder="Write your position notes here..."
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
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                >
                                    Save Position {loading && <Spinner size={"sm"}/>}
                                </Button>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default SavePositionModal;
