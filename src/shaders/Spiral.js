import { useRef, useMemo } from 'react'
import { useFrame } from "@react-three/fiber";
import { RepeatWrapping, Vector2 } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Spiral = () => {
  const material = useRef();

  let t = 5;

  useFrame(() => {
    if(material && material.current) {
      t += 0.01
      material.current.uniforms.u_time.value = t
    }
  });

  const fragmentShader = `varying vec2 vUv;
  precision highp float;
  uniform float u_time;
  uniform vec2 mouse;
  uniform vec2 u_resolution;
  float z = inv( zoom );
  vec2 p = vec2( 0. );
  vec3 c = vec3( 0. );
  float circle( vec2 p, float r ) { return step( length( p ), r ); }
  vec3 hsv2rgb( float h, float s, float v ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return v*mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), s ); }
  vec3 hueShift( float h ) { vec4 k = vec4( 1., 2./3., 1./3., 3. ); vec3 p = abs( fract( vec3( h ) + k.xyz )*6. - k.www ); return mix( vec3( 1. ), clamp( p - vec3( 1. ), 0., 1. ), 1. ); }

  void main( void )
  {
    p = z*( vUv - u_reslution/2. )/min( u_reslution.x, u_reslution.y );
    float lp = length( p*7. );
    p *= rot( lp + u_time );
    float theta = atan( p.y, p.x );
          c += step( sin( theta*7. ), 0. );
    //c *= circle( p, 1. );
        
    gl_FragColor = vec4( c, 1. );
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
      u_resolution: {type: "v2", value: new Vector2()}
    };
  }, [noise]);

  uniforms.u_noise.value.wrapS = uniforms.u_noise.value.wrapT = RepeatWrapping

  return (
    <shaderMaterial
      attach="material"
      ref={material}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  );
}

