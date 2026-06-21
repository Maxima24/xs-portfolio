'use client';

import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Icosahedron,
  MeshDistortMaterial,
  Float,
  Text,
  Billboard,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

type Track = 'general' | 'frontend' | 'backend';

/**
 * Reads the active track + resolved accent from the DOM once on mount.
 * PORTFOLIO_TRACK is not exposed to client JS, so the source of truth is
 * `document.body.dataset.track` + the resolved `--accent` CSS variable
 * (both set per-track in app/layout.tsx / globals.css).
 */
function useTrackAccent(): { track: Track; accent: string; accent2: string } {
  const [state, setState] = useState<{
    track: Track;
    accent: string;
    accent2: string;
  }>({ track: 'general', accent: '#00f0ff', accent2: '#7af9ff' });

  useEffect(() => {
    const body = document.body;
    const track = (body.dataset.track as Track) || 'general';
    const styles = getComputedStyle(body);
    const accent = styles.getPropertyValue('--accent').trim() || '#00f0ff';
    const accent2 = styles.getPropertyValue('--accent-2').trim() || accent;
    setState({ track, accent, accent2 });
  }, []);

  return state;
}

/* ------------------------------------------------------------------ */
/*  general / frontend — icosahedron blob (unchanged appearance)       */
/* ------------------------------------------------------------------ */

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
      <meshBasicMaterial color="#ff00e5" wireframe transparent opacity={0.18} />
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

/** The original blob scene, used for general + frontend tracks. */
function BlobScene() {
  return (
    <>
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
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  backend — system architecture graph                                */
/* ------------------------------------------------------------------ */

type NodeKind = 'service' | 'queue' | 'db';

interface GraphNode {
  pos: THREE.Vector3;
  kind: NodeKind;
  label: string;
}

interface GraphEdge {
  a: number;
  b: number;
}

// Deterministic, infra-flavoured labels per kind so the motif reads like a real
// system. Index-based pick (no randomness) keeps labels stable across renders.
const KIND_LABELS: Record<NodeKind, string[]> = {
  service: ['NestJS API', 'Go service', 'Auth service', 'Gateway'],
  queue: ['Kafka', 'Redis', 'RabbitMQ', 'DLQ'],
  db: ['Postgres', 'Read replica', 'Outbox', 'Ledger'],
};

/**
 * Builds a deterministic node graph. Positions use index-based trig (no
 * Math.random / Date.now) so SSR and client agree and the layout is stable.
 */
function useGraph(nodeCount: number): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  return useMemo(() => {
    const kinds: NodeKind[] = ['service', 'queue', 'db'];
    const kindSeen: Record<NodeKind, number> = { service: 0, queue: 0, db: 0 };
    const nodes: GraphNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      // Deterministic scatter inside a soft ellipsoid using golden-angle trig.
      const t = i + 0.5;
      const theta = (i * 2.399963) % (Math.PI * 2); // golden angle
      const phi = Math.acos(1 - (2 * t) / nodeCount);
      // radius wobbles by index so nodes don't sit on a perfect shell
      const r = 2.1 + ((i * 1.37) % 1) * 1.5;
      const x = r * Math.sin(phi) * Math.cos(theta) * 1.25;
      const y = r * Math.cos(phi) * 0.85;
      const z = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      const kind = kinds[i % kinds.length];
      const labels = KIND_LABELS[kind];
      const label = labels[kindSeen[kind] % labels.length];
      kindSeen[kind] += 1;
      nodes.push({ pos: new THREE.Vector3(x, y, z), kind, label });
    }

    // Connect each node to its 2 nearest neighbours -> a sparse, readable mesh.
    const edgeSet = new Set<string>();
    const edges: GraphEdge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (j === i) continue;
        dists.push({ j, d: nodes[i].pos.distanceToSquared(nodes[j].pos) });
      }
      dists.sort((p, q) => p.d - q.d);
      for (let k = 0; k < 2; k++) {
        const j = dists[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (edgeSet.has(key)) continue;
        edgeSet.add(key);
        edges.push({ a: Math.min(i, j), b: Math.max(i, j) });
      }
    }

    return { nodes, edges };
  }, [nodeCount]);
}

/** Edge lines connecting the nodes (data-flow paths). `edges` may be a subset. */
function GraphEdges({
  nodes,
  edges,
  color,
  opacity,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  color: string;
  opacity: number;
}) {
  const positions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      const a = nodes[e.a].pos;
      const b = nodes[e.b].pos;
      arr[i * 6] = a.x;
      arr[i * 6 + 1] = a.y;
      arr[i * 6 + 2] = a.z;
      arr[i * 6 + 3] = b.x;
      arr[i * 6 + 4] = b.y;
      arr[i * 6 + 5] = b.z;
    });
    return arr;
  }, [nodes, edges]);

  if (edges.length === 0) return null;

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={edges.length * 2}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </lineSegments>
  );
}

/** Glowing pulses that travel along the edges to convey data flow. */
function GraphPulses({
  nodes,
  edges,
  color,
  active,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  color: string;
  active: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const count = edges.length;

  // Phase offset per pulse is deterministic (index-based) for stable motion.
  const phases = useMemo(() => edges.map((_, i) => (i * 0.61803) % 1), [edges]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    const speedMul = active ? 1.9 : 1;
    const attr = points.current.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const e = edges[i];
      const a = nodes[e.a].pos;
      const b = nodes[e.b].pos;
      // travel parameter 0..1 looping; speed varies subtly per edge
      const speed = (0.18 + ((i * 0.37) % 1) * 0.12) * speedMul;
      const t = (time * speed + phases[i]) % 1;
      attr.setXYZ(
        i,
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t,
        a.z + (b.z - a.z) * t,
      );
    }
    attr.needsUpdate = true;
    // brighten + fatten the pulses when the system is "energised"
    if (material.current) {
      material.current.size = THREE.MathUtils.lerp(
        material.current.size,
        active ? 0.18 : 0.13,
        0.1,
      );
      material.current.opacity = THREE.MathUtils.lerp(
        material.current.opacity,
        active ? 1 : 0.9,
        0.1,
      );
    }
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
        ref={material}
        size={0.13}
        color={color}
        transparent
        opacity={0.95}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

/**
 * Backend system-architecture motif: infra nodes + data-flow edges + animated
 * pulses. Interactive: live cursor parallax, cursor-proximity energising of
 * nodes, and a hover label that names each infra primitive.
 */
function SystemGraph({ accent, accent2 }: { accent: string; accent2: string }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, edges } = useGraph(12);
  const [hovered, setHovered] = useState<number | null>(null);

  // refs to the visible node meshes so we can drive scale + emissive per frame
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useRef(new THREE.Vector3());

  const activeEdges = useMemo(
    () =>
      hovered === null
        ? []
        : edges.filter((e) => e.a === hovered || e.b === hovered),
    [hovered, edges],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // auto-rotation + live pointer parallax
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.12, 0.04);
    const { x, y } = state.pointer;
    g.position.x = THREE.MathUtils.lerp(g.position.x, x * 0.3, 0.04);
    g.position.y = THREE.MathUtils.lerp(g.position.y, y * 0.3, 0.04);

    // per-node energy: screen-space proximity to the cursor + hover boost.
    // Projecting to NDC makes proximity rotation-independent and cheap (12 nodes).
    for (let i = 0; i < nodes.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;
      mesh.getWorldPosition(tmp.current);
      tmp.current.project(state.camera);
      const dx = tmp.current.x - state.pointer.x;
      const dy = tmp.current.y - state.pointer.y;
      const dist = Math.hypot(dx, dy);
      const proximity = THREE.MathUtils.clamp(1 - dist / 0.5, 0, 1);
      const energy = Math.max(proximity * 0.7, hovered === i ? 1 : 0);

      const targetScale = 1 + energy * 0.6;
      mesh.scale.setScalar(
        THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.15),
      );
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        1.1 + energy * 1.7,
        0.15,
      );
    }
  });

  return (
    <>
      <group ref={group}>
        {nodes.map((node, i) => (
          <group key={i} position={node.pos}>
            {/* visible infra node — shape varies by kind */}
            <mesh
              ref={(el) => {
                meshRefs.current[i] = el;
              }}
            >
              {node.kind === 'service' && <sphereGeometry args={[0.12, 16, 16]} />}
              {node.kind === 'queue' && <boxGeometry args={[0.2, 0.2, 0.2]} />}
              {node.kind === 'db' && (
                <cylinderGeometry args={[0.13, 0.13, 0.26, 18]} />
              )}
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={1.1}
                roughness={0.35}
                metalness={0.6}
              />
            </mesh>
            {/* invisible, larger hit-area so hover is forgiving */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(i);
              }}
              onPointerOut={() => setHovered((h) => (h === i ? null : h))}
            >
              <sphereGeometry args={[0.34, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        ))}

        <GraphEdges nodes={nodes} edges={edges} color={accent2} opacity={0.22} />
        {/* edges touching the hovered node light up */}
        <GraphEdges
          nodes={nodes}
          edges={activeEdges}
          color={accent}
          opacity={0.75}
        />
        <GraphPulses
          nodes={nodes}
          edges={edges}
          color={accent}
          active={hovered !== null}
        />

        {/* hover label — names the infra primitive, billboarded + glowing */}
        {hovered !== null && (
          <Billboard
            position={[
              nodes[hovered].pos.x,
              nodes[hovered].pos.y + 0.46,
              nodes[hovered].pos.z,
            ]}
          >
            <Text
              fontSize={0.26}
              color={accent}
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.012}
              outlineColor="#05050a"
            >
              {nodes[hovered].label}
            </Text>
          </Billboard>
        )}
      </group>

      {/* Softened bloom — reserved hero moment glowing the nodes/pulses. */}
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */

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

export default function HeroScene({
  eventSourceRef,
}: {
  eventSourceRef: RefObject<HTMLElement>;
}) {
  const { track, accent, accent2 } = useTrackAccent();
  const isBackend = track === 'backend';

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ pointerEvents: 'none' }}
      // The canvas is pointer-events:none so the hero text/buttons stay
      // clickable; r3f instead sources pointer events from the hero <section>
      // (client coords -> canvas NDC), reviving parallax + enabling node hover.
      eventSource={eventSourceRef.current ?? undefined}
      eventPrefix="client"
    >
      <color attach="background" args={['#0b0a0d']} />
      <ambientLight intensity={0.4} />
      {isBackend ? (
        <>
          <pointLight position={[5, 5, 5]} intensity={2} color={accent} />
          <pointLight position={[-5, -3, 2]} intensity={1.2} color={accent2} />
        </>
      ) : (
        <>
          <pointLight position={[5, 5, 5]} intensity={2} color="#00f0ff" />
          <pointLight position={[-5, -3, 2]} intensity={1.6} color="#ff00e5" />
        </>
      )}
      <Suspense fallback={null}>
        {isBackend ? (
          <SystemGraph accent={accent} accent2={accent2} />
        ) : (
          <BlobScene />
        )}
      </Suspense>
      <Rig />
    </Canvas>
  );
}
