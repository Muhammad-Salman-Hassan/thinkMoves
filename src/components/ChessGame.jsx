import { useState } from "react";
import { Chessboard } from "react-chessboard";

export default function ChessGame({ game, position, onPositionChange }) {
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    // Get move options for a square to show valid moves
    function getMoveOptions(square) {
        const moves = game.moves({
            square,
            verbose: true
        });

        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        const newSquares = {};

        for (const move of moves) {
            newSquares[move.to] = {
                background: game.get(move.to) && game.get(move.to)?.color !== game.get(square)?.color 
                    ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' 
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%'
            };
        }

        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)'
        };

        setOptionSquares(newSquares);
        return true;
    }

    // Handle square click
    function onSquareClick(squareObj) {
        // Extract square string from the object
        const square = squareObj?.square || squareObj;
        
        // Piece clicked to move
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) {
                setMoveFrom(square);
            }
            return;
        }

        // Square clicked to move to
        const moves = game.moves({
            square: moveFrom,
            verbose: true
        });
        const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

        if (!foundMove) {
            const hasMoveOptions = getMoveOptions(square);
            setMoveFrom(hasMoveOptions ? square : '');
            return;
        }

        // Make the move
        try {
            game.move({
                from: moveFrom,
                to: square,
                promotion: 'q'
            });
            onPositionChange(game.fen());
            setMoveFrom('');
            setOptionSquares({});
        } catch {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) {
                setMoveFrom(square);
            }
        }
    }

    // Handle piece drop
    function onPieceDrop(source, target, piece) {
        console.log('onPieceDrop called:', { source, target, piece });
        
        // Extract from the source object
        const sourceSquare = source?.sourceSquare;
        const targetSquare = source?.targetSquare;
        
        if (!sourceSquare || !targetSquare) {
            console.log('Missing squares:', { sourceSquare, targetSquare });
            return false;
        }

        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });
            
            if (move) {
                console.log('Move successful:', move);
                onPositionChange(game.fen());
                setMoveFrom('');
                setOptionSquares({});
                return true;
            }
            console.log('Move returned null');
            return false;
        } catch (error) {
            console.log('Move failed with error:', error);
            return false;
        }
    }

    const chessboardOptions = {
        position: position,
        onPieceDrop: onPieceDrop,
        onSquareClick: onSquareClick,
        customSquareStyles: optionSquares,
    };

    return (
        <Chessboard
            id="AnalyzerBoard"
            options={chessboardOptions}
        />
    );
}