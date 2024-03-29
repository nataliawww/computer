import { Canvas, useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'
import { Instances, Computer } from './components/Computer/Computer'
import Text from './components/Text/Text'
import { useState } from 'react'


export default function App() {
  const [screenType, setScreenType] = useState('tetris');
  const [bloom, setBloom] = useState(6);
  const [video, setVideo] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const onComputerClick = (state) => {
    if (screenType === 'tetris') setScreenType('garfield')
    if (screenType === 'garfield') setScreenType('tetris')
  }

  const onProjectClick = (project) => {
    setBloom(1);
    setIsVisible(true);
    setScreenType('shader')
    setVideo(project)
    setTimeout(() => {
      setScreenType('video');
    }, 400)
  }

  return (
    <>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 4], fov: 45, rotation: [0, 0.23, 0]}} eventSource={document.getElementById('root')} eventPrefix="client">
      <color attach="background" args={['black']} />
      <hemisphereLight intensity={0.25} groundColor="black" />
      <spotLight position={[10, 20, -3]} angle={0.12} penumbra={1} intensity={2} castShadow shadow-mapSize={1024} />
      <group position={[-0, -1, 0]}>
        <Instances>
          <Computer onClick={onComputerClick} scale={0.5} type={screenType} video={video} image={video} />
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 30]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#202020"
            metalness={0.8}
          />
        </mesh> 
        </Instances>
        
      </group>
      {/* Postprocessing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={bloom} />
        {/* <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} /> */}
      </EffectComposer>
      {/* Camera movements */}
      {/* <CameraRig /> */}
      {/* Small helper that freezes the shadows for better performance */}
      <BakeShadows />
    </Canvas>
    <Text onSelect={onProjectClick} isVisible={isVisible} />
    </>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0 + (state.pointer.x * state.viewport.width) / 10, state.camera.position.y, 5.5], 0.5, delta)
    state.camera.lookAt(0, 0, -3.2)
  })
}
