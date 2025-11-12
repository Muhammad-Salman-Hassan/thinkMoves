import {
    Button,
    HStack,
    IconButton,
    Popover,
    Portal,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

const ConfirmDeleteButton = ({ onConfirm, isLoading, type }) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <IconButton
                    bg="#D32C32"
                    color="white"
                    width={["100%", "100px"]}
                    borderRadius="10px"
                    border="1px solid"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={4}
                >
                    Delete <MdDelete />
                </IconButton>
            </Popover.Trigger>

            <Portal>
                <Popover.Positioner>
                    <Popover.Content p={4} bg="white" borderRadius="md" boxShadow="md">
                        <Popover.Arrow />
                        <Popover.Body>
                            <Text mb={3}>Are you sure you want to delete this {type}?</Text>
                            <HStack justify="flex-end">
                                <Button size="sm" variant="outline">
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={onConfirm}
                                    isLoading={isLoading}
                                >
                                    {isLoading ? <Spinner size="sm" /> : "Confirm"}
                                </Button>
                            </HStack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root >
    );
};
export default ConfirmDeleteButton;