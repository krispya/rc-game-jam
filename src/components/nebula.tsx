import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import noiseSrc from '../assets/noise2.png';

const DPR = 0.75;

export function Nebula({
	speed = 0.012,
	scale = 2.25,
	octaves = 5,
	twinkleStrength = 0.1,
}: {
	speed?: number;
	scale?: number;
	octaves?: number;
	twinkleStrength?: number;
}) {
	const mesh = useRef<THREE.Mesh>(null!);

	const camera = useThree().camera as THREE.PerspectiveCamera;
	const noisetexture = useTexture(noiseSrc);

	noisetexture.wrapS = THREE.RepeatWrapping;
	noisetexture.wrapT = THREE.RepeatWrapping;

	noisetexture.minFilter = THREE.NearestMipmapLinearFilter;
	// noisetexture.magFilter = THREE.NearestMipmapLinearFilter;

	const uniforms = {
		uTime: {
			value: 0.0,
		},
		uResolution: new THREE.Uniform(new THREE.Vector2()),
		uNoise: new THREE.Uniform(null),
		uSpeed: new THREE.Uniform(speed),
		uScale: new THREE.Uniform(scale),
		uOctaves: new THREE.Uniform(octaves),
		uTwinkleStrength: new THREE.Uniform(twinkleStrength),
	};

	useFrame((state) => {
		const { clock } = state;
		if (!mesh.current) return;

		// Calculate scale based on camera position
		const distance = camera.position.z;
		const scale = distance * Math.tan((camera.fov * 0.5 * Math.PI) / 180.0) * 2;

		// Update mesh scale
		mesh.current.scale.x = scale * camera.aspect;
		mesh.current.scale.y = scale;

		const material = mesh.current.material as THREE.ShaderMaterial;

		material.uniforms.uTime.value = clock.getElapsedTime();
		material.uniforms.uResolution.value = new THREE.Vector2(
			window.innerWidth * DPR,
			window.innerHeight * DPR
		);

		// material.uniforms.uSpeed.value = speed;
		// material.uniforms.uScale.value = scale;
		// material.uniforms.uOctaves.value = octaves;
		// material.uniforms.uTwinkleStrength.value = twinkleStrength;
		material.uniforms.uNoise.value = noisetexture;
	});

	return (
		<mesh ref={mesh}>
			<planeGeometry args={[1, 1]} />
			<shaderMaterial fragmentShader={cloudfragmentShader} vertexShader={vertexShader} uniforms={uniforms} />
		</mesh>
	);
}

const vertexShader = `varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}`;

const cloudfragmentShader = `
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uOctaves;
uniform float uTwinkleStrength;
uniform sampler2D uNoise;

float random(vec2 c) {
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    f = f*f*(3.0-2.0*f);
    vec2 uv = p + f;
    vec2 rg = textureLod(uNoise, (uv+0.5)/256.0, 0.0).yx;
    return rg.x * 2.0 - 1.0;
}

float starField(vec2 p) {
    vec2 pRandom = vec2(random(p.xy), random(p.yx));
    vec2 fp = fract(pRandom) - 0.5;
    float d = length(fp);
    float brightness = smoothstep(0.05, 0.0, d);

    float twinkleSpeed = 1.25;
    float twinkleStrength = uTwinkleStrength;
    float twinkle = sin(uTime * twinkleSpeed * pRandom.x) * twinkleStrength + 0.5;
    return brightness * twinkle;
}

float fbm(vec2 p) {
    // Initial values
    float value = -0.17;
    float amplitude = 0.75;
    float frequency = uScale;
    // Loop of octaves
    for (int i = 0; i < int(uOctaves); i++) {
        value += amplitude * abs(noise(p));
        p *= frequency;
        amplitude *= 0.35;
    }
    return value;
}

const float X_DIR = 1.0;
const float Y_DIR = -1.0;

float pattern(vec2 p) {  
    vec2 p2 = vec2(p.x * X_DIR, p.y * Y_DIR) - uTime * uSpeed;

    return fbm(p - fbm(p2 + fbm(p2)));
}

void main() {

  vec2 uv = gl_FragCoord.xy/uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;

  vec3 col = vec3(0.0);

  float f = pattern(uv);
  float stars = starField(uv);

  float remappedPattern = smoothstep(0.0, 0.7, f);
  
  vec3 nebulaColor = mix(
    vec3(0.9, 0.2, 0.5),  // Red / Orange
    vec3(0.2, 0.2, 0.9),  // Blue / Purple
    remappedPattern
  );
   

  col = nebulaColor * remappedPattern + stars;
  gl_FragColor = vec4(col, 1.0);
}
`;
