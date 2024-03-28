import { useRef, useMemo } from 'react'
import { useFrame } from "@react-three/fiber";
import { RepeatWrapping } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Static = () => {
  const material = useRef();

  let t = 5;

  useFrame(() => {
    if(material && material.current) {
      t += 0.01
      material.current.uniforms.u_time.value = t
    }
  });

  const fragmentShaderBW =`
    varying vec2 vUv;
    precision highp float;

    uniform float u_time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    float ran(float a) {
      return fract(sin(a*2250.0)*2750.0);
    }
    void main( void ) {

      vec2 p = vUv;
      float r = ran(p.x*p.x+p.y*p.y*u_time);
      gl_FragColor = vec4(r,r,r,1.0);
    }
  `;

  const fragmentShaderColor =`
    varying vec2 vUv;
    precision highp float;

    uniform float u_time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    highp float rand(vec2 co) {
      
      highp float a = 12.9898;
      highp float b = 78.233;
      highp float c = 43758.5453;
      highp float dt = dot(co.xy, vec2(a,b));
      highp float sn = mod(dt, 3.14159);
      return fract((sin(sn) * c)+u_time*(2.1875));
    }

    void main( void ) {
      vec2 position = vUv;
      vec2 pos = vec2(position.x, position.y);
      gl_FragColor = vec4(rand(pos), rand(pos + 2.0), rand(pos + 1.0), 1.0);
    }
  `;


  const vertexShader = `
  varying vec2 vUv;
  void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
      gl_Position = projectionMatrix * mvPosition;
      vUv = uv;
  }`;

  const [noise] = useMemo(() => {
    const loader = new TextureLoader();
    return [loader.load('/pXg3R.jpeg')];
  }, []);

  const uniforms = useMemo(() => {
    return {
      u_time: {type: 'f', value: 0},
      u_noise: {
        type: 't',
        value: noise,
      },
    };
  }, [noise]);

  uniforms.u_noise.value.wrapS = uniforms.u_noise.value.wrapT = RepeatWrapping

  return (
    <shaderMaterial
      attach="material"
      ref={material}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShaderBW}
    />
  );
}

