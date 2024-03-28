import React, { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 2;
const BOARD_HEIGHT = 2;
const EXIT_BOARD_POS_Y = 6;

const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' }, // Empty space
  I: {
    shape: [
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0],
      [0, 'I', 0, 0]
    ],
    color: '80, 227, 230', // Cyan
  },
  J: {
    shape: [
      [0, 'J', 0],
      [0, 'J', 0],
      ['J', 'J', 0]
    ],
    color: '36, 95, 223', // Blue
  },
  L: {
    shape: [
      [0, 'L', 0],
      [0, 'L', 0],
      [0, 'L', 'L']
    ],
    color: '223, 173, 36', // Orange
  },
  O: {
    shape: [
      ['O', 'O'],
      ['O', 'O']
    ],
    color: '223, 217, 36', // Yellow
  },
  S: {
    shape: [
      [0, 'S', 'S'],
      ['S', 'S', 0],
      [0, 0, 0]
    ],
    color: '48, 211, 56', // Green
  },
  T: {
    shape: [
      [0, 0, 0],
      ['T', 'T', 'T'],
      [0, 'T', 0]
    ],
    color: '132, 61, 198', // Purple
  },
  Z: {
    shape: [
      ['Z', 'Z', 0],
      [0, 'Z', 'Z'],
      [0, 0, 0]
    ],
    color: '227, 78, 78', // Red
  }
};


const createBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill([0, 'clear']));

const getRandomTetromino = () => {
  const tetrominos = 'IJLSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

const updateBoard = (prevBoard, tetromino, position) => {
  const newBoard = prevBoard.map(row =>
    row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
  );

  tetromino.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + position.y;
        const boardX = x + position.x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = [value, 'merged'];
        }
      }
    });
  });

  return newBoard;
};

// The Tetris component
const TetrisGame = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentTetromino, setCurrentTetromino] = useState(getRandomTetromino());
  const [position, setPosition] = useState({ x: 4, y: -5 });
  const [tetrominoTimer, setTetrominoTimer] = useState(Date.now());


  const rotateTetromino = (shouldToggleDirection) => {
    const cellSize = 1;
  
    const adjustment = shouldToggleDirection ? cellSize * 0.5 : -cellSize * 0.5;
  
    setPosition(prevPosition => ({
      x: prevPosition.x + adjustment,
      y: prevPosition.y + adjustment
    }));

  };

  useEffect(() => {
    const updateGame = () => {
      if (position.y >= EXIT_BOARD_POS_Y) {
        setCurrentTetromino(getRandomTetromino());
        setPosition({ x: 4, y: -5 });
        setTetrominoTimer(Date.now());
      } else {
        setPosition(prev => ({ ...prev, y: prev.y + 1 }));
      }

      setBoard(prev => updateBoard(prev, currentTetromino, position));
    };

    const gameInterval = setInterval(updateGame, 1000);

    return () => clearInterval(gameInterval);
  }, [currentTetromino, position, tetrominoTimer]);

  return { board, currentTetromino, position, setPosition, rotateTetromino};
};

export default TetrisGame;
