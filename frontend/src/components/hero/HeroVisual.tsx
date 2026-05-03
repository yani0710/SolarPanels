import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import { BatteryCharging, Home, Orbit, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, useMemo, useRef } from 'react';
import { AdditiveBlending, BackSide, type Group, type Mesh } from 'three';

const cellColumns = Array.from({ length: 7 }, (_, index) => index);
const cellRows = Array.from({ length: 4 }, (_, index) => index);

function SunProjection() {
  const sun = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (sun.current) {
      sun.current.rotation.y = clock.elapsedTime * 0.28;
      sun.current.rotation.z = clock.elapsedTime * 0.08;
    }
  });

  return (
    <group position={[-2.55, 1.86, -0.84]}>
      <pointLight color="#fde68a" intensity={12} distance={8} />
      <mesh ref={sun}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={2.65} roughness={0.18} metalness={0.02} />
      </mesh>
      {[0.64, 0.88, 1.18].map((radius, index) => (
        <mesh key={radius}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial
            color={index === 0 ? '#facc15' : '#35e58b'}
            side={BackSide}
            transparent
            opacity={[0.15, 0.07, 0.035][index]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <Html position={[0.08, 0.52, 0]} center className="pointer-events-none select-none">
        <span className="rounded-md border border-amber-200/60 bg-white/70 px-2 py-1 text-[10px] font-black uppercase text-amber-700 shadow-sm backdrop-blur-md">
          Sun
        </span>
      </Html>
    </group>
  );
}

function OrbitRing({ radius, depth, opacity, color = '#2dd4bf' }: { radius: number; depth: number; opacity: number; color?: string }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, depth, 1]}>
      <torusGeometry args={[radius, 0.006, 8, 220]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function PlanetMarker({ position, label, color, size = 0.07 }: { position: [number, number, number]; label: string; color: string; size?: number }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} roughness={0.32} />
      </mesh>
      <Html position={[0.08, 0.08, 0]} center className="pointer-events-none hidden select-none sm:block">
        <span className="rounded-sm border border-white/12 bg-black/45 px-1.5 py-0.5 text-[10px] font-black text-white shadow-[0_0_18px_rgba(56,189,248,.22)] backdrop-blur-md">
          {label}
        </span>
      </Html>
    </group>
  );
}

function SolarPanel({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  const cells = useMemo(
    () =>
      cellColumns.flatMap((column) =>
        cellRows.map((row) => ({
          x: (column - 3) * 0.255,
          z: (row - 1.5) * 0.215,
          id: `${column}-${row}`,
          tone: (column + row) % 2 === 0 ? '#0d3d66' : '#0a2d52'
        }))
      ),
    []
  );

  return (
    <group position={position} rotation={[0.48, rotation, -0.16]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.06, 0.09, 1.13]} />
        <meshStandardMaterial color="#020817" metalness={0.48} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.062, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.92, 0.018, 0.99]} />
        <meshStandardMaterial color="#06162a" metalness={0.28} roughness={0.18} emissive="#0ea5e9" emissiveIntensity={0.1} />
      </mesh>
      {cells.map((cell) => (
        <mesh key={cell.id} position={[cell.x, 0.082, cell.z]} castShadow>
          <boxGeometry args={[0.22, 0.016, 0.18]} />
          <meshStandardMaterial color={cell.tone} metalness={0.36} roughness={0.2} emissive="#0ea5e9" emissiveIntensity={0.16} />
        </mesh>
      ))}
      {[-0.77, -0.51, -0.255, 0, 0.255, 0.51, 0.77].map((x) => (
        <mesh key={x} position={[x, 0.096, 0]}>
          <boxGeometry args={[0.014, 0.012, 0.98]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {[-0.32, -0.105, 0.105, 0.32].map((z) => (
        <mesh key={z} position={[0, 0.098, z]}>
          <boxGeometry args={[1.9, 0.01, 0.012]} />
          <meshStandardMaterial color="#35e58b" emissive="#22c55e" emissiveIntensity={0.45} />
        </mesh>
      ))}
      <mesh position={[0, -0.16, 0.42]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.72, 0.05, 0.08]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.65} roughness={0.2} />
      </mesh>
    </group>
  );
}

function RoofBase() {
  return (
    <group position={[0.06, -0.92, 0.06]} rotation={[0, -0.02, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[3.25, 0.12, 1.55]} />
        <meshStandardMaterial color="#111827" roughness={0.7} metalness={0.05} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => (
        <mesh key={index} position={[-1.42 + index * 0.36, 0.07, 0.01]}>
          <boxGeometry args={[0.012, 0.025, 1.52]} />
          <meshStandardMaterial color="#263241" roughness={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function BatteryTower() {
  return (
    <group position={[2.15, -0.35, 0.1]} rotation={[0.02, -0.1, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.56, 1.32, 0.48]} />
        <meshStandardMaterial color="#07111f" metalness={0.28} roughness={0.32} emissive="#0f766e" emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[0, 0.2, 0.245]}>
        <boxGeometry args={[0.4, 0.46, 0.025]} />
        <meshStandardMaterial color="#35e58b" emissive="#35e58b" emissiveIntensity={1.2} />
      </mesh>
      {[-0.34, 0, 0.34].map((y) => (
        <mesh key={y} position={[0, y, 0.272]}>
          <boxGeometry args={[0.34, 0.014, 0.018]} />
          <meshStandardMaterial color="#bbf7d0" emissive="#35e58b" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function HomeBlock() {
  return (
    <group position={[-3.15, -0.66, 0.34]} rotation={[0, 0.18, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.5, 0.66]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.44, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.68, 0.5, 4]} />
        <meshStandardMaterial color="#0f3b63" roughness={0.36} />
      </mesh>
      <mesh position={[-0.2, -0.03, 0.34]}>
        <boxGeometry args={[0.16, 0.2, 0.024]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0.22, -0.09, 0.34]}>
        <boxGeometry args={[0.16, 0.32, 0.026]} />
        <meshStandardMaterial color="#92400e" roughness={0.46} />
      </mesh>
    </group>
  );
}

function Particle({ offset, points }: { offset: number; points: Array<[number, number, number]> }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.18 + offset) % 1;
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
      <sphereGeometry args={[0.045, 18, 18]} />
      <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2.5} />
    </mesh>
  );
}

function EnergyPath({ points }: { points: Array<[number, number, number]> }) {
  const particles = useMemo(() => [0, 0.2, 0.4, 0.6, 0.8], []);

  return (
    <group>
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const mid: [number, number, number] = [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2, (point[2] + next[2]) / 2];
        const length = Math.hypot(next[0] - point[0], next[1] - point[1], next[2] - point[2]);
        return (
          <mesh key={index} position={mid} rotation={[0, 0, Math.atan2(next[1] - point[1], next[0] - point[0])]}>
            <boxGeometry args={[length, 0.014, 0.014]} />
            <meshStandardMaterial color="#35e58b" emissive="#35e58b" emissiveIntensity={1.8} />
          </mesh>
        );
      })}
      {particles.map((offset) => <Particle key={offset} offset={offset} points={points} />)}
    </group>
  );
}

function ProjectionField() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.24) * 0.035;
  });

  return (
    <group ref={group} rotation={[0.08, -0.12, 0]}>
      <group position={[-0.1, 0.18, -0.34]}>
        {[1.18, 1.62, 2.08, 2.58, 3.12, 3.72].map((radius, index) => (
          <OrbitRing key={radius} radius={radius} depth={0.38 + index * 0.035} opacity={0.1 - index * 0.008} color={index % 2 ? '#35e58b' : '#38bdf8'} />
        ))}
        <PlanetMarker label="PV Field" color="#38bdf8" position={[0.82, 0.02, 0.7]} size={0.045} />
        <PlanetMarker label="Battery" color="#35e58b" position={[2.02, -0.1, -0.06]} size={0.055} />
        <PlanetMarker label="Grid" color="#facc15" position={[2.95, 0.12, -0.18]} size={0.065} />
      </group>

      <Float speed={1.15} rotationIntensity={0.05} floatIntensity={0.24}>
        <SunProjection />
        <RoofBase />
        <SolarPanel position={[-0.78, -0.56, 0.14]} rotation={0.04} />
        <SolarPanel position={[0.22, -0.4, 0.04]} rotation={0.025} />
        <SolarPanel position={[1.16, -0.24, -0.08]} rotation={0.01} scale={0.96} />
        <HomeBlock />
        <BatteryTower />
        <EnergyPath points={[[-2.1, 1.16, -0.05], [-0.62, 0.46, -0.02], [0.74, 0.05, 0], [1.96, -0.05, 0.02]]} />
      </Float>
    </group>
  );
}

function SolarScene() {
  return (
    <>
      <color attach="background" args={['#a8dcff']} />
      <fog attach="fog" args={['#b9e4ff', 7, 14]} />
      <ambientLight intensity={0.74} />
      <hemisphereLight color="#dff7ff" groundColor="#bbf7d0" intensity={1.4} />
      <directionalLight position={[-3.5, 4.2, 2.5]} intensity={2.65} castShadow />
      <pointLight position={[2.6, 1.1, 1.6]} color="#38bdf8" intensity={1.1} distance={5.8} />
      <ProjectionField />
      <ContactShadowsWrapper />
      <Html position={[-2.25, 2.18, 0]} center className="pointer-events-none hidden sm:block">
        <Metric label="Irradiance" value="BG solar map" />
      </Html>
      <Html position={[2.08, 1.05, 0]} center className="pointer-events-none hidden sm:block">
        <Metric label="Projected" value="5.8 kWp" />
      </Html>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.34} minPolarAngle={1.0} maxPolarAngle={1.72} />
    </>
  );
}

function ContactShadowsWrapper() {
  return (
    <mesh position={[0.25, -1.14, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[3.2, 80]} />
      <meshBasicMaterial color="#14532d" transparent opacity={0.22} depthWrite={false} />
    </mesh>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-36 rounded-md border border-white/12 bg-black/55 px-3 py-2 text-left text-white shadow-2xl backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase text-cyan">{label}</div>
      <div className="text-sm font-black">{value}</div>
    </div>
  );
}

export function HeroVisual() {
  const chips = [
    ['5.8 kWp', Zap],
    ['Hybrid', Home],
    ['Battery 8 kWh', BatteryCharging],
    ['High confidence', ShieldCheck]
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="projection-shell relative min-h-[440px] overflow-hidden rounded-lg border border-white/12 bg-sky-200 shadow-card"
    >
      <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap gap-2">
        {chips.map(([label, Icon]) => (
          <div key={String(label)} className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-black/50 px-3 py-2 text-xs font-bold text-white shadow-[0_0_24px_rgba(56,189,248,.12)] backdrop-blur-xl">
            <Icon size={14} className="text-mint" />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(186,230,253,.42),rgba(240,253,244,.16)_55%,rgba(22,101,52,.14)),radial-gradient(circle_at_22%_24%,rgba(250,204,21,.2),transparent_12rem)]" />
      <div className="h-[440px] w-full sm:h-[540px]">
        <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted">Зареждаме 3D визуализация...</div>}>
          <Canvas camera={{ position: [0, 0.82, 5.65], fov: 45 }} dpr={[1, 2]} shadows gl={{ antialias: true, alpha: false }}>
            <SolarScene />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/12 bg-black/58 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan">
              <Orbit size={14} />
              Solar projection
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-300">Панели, батерия и потребление в една визуална система.</p>
          </div>
          <div className="min-w-40">
            <div className="mb-1 flex justify-between text-[11px] font-bold uppercase text-muted">
              <span>Day</span>
              <span>Night</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ delay: 0.45, duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-mint via-cyan to-solar" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
