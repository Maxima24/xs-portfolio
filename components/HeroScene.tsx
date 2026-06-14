'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/** Distorted, slowly auto-rotating icosahedron with neon emissive material. */
function NeonBlob() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // slow auto-rotation
    mesh.current.rotation.y += delta * 0.15;
    mesh.current.rotation.x += delta * 0.05;
    // subtle parallax toward the pointer
    const { x, y } = state.pointer;
    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      x * 0.35,
      0.04,
    );
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      y * 0.35,
      0.04,
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <Icosahedron ref={mesh} args={[1.6, 6]}>
        <MeshDistortMaterial
          color="#00f0ff"
          emissive="#0088aa"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.85}
          distort={0.4}
          speed={1.6}
          wireframe={false}
        />
      </Icosahedron>
    </Float>
  );
}

/** A second, larger wireframe shell tinted magenta for depth. */
function WireShell() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y -= delta * 0.08;
  });
  return (
    <Icosahedron ref={mesh} args={[2.6, 1]}>
      <meshBasicMaterial
        color="#ff00e5"
        wireframe
        transparent
        opacity={0.18}
      />
    </Icosahedron>
  );
}

/** Drifting neon particle field. */
function Particles({ count = 240 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // deterministic-ish scatter on a sphere shell (no Math.random dependency on render order)
      const r = 4 + (i % 7) * 0.35;
      const theta = (i * 2.399963) % (Math.PI * 2);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions };
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#7af9ff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((state) => {
    // gentle camera sway following the pointer
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.pointer.x * 0.6,
      0.03,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.pointer.y * 0.6,
      0.03,
    );
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ pointerEvents: 'none' }}
    >
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#00f0ff" />
      <pointLight position={[-5, -3, 2]} intensity={1.6} color="#ff00e5" />
      <Suspense fallback={null}>
        <NeonBlob />
        <WireShell />
        <Particles />
        <EffectComposer>
          <Bloom
            intensity={1.1}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Suspense>
      <Rig />
    </Canvas>
  );
}
