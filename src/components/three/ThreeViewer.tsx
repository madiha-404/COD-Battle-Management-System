'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function CharacterModel({ color = '#00e5ff' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.55, 1.4, 8]} />
        <meshStandardMaterial color="#0a2030" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Chest plate */}
      <mesh position={[0, 0.2, 0.3]}>
        <boxGeometry args={[0.7, 0.8, 0.15]} />
        <meshStandardMaterial color="#0e3045" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#0a2030" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 1.12, 0.28]}>
        <boxGeometry args={[0.4, 0.12, 0.05]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} distort={0.1} speed={2} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.65, 0.1, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.9, 8]} />
        <meshStandardMaterial color="#0a2030" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.65, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.9, 8]} />
        <meshStandardMaterial color="#0a2030" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Shoulder pads */}
      <mesh position={[-0.6, 0.55, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#0e3045" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0.6, 0.55, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#0e3045" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.22, -1.05, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 1.0, 8]} />
        <meshStandardMaterial color="#0a2030" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.22, -1.05, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 1.0, 8]} />
        <meshStandardMaterial color="#0a2030" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.22, -1.62, 0.06]}>
        <boxGeometry args={[0.28, 0.2, 0.4]} />
        <meshStandardMaterial color="#061820" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.22, -1.62, 0.06]}>
        <boxGeometry args={[0.28, 0.2, 0.4]} />
        <meshStandardMaterial color="#061820" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Glow orb - chest */}
      <mesh position={[0, 0.2, 0.38]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      {/* Point light from chest */}
      <pointLight position={[0, 0.2, 0.5]} color={color} intensity={1.5} distance={3} />
    </group>
  );
}

function WeaponModel({ color = '#00e5ff' }: { color?: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Rifle body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.18, 0.15]} />
        <meshStandardMaterial color="#071520" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Barrel */}
      <mesh position={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 12]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0a2030" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Scope */}
      <mesh position={[0.2, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#071520" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Scope lens */}
      <mesh position={[0.2, 0.18, 0.3]}>
        <circleGeometry args={[0.06, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} />
      </mesh>
      {/* Magazine */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.35, 0.12]} />
        <meshStandardMaterial color="#061820" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Energy cell */}
      <mesh position={[0.5, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.13]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.9} />
      </mesh>
      {/* Muzzle glow */}
      <mesh position={[1.52, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[1.52, 0, 0]} color={color} intensity={2} distance={2} />
    </group>
  );
}

interface ThreeViewerProps {
  type?: 'character' | 'weapon';
  color?: string;
  className?: string;
}

export default function ThreeViewer({ type = 'character', color = '#00e5ff', className = '' }: ThreeViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, type === 'character' ? 5 : 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} color="#001a26" />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color={color} />
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
            {type === 'character' ? (
              <CharacterModel color={color} />
            ) : (
              <WeaponModel color={color} />
            )}
          </Float>
          <Environment preset="night" />
          {/* Ground ring glow */}
          <mesh position={[0, type === 'character' ? -1.8 : -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 64]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.4} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}
