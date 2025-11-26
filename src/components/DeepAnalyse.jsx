import React, { useState } from 'react';
import { Box, Card, Grid, Text, Table, Button, Container, Flex, Spinner } from '@chakra-ui/react';
import { BASE_URL } from '../utils/service';
import axios from 'axios';
import ChartComponent from './ErrorCharts';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Tooltip } from './ToolTip';

const ChessAnalysis = ({ correctMoves }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const isLoggedIn = !!localStorage.getItem('id_token');

    const fetchAnalysis = async () => {
        const token = localStorage.getItem('id_token');
        try {
            setLoading(true);
            const API_URL = `${BASE_URL}/api/Game/StockfishScanGame`;
            const payload = {
                pgn: correctMoves,
                depth: 15,
                multiPV: 1,
                movetimeMs: null,
                startPly: null,
                endPly: null,
                gameId: "gm_demo_10moves",
            };

            const response = await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching analysis:", error);
            if (error.status === 401) {
                localStorage.clear()
                window.location.href = "/login"
            }
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <Flex align="center" justify="center" >
                <Spinner size="xl" color="red.500" />
                <Text ml={3}>Analyzing game </Text>
            </Flex>
        );
    }
    const tooltipContent = (
        <Box maxW="400px" p={2}>
            <Text fontWeight="bold" mb={2}>Deep Analyze (beta)</Text>
            <Text fontSize="sm">Deep Analyze can happen only after you login.And Have some correct moves</Text>
        </Box>
    );
    if (!data) {
        return (
            <Flex align="center" justify="center" direction="column" gap={3}>
                

                {!isLoggedIn && (
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                        Deep Analyze can happen only after you login.
                    </Text>
                )}
                <Tooltip
                    content={tooltipContent}
                    contentStyleProps={{
                        bg: "white",
                        color: "black",
                        border: "1px solid",
                        borderColor: "gray.200",
                        borderRadius: "lg",
                        boxShadow: "lg",
                    }}
                    showArrow
                    disabled={!isLoggedIn}
                >
                    <Button
                        onClick={isLoggedIn ? fetchAnalysis : null}
                        bg="#D32C32"
                        color="white"
                        size="lg"
                        _hover={{ bg: "red.600" }}
                        disabled={correctMoves.length === 0}
                        borderRadius="14.82px"
                        border="1px solid"
                        borderColor="linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"
                    >
                        Deep Analyze <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                            <IoMdArrowRoundForward />
                        </Box>
                    </Button>
                </Tooltip>
            </Flex>
        );
    }



    return (
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
                top="40%"
                right="10%"
                width="400px"
                height="400px"
                bg="red"
                borderRadius="full"
                filter="blur(120px)"
                opacity="0.25"
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

            <Container maxW="container.xl" px={{ base: 4, md: 8 }} zIndex="1" position="relative" py={8}>

                <Flex justify="center" align="center" mb={8}>
                    <Button
                        onClick={fetchAnalysis}
                        bg="#D32C32"
                        color="white"
                        size="lg"

                        _hover={{ bg: "red.600" }}
                        disabled={correctMoves.length === 0}
                        borderRadius="14.82px"
                        border="1px solid"
                        borderColor="linear-gradient(265.38deg, rgba(255, 255, 255, 0.6) 24.8%, rgba(255, 255, 255, 0.3) 85.32%)"

                    >
                        Deep Analyze <Box bg="black" p={1} borderRadius="full" border="1px solid white">
                            <IoMdArrowRoundForward />
                        </Box>
                    </Button>
                </Flex>


                <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={4}>
                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="3xl" fontWeight="semibold">{data.common.movesAnalyzed}</Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>MOVES ANALYZED</Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="3xl" fontWeight="semibold">{Math.round(data.common.bestMoveHitRateOverall * 100)}%</Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>BEST MOVE HIT (OVERALL)</Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="3xl" fontWeight="semibold">{data.common.totalCpLoss}</Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>TOTAL CP LOSS</Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="3xl" fontWeight="semibold">{data.common.leadChanges}</Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>LEAD CHANGES</Text>
                        </Card.Body>
                    </Card.Root>
                </Grid>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={4}>
                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="2xl" fontWeight="semibold">
                                {data.common.biggestSwing.lossCp} AT PLY {data.common.biggestSwing.ply} ({data.common.biggestSwing.moveSAN})
                            </Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>BIGGEST SWING</Text>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="2xl" fontWeight="semibold">{data.common.evalStartCp} → {data.common.evalEndCp}</Text>
                            <Text fontSize="xs" color="gray.600" fontWeight="medium" mt={1}>EVAL TREND</Text>
                        </Card.Body>
                    </Card.Root>
                </Grid>


                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4} mb={4}>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>PLAYER COMPARISON</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> MOVES
                                        </Table.Cell>



                                        <Table.Cell textAlign="center" fontSize="sm" fontWeight="semibold">WHITE</Table.Cell>
                                        <Table.Cell textAlign="center" fontSize="sm" fontWeight="semibold">BLACK</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> MOVE
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.moves}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.moves}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> BEST MOVE HIT
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{Math.round(data.players.white.bestMoveHitRate * 100)}%</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{Math.round(data.players.black.bestMoveHitRate * 100)}%</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> INACCURACIES
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.inaccuracies}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.inaccuracies}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> MISTAKE
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.mistakes}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.mistakes}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> BLUNDERS
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.blunders}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.blunders}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> AVG CP LOSS
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.avgCpLoss}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.avgCpLoss}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> TOTAL CP LOSS
                                        </Table.Cell>

                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.totalCpLoss}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.totalCpLoss}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>

                                        <Table.Cell fontWeight="semibold" fontSize="xs">
                                            <Text as="span" color="red" fontSize={"15px"}>●</Text> BIGGEST SINGLE
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontSize="xs">
                                            {data.players?.white?.biggestLoss?.moveSAN} AT PLY {data.players.white?.biggestLoss?.ply} • {data.players.white.biggestLoss?.lossCp} CP
                                        </Table.Cell>
                                        <Table.Cell textAlign="center" fontSize="xs">
                                            {data.players?.black?.biggestLoss?.moveSAN} AT PLY {data.players.black?.biggestLoss?.ply} • {data.players.black.biggestLoss?.lossCp} CP
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>


                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>PHASE BREAKDOWN</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs" color="red.500">● AVERAGE</Table.Cell>
                                        <Table.Cell textAlign="center" fontSize="sm" fontWeight="semibold">OPENING</Table.Cell>
                                        <Table.Cell textAlign="center" fontSize="sm" fontWeight="semibold">BLACK CP LOSS</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs" color="red.500">● OPENING</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.phase.openingAvgCpLoss}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.phase.openingAvgCpLoss}</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell fontWeight="semibold" fontSize="xs" color="red.500">● MIDDLEGAME</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.white.phase.middlegameAvgCpLoss}</Table.Cell>
                                        <Table.Cell textAlign="center" fontWeight="semibold">{data.players.black.phase.middlegameAvgCpLoss}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>
                </Grid>


                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4} mb={4}>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>White Top Pain Points</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Header>
                                    <Table.Row >
                                        <Table.ColumnHeader fontSize="xs">#</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">PLY</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">MOVE</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">BEST</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs" textAlign="right">LOSS</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {data.players.white.topPainPoints.map((point, idx) => (
                                        <Table.Row key={idx} borderBottom="1px solid" borderColor="gray.200">
                                            <Table.Cell fontWeight="semibold">{idx + 1}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.ply}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.moveSAN}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.bestMoveSAN}</Table.Cell>
                                            <Table.Cell textAlign="right" fontWeight="semibold" color={point.lossCp > 50 ? "red.500" : "green.500"}>
                                                {point.lossCp}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>


                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>Black Top Pain Points</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Header>
                                    <Table.Row >
                                        <Table.ColumnHeader fontSize="xs">#</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">PLY</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">MOVE</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs">BEST</Table.ColumnHeader>
                                        <Table.ColumnHeader fontSize="xs" textAlign="right">LOSS</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {data.players.black.topPainPoints.map((point, idx) => (
                                        <Table.Row key={idx} borderBottom="1px solid" borderColor="gray.200">
                                            <Table.Cell fontWeight="semibold">{idx + 1}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.ply}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.moveSAN}</Table.Cell>
                                            <Table.Cell fontWeight="semibold">{point.bestMoveSAN}</Table.Cell>
                                            <Table.Cell textAlign="right" fontWeight="semibold" color={point.lossCp > 50 ? "red.500" : "green.500"}>
                                                {point.lossCp}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>
                </Grid>



                <Grid templateColumns="1fr 1fr" gap={4} mb={4}>

                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>WHITE MOVES</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>#</Table.ColumnHeader>
                                        <Table.ColumnHeader>Move</Table.ColumnHeader>
                                        <Table.ColumnHeader>Best Move</Table.ColumnHeader>
                                        <Table.ColumnHeader>Eval (Before → After)</Table.ColumnHeader>
                                        <Table.ColumnHeader>Loss</Table.ColumnHeader>
                                        <Table.ColumnHeader>Label</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {data.analysis
                                        .filter((_, idx) => idx % 2 === 0)
                                        .map((whiteMove, idx) => {
                                            const getMoveColor = (label) => {
                                                switch (label) {
                                                    case "Mistake":
                                                    case "Blunder":
                                                        return "red";
                                                    case "Inaccuracy":
                                                        return "orange.500";
                                                    default:
                                                        return "black";
                                                }
                                            };

                                            return (
                                                <Table.Row key={idx}>
                                                    <Table.Cell>{idx + 1}</Table.Cell>
                                                    <Table.Cell>{whiteMove.moveSAN}</Table.Cell>
                                                    <Table.Cell>{whiteMove.bestMoveSAN}</Table.Cell>
                                                    <Table.Cell>{whiteMove.evalBeforeCp} → {whiteMove.evalAfterCp}</Table.Cell>
                                                    <Table.Cell color={whiteMove.lossCp > 50 ? "red.500" : "green.500"}>{whiteMove.lossCp}</Table.Cell>
                                                    <Table.Cell color={getMoveColor(whiteMove.label)}>{whiteMove.label}</Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>


                    <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                        <Card.Body p={6}>
                            <Text fontSize="lg" fontWeight="semibold" mb={4}>BLACK MOVES</Text>
                            <Table.Root variant="simple" size="sm">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>#</Table.ColumnHeader>
                                        <Table.ColumnHeader>Move</Table.ColumnHeader>
                                        <Table.ColumnHeader>Best Move</Table.ColumnHeader>
                                        <Table.ColumnHeader>Eval (Before → After)</Table.ColumnHeader>
                                        <Table.ColumnHeader>Loss</Table.ColumnHeader>
                                        <Table.ColumnHeader>Label</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {data.analysis
                                        .filter((_, idx) => idx % 2 === 1)
                                        .map((blackMove, idx) => {
                                            const getMoveColor = (label) => {
                                                switch (label) {
                                                    case "Mistake":
                                                    case "Blunder":
                                                        return "red";
                                                    case "Inaccuracy":
                                                        return "orange.500";
                                                    default:
                                                        return "black";
                                                }
                                            };

                                            return (
                                                <Table.Row key={idx}>
                                                    <Table.Cell>{idx + 1}</Table.Cell>
                                                    <Table.Cell>{blackMove.moveSAN}</Table.Cell>
                                                    <Table.Cell>{blackMove.bestMoveSAN}</Table.Cell>
                                                    <Table.Cell>{blackMove.evalBeforeCp} → {blackMove.evalAfterCp}</Table.Cell>
                                                    <Table.Cell color={blackMove.lossCp > 50 ? "red.500" : "green.500"}>{blackMove.lossCp}</Table.Cell>
                                                    <Table.Cell color={getMoveColor(blackMove.label)}>{blackMove.label}</Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                </Table.Body>
                            </Table.Root>
                        </Card.Body>
                    </Card.Root>
                </Grid>


                <Card.Root bg="white" borderRadius="2xl" shadow="sm">
                    <Card.Body p={6}>
                        <Grid templateColumns="1fr 1fr" gap={8}>

                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" mb={2}>LOSS CP</Text>
                            </Box>
                        </Grid>
                        <ChartComponent data={data.analysis} />
                    </Card.Body>
                </Card.Root>
            </Container>
        </Box>
    );
};

export default ChessAnalysis;