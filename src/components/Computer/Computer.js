import * as THREE from 'three'
import { useMemo, useContext, createContext, useRef, Suspense, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Merged, Text, PerspectiveCamera, Plane, useAspect, useVideoTexture, Image, Environment } from '@react-three/drei'
import {Glitter} from '../../shaders/Glitter'
import {Static} from '../../shaders/Static'
import {Spiral} from '../../shaders/Spiral'
import {Screen} from './Screen'
import {ScreenTetris} from '../Tetris/ScreenTetris'

THREE.ColorManagement.legacyMode = false

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/computers_1-transformed.glb')
  const instances = useMemo(
    () => ({
      Object: nodes.Object_4,
      Object36: nodes.Object_28,
      Sphere: nodes.Sphere
    }),
    [nodes]
  )
  return (
    <Merged castShadow receiveShadow meshes={instances} {...props}>
      {(instances) => <context.Provider value={instances} children={children} />}
    </Merged>
  )
}

export function Computer(props) {
  const [scale, setScale] = useState(1.4);
  const [position, setPosition] = useState([0, 0, -3.2]);
  const instances = useContext(context)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < window.innerHeight) {
        setScale(1);
        setPosition([-1, 0, -3.2]);
      } else {
        setScale(1.4);
        setPosition([0, 0, -3.2]);
      }
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <group {...props} dispose={null} scale={scale} position={position}>
      <instances.Object36 scale={[1.5, 1, 1.5]} />
      { props.type === 'tetris' && <ScreenTetris frame="Object_215" panel="Object_216" position={[0, 0.38, 0]} scale={1} /> }
      { props.type === 'garfield' && <ScreenGarfield frame="Object_215" panel="Object_216" position={[0, 0.38, 0]} scale={1} /> }
      { props.type === 'shader' && <ScreenShader static frame="Object_215" panel="Object_216" position={[0, 0.38, 0]} /> }
      { props.type === 'video' && <ScreenVideo video={props.video} frame="Object_215" panel="Object_216" position={[0, 0.38, 0]} /> }
      { props.type === 'image' && <ScreenImage video={props.image} frame="Object_215" panel="Object_216" position={[0, 0.38, 0]} /> }
    </group>
  )
}

/* Renders a monitor with some text */
function ScreenText({ invert, x = 0, y = 0, ...props }) {
  const textRef = useRef()
  const rand = Math.random() * 10000
  useFrame((state) => (textRef.current.position.x = -2 + Math.sin(rand + state.clock.elapsedTime / 10)))
  return (
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 15]} />
      {/* <color attach="background" args={[invert ? 'black' : '#35c19f']} /> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text font="/Inter-Medium.woff" position={[x, y, 0]} ref={textRef} fontSize={4} letterSpacing={-0.1} color={!invert ? 'black' : '#35c19f'}>
        hello there.
      </Text>
      {/* <Text3D
        ref={ref}
        position={[x, y, 0]}
        castShadow
        bevelEnabled
        font="/objectsans.json"
        scale={2}
        letterSpacing={0.03}
        height={0.25}
        bevelSize={0.01}
        bevelSegments={10}
        curveSegments={128}
        bevelThickness={0.05}>
        hi!
        <MeshDistortMaterial distort={0.3} speed={5} />
      </Text3D> */}
    </Screen>
  )
}

function ScreenShader(props) {
  const size = useAspect(600, 400)
  return (
    <Screen {...props}>
      <mesh scale={size}>
        <planeGeometry />
        {props.glitter && <Glitter />}
        {props.static && <Static />}
        {props.sprial && <Spiral />}
      </mesh>
    </Screen>
  )
}

function GarfieldModel({ ...props }) {
  const { scene, animations } = useGLTF('/garfield.glb');
  const mixer = useRef();

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => {
      const action = mixer.current.clipAction(clip);
      action.play();
    });
  }, [animations, scene]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return <primitive object={scene} {...props} />;
}

const colors = [
  new THREE.Color('red'),
  new THREE.Color('orange'),
  new THREE.Color('blue'),
  new THREE.Color('green'),
];

const Square = ({ position, rotation = [0, 0, 0], squareSize }) => {
  const meshRef = useRef();
  // Select a random color from the array
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

  useFrame(() => {
    if (meshRef.current) {
      // Randomly change color to one of the specified colors
      if (Math.random() > 0.95) {
        meshRef.current.material.color.set(colors[Math.floor(Math.random() * colors.length)]);
      }
    }
  });

  return (
    <Plane ref={meshRef} args={[squareSize, squareSize]} position={position} rotation={rotation}>
      <meshStandardMaterial attach="material" color={color} />
    </Plane>
  );
};

const DiscoGrid = ({ size = 50, height = 5, squareSize = 0.1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const groupRef = useRef();
  const { viewport } = useThree();
  const squares = [];

  // Adjust calculations to use squareSize for positioning
  const gap = squareSize;
  
  for (let y = 1; y < height; y++) {
    for (let i = 0; i < size; i++) {
      const positionFront = [(i - size / 2) * gap, y * gap, -size / 2 * gap];
      squares.push(<Square key={`front-${y}-${i}`} position={positionFront} squareSize={squareSize} />);
    }
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {squares}
    </group>
  );
};
function CameraLookAt() {
  const { camera } = useThree();
  
  useFrame(() => {
    // This will make the camera look at the origin every frame
    // Update the target as necessary
    camera.lookAt(0, 0, 0);
  });

  return null;
}
function ScreenGarfield(props) {
  return (
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} rotateZ={0.5} position={[0, 2, 10]} />
      <color attach="background" args={['orange']} receiveShadow/>
      <ambientLight intensity={0.6} />
      <CameraLookAt />
      <group rotation={[-1.4, 0, 0]}>
        <DiscoGrid position={[0,0,2.8]} size={16} height={10} squareSize={0.4} />
      </group>
      <GarfieldModel position={[-0.1, 0, -0.6]} scale={0.5} />
      <Environment preset="sunset" />
    </Screen>
  );
}

function Video({video}) {
  const size = useAspect(640, 360, 0.5)
  return (
    <mesh scale={size} position={[0 , 0.7, 0]}>
      <planeGeometry size={[1, ]} />
      <Suspense>
        <VideoMaterial url={`/${video}.mp4`} />
      </Suspense>
    </mesh>
  )
}

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

function ScreenVideo(props) {
  return (
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
      <Video {...props} />
    </Screen>
  )
}

function ScreenImage(props) {
  return (
    <Screen {...props}>
      <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 10]} />
      <Image {...props} />
    </Screen>
  )
}

