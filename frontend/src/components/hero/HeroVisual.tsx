import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Html, OrbitControls } from '@react-three/drei';
import { BatteryCharging, Home, Orbit, ShieldCheck, SunMedium } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Suspense, useMemo, useRef } from 'react';
import type { MouseEvent } from 'react';
import { AdditiveBlending, BackSide, CatmullRomCurve3, DoubleSide, type Group, type Mesh, Vector3 } from 'three';
import { useTheme } from '../../context/ThemeContext';

const htmlZIndexRange: [number, number] = [20, 0];
const panelCells = Array.from({ length: 24 }, (_, index) => ({
  column: index % 6,
  row: Math.floor(index / 6)
}));

const flowPoints = [
  [-2.2, -0.34, 0.1],
  [-1.08, -0.22, 0.18],
  [0.2, -0.14, 0.16],
  [1.3, -0.32, 0.2],
  [2.26, -0.5, 0.26],
  [3.1, -0.4, 0.02]
] as Array<[number, number, number]>;

function MetricPill({ label, value, tone }: { label: string; value: string; tone: 'amber' | 'orange' | 'cyan' }) {
  const toneClass = {
    amber: 'border-[#FFD166]/30 text-[#FFD166]',
    orange: 'border-[#FF9F43]/30 text-[#FFB56C]',
    cyan: 'border-[#4FD1FF]/30 text-[#A6EAFF]'
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border bg-[#181B1F]/76 px-2 py-1 text-[10px] font-black uppercase shadow-2xl backdrop-blur-md ${toneClass}`}>
      <span>{label}</span>
      <span className="text-[#F5F7FA]/70">{value}</span>
    </span>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="w-40 rounded-lg border border-white/12 bg-[#181B1F]/72 px-3 py-2 text-left text-[#F5F7FA] shadow-2xl backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[#4FD1FF]">{label}</div>
      <div className="mt-0.5 text-base font-black">{value}</div>
      <div className="text-[11px] font-semibold text-[#AAB3C2]">{detail}</div>
    </div>
  );
}

function SunRig() {
  const rays = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (rays.current) rays.current.rotation.z = Math.sin(clock.elapsedTime * 0.62) * 0.05;
  });

  return (
    <group position={[-2.65, 1.48, -0.82]}>
      <pointLight color="#FFD166" intensity={16} distance={7} />
      <mesh>
        <sphereGeometry args={[0.42, 64, 64]} />
        <meshStandardMaterial color="#FFD166" emissive="#FF9F43" emissiveIntensity={2.5} roughness={0.18} />
      </mesh>
      {[0.74, 1.08, 1.45].map((radius, index) => (
        <mesh key={radius}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial
            color={index === 0 ? '#FFD166' : '#4FD1FF'}
            side={BackSide}
            transparent
            opacity={[0.18, 0.075, 0.035][index]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <group ref={rays}>
        {[-0.42, -0.18, 0.08, 0.34].map((offset, index) => (
          <mesh key={offset} position={[0.76 + index * 0.16, -0.64 + offset, 0.04]} rotation={[0.1, 0, -0.44]}>
            <planeGeometry args={[2.26, 0.14]} />
            <meshBasicMaterial color="#FFD166" transparent opacity={0.16} depthWrite={false} side={DoubleSide} blending={AdditiveBlending} />
          </mesh>
        ))}
      </group>
      <Html position={[0.04, 0.58, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none select-none">
        <MetricPill tone="amber" label="Sun" value="5.4h" />
      </Html>
    </group>
  );
}

function PanelCell({ x, z, index }: { x: number; z: number; index: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = Math.sin(clock.elapsedTime * 2.1 + index * 0.34) * 0.5 + 0.5;
    ref.current.scale.y = 1 + pulse * 0.2;
  });

  return (
    <mesh ref={ref} position={[x, 0.085, z]} castShadow>
      <boxGeometry args={[0.23, 0.018, 0.18]} />
      <meshStandardMaterial color={index % 2 ? '#0B314F' : '#071F36'} metalness={0.42} roughness={0.18} emissive="#4FD1FF" emissiveIntensity={0.2} />
    </mesh>
  );
}

function SolarPanel({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  return (
    <group position={position} rotation={[0.5, rotation, -0.17]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.08]} />
        <meshStandardMaterial color="#07111F" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[1.66, 0.022, 0.92]} />
        <meshStandardMaterial color="#071B2B" metalness={0.32} roughness={0.16} emissive="#4FD1FF" emissiveIntensity={0.14} />
      </mesh>
      {panelCells.map(({ column, row }, index) => (
        <PanelCell key={`${column}-${row}`} x={(column - 2.5) * 0.26} z={(row - 1.5) * 0.215} index={index} />
      ))}
      {[-0.65, -0.39, -0.13, 0.13, 0.39, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.106, 0]}>
          <boxGeometry args={[0.014, 0.014, 0.9]} />
          <meshStandardMaterial color="#BEEBFF" emissive="#4FD1FF" emissiveIntensity={0.95} />
        </mesh>
      ))}
      {[-0.33, -0.11, 0.11, 0.33].map((z) => (
        <mesh key={z} position={[0, 0.108, z]}>
          <boxGeometry args={[1.64, 0.012, 0.012]} />
          <meshStandardMaterial color="#FFD166" emissive="#FF9F43" emissiveIntensity={0.62} />
        </mesh>
      ))}
      <mesh position={[0, -0.18, 0.38]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.48, 0.05, 0.08]} />
        <meshStandardMaterial color="#C9D3DD" metalness={0.7} roughness={0.24} />
      </mesh>
    </group>
  );
}

function RoofDeck() {
  return (
    <group position={[-0.2, -0.86, 0.08]} rotation={[0, -0.03, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[3.7, 0.16, 1.62]} />
        <meshStandardMaterial color="#1F2630" roughness={0.72} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={index} position={[-1.68 + index * 0.34, 0.095, 0]}>
          <boxGeometry args={[0.014, 0.03, 1.58]} />
          <meshStandardMaterial color="#343C47" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, -0.83]}>
        <boxGeometry args={[3.76, 0.1, 0.08]} />
        <meshStandardMaterial color="#111315" roughness={0.5} />
      </mesh>
    </group>
  );
}

function SmartHome() {
  return (
    <group position={[-3.04, -0.62, 0.34]} rotation={[0, 0.16, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.54, 0.68]} />
        <meshStandardMaterial color="#DCE4EC" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.7, 0.52, 4]} />
        <meshStandardMaterial color="#10293E" roughness={0.36} />
      </mesh>
      {[[-0.24, 0.03], [0.08, 0.03], [-0.24, -0.16]].map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.35]}>
          <boxGeometry args={[0.16, 0.14, 0.026]} />
          <meshStandardMaterial color="#BAEFFF" emissive="#4FD1FF" emissiveIntensity={0.38} />
        </mesh>
      ))}
      <mesh position={[0.25, -0.11, 0.35]}>
        <boxGeometry args={[0.17, 0.32, 0.028]} />
        <meshStandardMaterial color="#9A5A22" roughness={0.46} />
      </mesh>
    </group>
  );
}

function BatteryStack() {
  const charge = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!charge.current) return;
    const level = 0.72 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
    charge.current.scale.y = level;
    charge.current.position.y = -0.17 + level * 0.18;
  });

  return (
    <group position={[2.88, -0.38, 0.18]} rotation={[0.03, -0.1, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, 1.36, 0.5]} />
        <meshStandardMaterial color="#07111F" metalness={0.32} roughness={0.32} emissive="#4FD1FF" emissiveIntensity={0.16} />
      </mesh>
      <mesh ref={charge} position={[0, 0.05, 0.262]}>
        <boxGeometry args={[0.4, 0.72, 0.028]} />
        <meshStandardMaterial color="#FFD166" emissive="#FF9F43" emissiveIntensity={1.45} />
      </mesh>
      {[-0.44, 0, 0.44].map((y) => (
        <mesh key={y} position={[0, y, 0.292]}>
          <boxGeometry args={[0.34, 0.014, 0.02]} />
          <meshStandardMaterial color="#FFF3C2" emissive="#FFD166" emissiveIntensity={0.82} />
        </mesh>
      ))}
      <Html position={[0.08, 0.88, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none sm:block">
        <MetricPill tone="orange" label="Battery" value="8 kWh" />
      </Html>
    </group>
  );
}

function InverterNode() {
  return (
    <group position={[2.08, -0.66, 0.38]} rotation={[0.02, -0.2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.54, 0.28]} />
        <meshStandardMaterial color="#C9D3DD" metalness={0.2} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.06, 0.154]}>
        <boxGeometry args={[0.28, 0.08, 0.024]} />
        <meshStandardMaterial color="#4FD1FF" emissive="#4FD1FF" emissiveIntensity={0.78} />
      </mesh>
      <mesh position={[0, -0.1, 0.154]}>
        <boxGeometry args={[0.28, 0.08, 0.024]} />
        <meshStandardMaterial color="#FFD166" emissive="#FF9F43" emissiveIntensity={0.78} />
      </mesh>
    </group>
  );
}

function GridNode() {
  return (
    <group position={[3.42, -0.5, -0.16]} rotation={[0, -0.18, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.045, 1.3, 8]} />
        <meshStandardMaterial color="#64707E" metalness={0.34} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.72, 0.04, 0.04]} />
        <meshStandardMaterial color="#7D8794" />
      </mesh>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.29, 0]} rotation={[0, 0, x > 0 ? -0.35 : 0.35]}>
          <boxGeometry args={[0.04, 0.54, 0.04]} />
          <meshStandardMaterial color="#7D8794" />
        </mesh>
      ))}
      <Html position={[-0.18, 0.82, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none sm:block">
        <MetricPill tone="cyan" label="Grid" value="ready" />
      </Html>
    </group>
  );
}

function FlowParticle({ curve, offset, color }: { curve: CatmullRomCurve3; offset: number; color: string }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const point = curve.getPointAt((clock.elapsedTime * 0.16 + offset) % 1);
    ref.current?.position.set(point.x, point.y, point.z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 18, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.6} />
    </mesh>
  );
}

function EnergyFlow({ points }: { points: Array<[number, number, number]> }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z))), [points]);
  const offsets = useMemo(() => [0, 0.18, 0.36, 0.54, 0.72, 0.9], []);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.014, 8, false]} />
        <meshBasicMaterial color="#4FD1FF" transparent opacity={0.66} depthWrite={false} />
      </mesh>
      {offsets.map((offset) => (
        <FlowParticle key={offset} curve={curve} offset={offset} color={offset > 0.54 ? '#FFD166' : '#4FD1FF'} />
      ))}
    </group>
  );
}

function OrbitRing({ radius, opacity, color }: { radius: number; opacity: number; color: string }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.45, 1]}>
      <torusGeometry args={[radius, 0.006, 8, 220]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

function EnergySystem() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.055;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.025;
  });

  return (
    <group ref={group} rotation={[0.06, -0.12, 0]} scale={0.78} position={[-0.38, -0.02, 0]}>
      {[1.14, 1.6, 2.08, 2.58, 3.14].map((radius, index) => (
        <OrbitRing key={radius} radius={radius} opacity={0.11 - index * 0.015} color={index % 2 ? '#FF9F43' : '#4FD1FF'} />
      ))}
      <Float speed={1.05} rotationIntensity={0.045} floatIntensity={0.18}>
        <SunRig />
        <RoofDeck />
        <SolarPanel position={[-1.1, -0.52, 0.1]} rotation={0.045} />
        <SolarPanel position={[-0.08, -0.38, 0.02]} rotation={0.025} />
        <SolarPanel position={[0.92, -0.24, -0.1]} rotation={0.01} scale={0.98} />
        <SmartHome />
        <InverterNode />
        <BatteryStack />
        <GridNode />
        <EnergyFlow points={flowPoints} />
      </Float>
    </group>
  );
}

function SolarScene({ isDark }: { isDark: boolean }) {
  return (
    <>
      <fog attach="fog" args={[isDark ? '#111315' : '#DFF6FF', 7, 14]} />
      <ambientLight intensity={isDark ? 0.82 : 0.62} />
      <hemisphereLight color="#F5F7FA" groundColor={isDark ? '#1F2630' : '#DFF6FF'} intensity={isDark ? 1.22 : 1.55} />
      <directionalLight position={[-3.6, 4.4, 2.4]} color="#FFD166" intensity={2.9} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[2.6, 1.2, 1.7]} color="#4FD1FF" intensity={1.2} distance={5.6} />
      <pointLight position={[-2.2, 1.7, 2.4]} color="#FF9F43" intensity={0.85} distance={5.2} />
      <EnergySystem />
      <ContactShadows position={[0.15, -1.18, 0]} opacity={isDark ? 0.42 : 0.32} scale={6.2} blur={2.8} far={3.6} color={isDark ? '#07090C' : '#14532d'} />
      <Html position={[1.28, 1.35, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none md:block">
        <MetricCard label="Projected" value="5.8 kWp" detail="hybrid-ready" />
      </Html>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.42} minPolarAngle={0.95} maxPolarAngle={1.72} />
    </>
  );
}

export function HeroVisual() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mouseX = useMotionValue(62);
  const mouseY = useMotionValue(42);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 24, mass: 0.3 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 24, mass: 0.3 });
  const spotlight = useMotionTemplate`radial-gradient(circle at ${smoothX}% ${smoothY}%, rgba(79,209,255,0.24), rgba(255,159,67,0.10) 28%, transparent 54%)`;
  const chips = [
    ['5.8 kWp', SunMedium],
    ['Hybrid', Home],
    ['8 kWh', BatteryCharging],
    ['92%', ShieldCheck]
  ] as const;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      className="projection-shell relative min-h-[430px] overflow-visible sm:min-h-[560px]"
    >
      <div aria-hidden="true" className="absolute inset-[-14%] rounded-[2rem] bg-[radial-gradient(circle_at_50%_52%,rgba(79,209,255,0.18),rgba(255,159,67,0.10)_38%,transparent_72%)] blur-2xl" />
      <motion.div aria-hidden="true" className="absolute inset-[-4%] rounded-[2rem] opacity-80 blur-xl" style={{ background: spotlight }} />
      <div aria-hidden="true" className="absolute inset-x-[8%] bottom-8 h-20 rounded-full bg-[#4FD1FF]/14 blur-3xl" />

      <div className="absolute inset-x-3 top-3 z-10 flex flex-wrap gap-2 sm:inset-x-5 sm:top-5">
        {chips.map(([label, Icon]) => (
          <div key={String(label)} className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-[#181B1F]/62 px-3 py-2 text-xs font-bold text-[#F5F7FA] shadow-[0_0_28px_rgba(79,209,255,.14)] backdrop-blur-xl">
            <Icon size={14} className="text-[#FFD166]" />
            {label}
          </div>
        ))}
      </div>

      <div className="relative h-[430px] w-full sm:h-[560px] lg:h-[620px]">
        <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-[#AAB3C2]">Loading 3D energy model...</div>}>
          <Canvas camera={{ position: [0.1, 0.8, 5.75], fov: 44 }} dpr={[1, 1.75]} shadows gl={{ antialias: true, alpha: true }}>
            <SolarScene isDark={isDark} />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/12 bg-[#181B1F]/68 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#4FD1FF]">
              <Orbit size={14} />
              Energy flow
            </div>
            <p className="mt-1 text-sm leading-5 text-[#AAB3C2]">Panels, inverter, battery, home load, and grid status moving through one connected system.</p>
          </div>
          <div className="min-w-40">
            <div className="mb-1 flex justify-between text-[11px] font-bold uppercase text-[#AAB3C2]">
              <span>Day</span>
              <span>Night</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/12">
              <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 0.45, duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-[#FF9F43] via-[#FFD166] to-[#4FD1FF]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
