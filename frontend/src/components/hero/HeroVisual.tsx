import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Html, OrbitControls } from '@react-three/drei';
import { BatteryCharging, Home, Orbit, ShieldCheck, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { Suspense, useMemo, useRef } from 'react';
import { AdditiveBlending, BackSide, CatmullRomCurve3, DoubleSide, type Group, type Mesh, Vector3 } from 'three';

const panelCells = Array.from({ length: 24 }, (_, index) => ({
  column: index % 6,
  row: Math.floor(index / 6)
}));

const flowPoints = [
  [-1.9, 0.22, 0.04],
  [-0.72, 0.1, 0.08],
  [0.62, -0.12, 0.04],
  [1.72, -0.2, 0.02],
  [2.72, -0.02, -0.08]
] as Array<[number, number, number]>;

const htmlZIndexRange: [number, number] = [20, 0];

function SunRig() {
  const sun = useRef<Mesh>(null);
  const rays = useRef<Group>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (sun.current) sun.current.rotation.y = time * 0.35;
    if (rays.current) rays.current.rotation.z = Math.sin(time * 0.6) * 0.04;
  });

  return (
    <group position={[-2.55, 1.72, -0.76]}>
      <pointLight color="#fde68a" intensity={16} distance={8} />
      <mesh ref={sun}>
        <sphereGeometry args={[0.42, 64, 64]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={2.8} roughness={0.18} />
      </mesh>
      {[0.72, 1.02, 1.36].map((radius, index) => (
        <mesh key={radius}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial
            color={index === 0 ? '#facc15' : '#38bdf8'}
            side={BackSide}
            transparent
            opacity={[0.18, 0.08, 0.035][index]}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <group ref={rays}>
        {[-0.42, -0.18, 0.06, 0.3].map((offset, index) => (
          <mesh key={offset} position={[0.78 + index * 0.18, -0.66 + offset, 0.06]} rotation={[0.1, 0, -0.44]}>
            <planeGeometry args={[2.35, 0.16]} />
            <meshBasicMaterial color="#fde68a" transparent opacity={0.16} depthWrite={false} side={DoubleSide} blending={AdditiveBlending} />
          </mesh>
        ))}
      </group>
      <Html position={[0.04, 0.58, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none select-none">
        <MetricPill tone="amber" label="Sun" value="5.4h" />
      </Html>
    </group>
  );
}

function PanelTile({ x, z, index }: { x: number; z: number; index: number }) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = Math.sin(clock.elapsedTime * 2.1 + index * 0.36) * 0.5 + 0.5;
      ref.current.scale.y = 1 + pulse * 0.22;
    }
  });

  return (
    <mesh ref={ref} position={[x, 0.085, z]} castShadow>
      <boxGeometry args={[0.23, 0.018, 0.18]} />
      <meshStandardMaterial color={index % 2 ? '#0b3b68' : '#0a2a4d'} metalness={0.42} roughness={0.18} emissive="#0ea5e9" emissiveIntensity={0.18} />
    </mesh>
  );
}

function SolarPanel({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  return (
    <group position={position} rotation={[0.5, rotation, -0.17]} scale={scale}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.08]} />
        <meshStandardMaterial color="#07111f" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[1.66, 0.022, 0.92]} />
        <meshStandardMaterial color="#06162a" metalness={0.32} roughness={0.16} emissive="#0ea5e9" emissiveIntensity={0.12} />
      </mesh>
      {panelCells.map(({ column, row }, index) => (
        <PanelTile key={`${column}-${row}`} x={(column - 2.5) * 0.26} z={(row - 1.5) * 0.215} index={index} />
      ))}
      {[-0.65, -0.39, -0.13, 0.13, 0.39, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.105, 0]}>
          <boxGeometry args={[0.014, 0.014, 0.9]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {[-0.33, -0.11, 0.11, 0.33].map((z) => (
        <mesh key={z} position={[0, 0.108, z]}>
          <boxGeometry args={[1.64, 0.012, 0.012]} />
          <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.55} />
        </mesh>
      ))}
      <mesh position={[0, -0.18, 0.38]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.48, 0.05, 0.08]} />
        <meshStandardMaterial color="#d8dee9" metalness={0.7} roughness={0.24} />
      </mesh>
    </group>
  );
}

function RoofDeck() {
  return (
    <group position={[-0.2, -0.86, 0.08]} rotation={[0, -0.03, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[3.6, 0.16, 1.62]} />
        <meshStandardMaterial color="#182230" roughness={0.72} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={index} position={[-1.68 + index * 0.34, 0.095, 0]}>
          <boxGeometry args={[0.014, 0.03, 1.58]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, -0.83]}>
        <boxGeometry args={[3.68, 0.1, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function SmartHome() {
  return (
    <group position={[-3.04, -0.62, 0.34]} rotation={[0, 0.16, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.54, 0.68]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.7, 0.52, 4]} />
        <meshStandardMaterial color="#0f3b63" roughness={0.36} />
      </mesh>
      {[[-0.24, 0.03], [0.08, 0.03], [-0.24, -0.16]].map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, 0.35]}>
          <boxGeometry args={[0.16, 0.14, 0.026]} />
          <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <mesh position={[0.25, -0.11, 0.35]}>
        <boxGeometry args={[0.17, 0.32, 0.028]} />
        <meshStandardMaterial color="#92400e" roughness={0.46} />
      </mesh>
    </group>
  );
}

function BatteryStack() {
  const charge = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (charge.current) {
      const level = 0.72 + Math.sin(clock.elapsedTime * 1.4) * 0.08;
      charge.current.scale.y = level;
      charge.current.position.y = -0.17 + level * 0.18;
    }
  });

  return (
    <group position={[2.55, -0.35, 0.08]} rotation={[0.03, -0.08, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.58, 1.36, 0.5]} />
        <meshStandardMaterial color="#07111f" metalness={0.32} roughness={0.32} emissive="#0f766e" emissiveIntensity={0.18} />
      </mesh>
      <mesh ref={charge} position={[0, 0.05, 0.262]}>
        <boxGeometry args={[0.4, 0.72, 0.028]} />
        <meshStandardMaterial color="#35e58b" emissive="#35e58b" emissiveIntensity={1.35} />
      </mesh>
      {[-0.44, 0, 0.44].map((y) => (
        <mesh key={y} position={[0, y, 0.292]}>
          <boxGeometry args={[0.34, 0.014, 0.02]} />
          <meshStandardMaterial color="#dcfce7" emissive="#35e58b" emissiveIntensity={0.75} />
        </mesh>
      ))}
      <Html position={[0.08, 0.88, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none sm:block">
        <MetricPill tone="green" label="Battery" value="8 kWh" />
      </Html>
    </group>
  );
}

function InverterNode() {
  return (
    <group position={[1.2, -0.58, 0.18]} rotation={[0.02, -0.22, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.54, 0.28]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.06, 0.154]}>
        <boxGeometry args={[0.28, 0.08, 0.024]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, -0.1, 0.154]}>
        <boxGeometry args={[0.28, 0.08, 0.024]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function GridTower() {
  return (
    <group position={[3.28, -0.5, -0.18]} rotation={[0, -0.18, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.045, 1.3, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.34} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.72, 0.04, 0.04]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.29, 0]} rotation={[0, 0, x > 0 ? -0.35 : 0.35]}>
          <boxGeometry args={[0.04, 0.54, 0.04]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
      <Html position={[-0.18, 0.82, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none sm:block">
        <MetricPill tone="sky" label="Grid" value="ready" />
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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
    </mesh>
  );
}

function EnergyFlow({ points, color = '#35e58b' }: { points: Array<[number, number, number]>; color?: string }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z))), [points]);
  const offsets = useMemo(() => [0, 0.18, 0.36, 0.54, 0.72, 0.9], []);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.014, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} />
      </mesh>
      {offsets.map((offset) => (
        <FlowParticle key={offset} curve={curve} offset={offset} color={offset > 0.54 ? '#fde68a' : color} />
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

function ProjectionScene() {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.055;
      group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.025;
    }
  });

  return (
    <group ref={group} rotation={[0.06, -0.12, 0]} scale={0.86} position={[-0.28, -0.02, 0]}>
      {[1.14, 1.6, 2.08, 2.58, 3.14].map((radius, index) => (
        <OrbitRing key={radius} radius={radius} opacity={0.11 - index * 0.015} color={index % 2 ? '#22c55e' : '#38bdf8'} />
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
        <GridTower />
        <EnergyFlow points={flowPoints} />
      </Float>
    </group>
  );
}

function SolarScene() {
  return (
    <>
      <color attach="background" args={['#dff6ff']} />
      <fog attach="fog" args={['#dff6ff', 7, 14]} />
      <ambientLight intensity={0.62} />
      <hemisphereLight color="#f8fafc" groundColor="#bbf7d0" intensity={1.55} />
      <directionalLight position={[-3.6, 4.4, 2.4]} intensity={2.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[2.6, 1.2, 1.7]} color="#38bdf8" intensity={1.05} distance={5.6} />
      <ProjectionScene />
      <ContactShadows position={[0.15, -1.18, 0]} opacity={0.32} scale={6.2} blur={2.8} far={3.6} color="#14532d" />
      <Html position={[-2.16, 2.18, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none sm:block">
        <MetricCard label="Solar map" value="BG zones" detail="irradiance model" />
      </Html>
      <Html position={[1.28, 1.35, 0]} center zIndexRange={htmlZIndexRange} className="pointer-events-none hidden select-none md:block">
        <MetricCard label="Projected" value="5.8 kWp" detail="hybrid-ready" />
      </Html>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.42} minPolarAngle={0.95} maxPolarAngle={1.72} />
    </>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: 'amber' | 'green' | 'sky' }) {
  const toneClass = {
    amber: 'border-amber-200/70 bg-amber-50/85 text-amber-800',
    green: 'border-emerald-200/70 bg-emerald-50/85 text-emerald-800',
    sky: 'border-sky-200/70 bg-sky-50/85 text-sky-800'
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-black uppercase shadow-sm backdrop-blur-md ${toneClass}`}>
      <span>{label}</span>
      <span className="opacity-70">{value}</span>
    </span>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="w-40 rounded-lg border border-white/15 bg-slate-950/62 px-3 py-2 text-left text-white shadow-2xl backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase text-sky-200">{label}</div>
      <div className="text-base font-black">{value}</div>
      <div className="text-[11px] font-semibold text-slate-300">{detail}</div>
    </div>
  );
}

export function HeroVisual() {
  const chips = [
    ['5.8 kWp', SunMedium],
    ['Hybrid', Home],
    ['8 kWh', BatteryCharging],
    ['92%', ShieldCheck]
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
      className="projection-shell relative min-h-[380px] overflow-hidden rounded-2xl border border-white/70 bg-sky-100 shadow-[0_24px_80px_rgba(14,165,233,0.22)] sm:min-h-[500px]"
    >
      <div className="absolute inset-x-3 top-3 z-10 flex flex-wrap gap-2 sm:inset-x-4 sm:top-4">
        {chips.map(([label, Icon]) => (
          <div key={String(label)} className="inline-flex items-center gap-2 rounded-lg border border-white/18 bg-slate-950/58 px-3 py-2 text-xs font-bold text-white shadow-[0_0_28px_rgba(56,189,248,.14)] backdrop-blur-xl">
            <Icon size={14} className="text-emerald-300" />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(240,249,255,.64),rgba(240,253,244,.24)_58%,rgba(20,83,45,.16)),linear-gradient(110deg,rgba(245,158,11,.20),transparent_32%,rgba(14,165,233,.16)_68%,transparent)]" />
      <div className="h-[380px] w-full sm:h-[500px] lg:h-[540px]">
        <Suspense fallback={<div className="grid h-full place-items-center text-sm font-semibold text-slate-600">Зареждаме 3D визуализация...</div>}>
          <Canvas camera={{ position: [0.1, 0.8, 5.75], fov: 44 }} dpr={[1, 1.75]} shadows gl={{ antialias: true, alpha: false }}>
            <SolarScene />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/16 bg-slate-950/66 p-3 shadow-2xl backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-sky-200">
              <Orbit size={14} />
              Energy flow
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-300">Покрив, панели, батерия и мрежа в един работещ сценарий.</p>
          </div>
          <div className="min-w-40">
            <div className="mb-1 flex justify-between text-[11px] font-bold uppercase text-slate-400">
              <span>Day</span>
              <span>Night</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/12">
              <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 0.45, duration: 0.9 }} className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-sky-300 to-amber-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
