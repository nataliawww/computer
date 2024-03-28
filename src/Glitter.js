import { useRef, useMemo } from 'react'
import { useFrame } from "@react-three/fiber";
import { RepeatWrapping } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export const Glitter = () => {
  const material = useRef();

  let t = 5;

  useFrame(() => {
    if(material && material.current) {
      t += 0.01
      material.current.uniforms.u_time.value = t
    }
  });

  const fragmentShader = `varying vec2 vUv;
  uniform float u_time;
  uniform sampler2D u_noise;

  void main() {
    vec2 vUv = vUv;
    vec2 uv2 = vUv;
    vUv.y += u_time / 10.0;
    vUv.x -= (sin(u_time/10.0)/2.0);

    uv2.y += u_time / 20.0;
    uv2.x += (sin(u_time/10.0)/9.0);
    float result = 0.7;
    result += texture(u_noise, vUv * 0.6 + vec2(u_time*-0.003)).r;
    result *= texture(u_noise, uv2 * 0.9 + vec2(u_time*0.002)).g;
    result = pow(result, 15.0);
    vec3 particles = vec3(18.0)*result;

    vec3 col;
    col.r = texture( u_noise, vec2(vUv.x, vUv.y) ).r;
    col.g = texture( u_noise, vec2(vUv.x, vUv.y) ).g;
    col.b = texture( u_noise, vec2(vUv.x, vUv.y) ).b;

    gl_FragColor = vec4(particles * col, 1.0);
  }`;

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
      fragmentShader={fragmentShader}
    />
  );
}

