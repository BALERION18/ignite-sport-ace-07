import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text3D, useTexture } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import heroStadium from '@/assets/hero-stadium.jpg';

function Stadium() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Stadium environment */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh position={[0, -2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#001122" />
        </mesh>
      </Float>
      
      {/* Running track */}
      <mesh position={[0, -1.8, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 5, 32]} />
        <meshStandardMaterial color="#ff4500" emissive="#ff2200" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Floating athlete silhouette */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef} position={[2, 0, -1]}>
          <boxGeometry args={[0.3, 1.8, 0.1]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive="#00ff88" 
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      {/* Lights */}
      <pointLight position={[10, 10, 5]} intensity={2} color="#007BFF" />
      <pointLight position={[-10, 10, 5]} intensity={2} color="#00FF88" />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.3} 
        intensity={3} 
        color="#ffffff"
        castShadow
      />
      
      {/* Volumetric lighting effect */}
      <mesh position={[0, 5, -10]}>
        <coneGeometry args={[8, 16, 8]} />
        <meshBasicMaterial 
          color="#007BFF" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fallback background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url(${heroStadium})` }}
      />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.3} />
          <Stadium />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate 
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
}