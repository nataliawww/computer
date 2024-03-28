import * as THREE from 'three'
import { useMemo, useState, useEffect, useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import TetrisGame from './Tetris'
import { Screen } from '../Computer/Screen'

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function ScreenTetris (props) {
  const { board, currentTetromino, position, rotateTetromino, setPosition } = TetrisGame();
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [shouldToggleDirection, setShouldToggleDirection] = useState();
  const gridSize = 4;
  const cellSize = 0.2;
  const divisions = gridSize / cellSize;

  const prevTetromino = usePrevious(currentTetromino);

  useEffect(() => {
    if (prevTetromino && currentTetromino && prevTetromino !== currentTetromino) {
      setRotation([0, 0, 0]);
    }
  }, [currentTetromino, prevTetromino]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x + 1 }));
          break;
        case 'ArrowLeft':
          setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x - 1 }));
          break;
        case 'ArrowDown':
          setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y + 1 }));
          break;
        case ' ':
          setRotation((prevRotation) => [prevRotation[0], prevRotation[1], prevRotation[2] + Math.PI / 2]);
          rotateTetromino(shouldToggleDirection);
          setShouldToggleDirection(!shouldToggleDirection);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const cubes = useMemo(() => {
    const items = [];
    const offsetX = -1;
    const offsetY = 1;
  
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
    let centerX = 0;
    let centerY = 0;
  
    if (currentTetromino && position) {
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            minX = Math.min(minX, x + position.x);
            maxX = Math.max(maxX, x + position.x);
            minY = Math.min(minY, y + position.y);
            maxY = Math.max(maxY, y + position.y);
          }
        });
      });
  
      centerX = (minX + maxX) / 2 * cellSize + offsetX;
      centerY = (minY + maxY) / 2 * -cellSize + offsetY;
  
      currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const posX = offsetX + (x + position.x) * cellSize - centerX;
            const posY = offsetY - (y + position.y) * cellSize - centerY;
            const color = `rgb(${currentTetromino.color})`;
            items.push(
              <mesh position={[posX, posY, 0]} key={`${x}-${y}-tetromino`}>
                <boxGeometry args={[cellSize, cellSize, cellSize]} />
                <meshStandardMaterial color={color} />
              </mesh>
            );
          }
        });
      });
    }
  
    return <group position={[centerX, centerY, 0]} rotation={rotation}>{items}</group>;
  }, [board, currentTetromino, position]);
  

  return (
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
      <color attach="background" args={['darkblue']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -2, -10]} intensity={0.4}/>
      <primitive 
        object={new THREE.GridHelper(gridSize, divisions, 'blue', 'blue')} 
        rotation={[-Math.PI / 2, 0, 0]}
        position={[cellSize / 2, cellSize / 2, -0.05]}
      />
      {cubes}
    </Screen>
  );
};