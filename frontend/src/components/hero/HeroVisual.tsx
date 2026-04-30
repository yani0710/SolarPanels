import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import { BatteryCharging, Home, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, useMemo, useRef } from 'react';
import type { Mesh } from 'three';

function SolarPanel({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0.28, rotation, -0.18]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.1, 0.08, 1.15]} />
        <meshStandardMaterial color="#071a2f" metalness={0.25} roughness={0.32} />
      </mesh>
      {[-0.62, 0, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.052, 0]}>
          <boxGeometry args={[0.035, 0.018, 1.08]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.75} />
        </mesh>
      ))}
      {[-0.35, 0.35].map((z) => (
        <mesh key={z} position={[0, 0.055, z]}>
          <boxGeometry args={[2, 0.018, 0.035]} />
          <meshStandardMaterial color="#35e58b" emissive="#22c55e" emissiveIntensity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyLine({ points }: { points: Array<[number, number, number]> }) {
  const particles = useMemo(() => [0, 0.22, 0.44, 0.66, 0.88], []);
  return (
    <group>
      {points.map((point, index) => {
        if (index === points.length - 1) return null;
        const next = points[index + 1];
        const mid: [number, number, number] = [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2, (point[2] + next[2]) / 2];
        const length = Math.hypot(next[0] - point[0], next[1] - point[1], next[2] - point[2]);
        return (
          <mesh key={index} position={mid} rotation={[0, 0, Math.atan2(next[1] - point[1], next[0] - point[0])]}>
            <boxGeometry args={[length, 0.018, 0.018]} />
            <meshStandardMaterial color="#35e58b" emissive="#35e58b" emissiveIntensity={1.4} />
          </mesh>
        );
      })}
      {particles.map((offset, index) => <Particle key={index} offset={offset} points={points} />)}
    </group>
  );
}

function Particle({ offset, points }: { offset: number; points: Array<[number, number, number]> }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.22 + offset) % 1;
    const segment = Math.min(points.length - 2, Math.floor(t * (points.length - 1)));
    const local = t * (points.length - 1) - segment;
    const a = points[segment];
    const b = points[segment + 1];
    if (ref.current) {
      ref.current.position.set(a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local, a[2] + (b[2] - a[2]) * local);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 16, 16]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1.7} />
    </mesh>
  );
}

function SolarScene() {
  const sun = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (sun.current) sun.current.rotation.y = clock.elapsedTime * 0.35;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} />
      <pointLight position={[-3, 2, 3]} color="#35e58b" intensity={5} />
      <Float speed={1.5} rotationIntensity={0.16} floatIntensity={0.55}>
        <mesh ref={sun} position={[-2.2, 1.35, -0.4]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={1.5} roughness={0.18} />
        </mesh>
        <SolarPanel position={[0, 0.25, 0]} />
        <SolarPanel position={[1.12, -0.18, 0.28]} rotation={0.08} />
        <mesh position={[2.2, -0.25, 0]}>
          <boxGeometry args={[0.58, 1.2, 0.58]} />
          <meshStandardMaterial color="#0b253d" emissive="#35e58b" emissiveIntensity={0.36} metalness={0.2} />
        </mesh>
        <mesh position={[2.2, -0.1, 0.31]}>
          <boxGeometry args={[0.44, 0.54, 0.04]} />
          <meshStandardMaterial color="#35e58b" emissive="#35e58b" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[-0.85, -1.1, 0]}>
          <boxGeometry args={[1.25, 0.86, 1]} />
          <meshStandardMaterial color="#102c49" roughness={0.4} />
        </mesh>
        <mesh position={[-0.85, -0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.92, 0.92, 1.04]} />
          <meshStandardMaterial color="#17466d" roughness={0.35} />
        </mesh>
        <EnergyLine points={[[-2, 1.2, 0], [-0.5, 0.55, 0], [0.8, 0.18, 0], [2, -0.05, 0]]} />
      </Float>
      <Html position={[-1.85, 1.95, 0]} center className="hidden sm:block">
        <Metric label="Power" value="5.8 kWp" />
      </Html>
      <Html position={[2.25, 1.02, 0]} center className="hidden sm:block">
        <Metric label="Battery" value="8 kWh" />
      </Html>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.45} minPolarAngle={1.05} maxPolarAngle={1.75} />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-32 rounded-2xl border border-white/15 bg-[#071a2f]/80 px-3 py-2 text-white shadow-2xl backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan">{label}</div>
      <div className="text-sm font-black">{value}</div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-card backdrop-blur-2xl">
      <div className="absolute inset-x-5 top-5 z-10 flex flex-wrap gap-2">
        {([
          ['5.8 kWp', Zap],
          ['Hybrid', Home],
          ['Battery 8 kWh', BatteryCharging],
          ['Good fit', ShieldCheck]
        ] as const).map(([label, Icon]) => (
          <div key={String(label)} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-navy/60 px-3 py-2 text-xs font-bold text-white backdrop-blur-xl">
            <Icon size={14} className="text-mint" />
            {label}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,.18),transparent_22rem)]" />
      <div className="h-[430px] w-full sm:h-[520px]">
        <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Зареждаме 3D визуализация...</div>}>
          <Canvas camera={{ position: [0, 0.75, 5.3], fov: 48 }} dpr={[1, 1.6]} shadows>
            <SolarScene />
          </Canvas>
        </Suspense>
      </div>
      <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/12 bg-navy/70 p-4 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-muted">
          <span>Дневно</span>
          <span>Вечерно</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: '58%' }} transition={{ delay: 0.4, duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-mint via-cyan to-solar" />
        </div>
      </div>
    </motion.div>
  );
}
