import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Line } from "@react-three/drei";
import { useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { PageHeader } from "@/components/page-header";
import { GlassCard } from "@/components/glass-card";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/universe")({
  head: () => ({
    meta: [
      { title: "System Universe · OmniTrader" },
      { name: "description", content: "3D neural map of every OmniTrader module — see what's firing, in real time." },
    ],
  }),
  component: UniversePage,
});

type Cluster = "input" | "analysis" | "core" | "risk" | "learning" | "ops";

type Node = {
  id: string;
  label: string;
  cluster: Cluster;
  pos: [number, number, number];
  route?: string;
  desc: string;
};

const CLUSTER_COLOR: Record<Cluster, string> = {
  input:    "#38bdf8", // sky
  analysis: "#f59e0b", // amber
  core:     "#22c55e", // green
  risk:     "#ef4444", // red
  learning: "#a78bfa", // violet
  ops:      "#94a3b8", // slate
};

const CLUSTER_LABEL: Record<Cluster, string> = {
  input: "Input",
  analysis: "Shadow / Analyse",
  core: "Live Core",
  risk: "Risk",
  learning: "Lernen",
  ops: "Operations",
};

// Place nodes in clustered orbits around the origin
const NODES: Node[] = [
  // Input ring
  { id: "data",        label: "Market Data",   cluster: "input",    pos: [-7,  2, -2], desc: "Preise, Candles, Volumen, Regime" },
  { id: "signal",      label: "Signal Engine", cluster: "input",    pos: [-8, -1,  1], desc: "SMC_TJR, TREND_RSI, Strategie-Signale" },
  { id: "memory",      label: "Memory",        cluster: "input",    pos: [-6, -3, -3], route: "/memory", desc: "Insights & Knowledge Graph" },

  // Analysis (shadow) cluster
  { id: "xgb",         label: "XGBoost",       cluster: "analysis", pos: [-2,  4,  2], desc: "Quality Buckets" },
  { id: "candlesight", label: "CandleSight",   cluster: "analysis", pos: [-3,  1,  4], route: "/candlesight", desc: "Exit-Druck & Wick-Pressure" },
  { id: "arena",       label: "Battle Arena",  cluster: "analysis", pos: [-1,  3, -3], route: "/arena",       desc: "13 Bots stimmen ab" },
  { id: "hermes",      label: "Hermes",        cluster: "analysis", pos: [-2, -2,  3], route: "/hermes",      desc: "Risk-Off Sensor" },
  { id: "treatment",   label: "Treatment",     cluster: "analysis", pos: [-4,  3,  0], route: "/treatment",   desc: "Trade-Diagnose" },
  { id: "mfe0",        label: "MFE0Guard",     cluster: "analysis", pos: [-2, -4, -1], desc: "Never-positive Trades" },
  { id: "runner",      label: "RunnerScout",   cluster: "analysis", pos: [-1, -1,  5], desc: "Continuation Scanner" },

  // Core (live)
  { id: "core",        label: "Decision Core", cluster: "core",     pos: [ 2,  1,  0], desc: "BUY / SELL / HOLD / BLOCKED" },
  { id: "position",    label: "Position Mgr.", cluster: "core",     pos: [ 4,  2,  2], route: "/trades", desc: "Live Positionen, PnL, R" },
  { id: "exit",        label: "Exit Quality",  cluster: "core",     pos: [ 5, -1, -1], desc: "Peak, Retained Profit, Grade" },
  { id: "chart",       label: "Live Chart",    cluster: "core",     pos: [ 3, -2,  3], route: "/chart", desc: "Manual Trading View" },

  // Risk
  { id: "risk",        label: "Risk Engine",   cluster: "risk",     pos: [ 1, -4,  0], route: "/risk", desc: "Drawdown, Limits, Flags" },
  { id: "operator",    label: "Operator",      cluster: "risk",     pos: [ 4, -4,  1], route: "/operator", desc: "Safety Checks" },

  // Learning
  { id: "governor",    label: "Governor",      cluster: "learning", pos: [ 7,  3, -1], route: "/governor", desc: "Nightly Proposals" },
  { id: "reports",     label: "Reports",       cluster: "learning", pos: [ 8,  0,  2], route: "/reports", desc: "Treatment & Payoff" },
  { id: "mirofish",    label: "MiroFish AI",   cluster: "learning", pos: [ 8, -3, -2], route: "/mirofish", desc: "AI Review Center" },

  // Ops
  { id: "pulse",       label: "Live Pulse",    cluster: "ops",      pos: [ 0,  5, -4], route: "/pulse", desc: "Event Stream" },
  { id: "agents",      label: "Agent Room",    cluster: "ops",      pos: [ 0, -5,  4], route: "/agents", desc: "Live Agents" },
  { id: "console",     label: "Op Console",    cluster: "ops",      pos: [ 6,  4,  3], route: "/console", desc: "CLI Read-only" },
  { id: "sql",         label: "SQL Audit",     cluster: "ops",      pos: [ 6, -2, -4], route: "/sql-audit", desc: "DB Explorer" },
];

const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

// Synaptic connections — directed flow of information
const EDGES: Array<[string, string]> = [
  ["data", "signal"], ["signal", "xgb"], ["signal", "core"],
  ["data", "candlesight"], ["data", "hermes"], ["data", "runner"],
  ["xgb", "treatment"], ["candlesight", "treatment"], ["arena", "treatment"],
  ["treatment", "core"], ["mfe0", "core"], ["hermes", "core"], ["runner", "core"],
  ["core", "position"], ["position", "exit"], ["position", "risk"],
  ["risk", "operator"], ["operator", "core"],
  ["position", "memory"], ["exit", "memory"], ["memory", "xgb"],
  ["exit", "governor"], ["memory", "governor"], ["governor", "reports"],
  ["reports", "mirofish"], ["mirofish", "memory"],
  ["core", "pulse"], ["risk", "pulse"], ["governor", "pulse"],
  ["agents", "core"], ["console", "core"], ["sql", "memory"],
  ["chart", "core"],
];

function NodeSphere({
  node,
  active,
  hovered,
  onHover,
  onClick,
}: {
  node: Node;
  active: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = CLUSTER_COLOR[node.cluster];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = active ? 1 + Math.sin(t * 6) * 0.25 : 1 + Math.sin(t * 1.5 + node.pos[0]) * 0.05;
    if (ref.current) ref.current.scale.setScalar(pulse);
    if (glowRef.current) {
      const g = active ? 1.8 + Math.sin(t * 6) * 0.4 : 1.3;
      glowRef.current.scale.setScalar(g);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = active ? 0.35 : 0.12;
    }
  });

  return (
    <group position={node.pos}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {/* Core node */}
      <mesh
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); onHover(node.id); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 2.2 : 0.6}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Label */}
      <Html
        center
        distanceFactor={10}
        position={[0, 0.75, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontSize: hovered || active ? 12 : 10,
            color: hovered || active ? "#ffffff" : "rgba(255,255,255,0.65)",
            fontWeight: hovered || active ? 600 : 500,
            whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            letterSpacing: 0.3,
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  );
}

function Synapse({
  from, to, fireAt, color,
}: { from: [number, number, number]; to: [number, number, number]; fireAt: number; color: string }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const points = useMemo(() => [new THREE.Vector3(...from), new THREE.Vector3(...to)], [from, to]);
  const dir = useMemo(() => new THREE.Vector3().subVectors(points[1], points[0]), [points]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const since = t - fireAt;
    const firing = since >= 0 && since < 1.2;
    const progress = firing ? since / 1.2 : -1;

    if (pulseRef.current) {
      if (firing) {
        pulseRef.current.visible = true;
        const p = new THREE.Vector3().copy(points[0]).addScaledVector(dir, progress);
        pulseRef.current.position.copy(p);
        const fade = Math.sin(progress * Math.PI);
        pulseRef.current.scale.setScalar(0.08 + fade * 0.18);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = fade;
      } else {
        pulseRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      <Line points={points} color={color} opacity={0.18} transparent lineWidth={1} />
      <mesh ref={pulseRef} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={lineRef} visible={false}>
        <sphereGeometry args={[0.01]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

function Brain({
  onHover, onSelect, hoveredId, activeIds,
}: {
  onHover: (id: string | null) => void;
  onSelect: (n: Node) => void;
  hoveredId: string | null;
  activeIds: Set<string>;
}) {
  // schedule firing times for each edge — staggered loop
  const fireSchedule = useRef<number[]>(EDGES.map(() => Math.random() * 6));
  const { clock } = useThree((s) => ({ clock: s.clock }));

  useFrame(() => {
    const t = clock.getElapsedTime();
    fireSchedule.current = fireSchedule.current.map((next) => {
      if (t - next > 1.2) return next + 2 + Math.random() * 5;
      return next;
    });
  });

  return (
    <group>
      {EDGES.map(([a, b], i) => {
        const na = NODE_MAP[a], nb = NODE_MAP[b];
        if (!na || !nb) return null;
        const color = CLUSTER_COLOR[na.cluster];
        return (
          <Synapse key={`${a}-${b}`} from={na.pos} to={nb.pos} fireAt={fireSchedule.current[i]} color={color} />
        );
      })}
      {NODES.map((n) => (
        <NodeSphere
          key={n.id}
          node={n}
          active={activeIds.has(n.id)}
          hovered={hoveredId === n.id}
          onHover={onHover}
          onClick={() => onSelect(n)}
        />
      ))}
    </group>
  );
}

function ActivityDriver({ setActiveIds }: { setActiveIds: (s: Set<string>) => void }) {
  const last = useRef(0);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (t - last.current > 0.6) {
      last.current = t;
      const count = 3 + Math.floor(Math.random() * 4);
      const picked = new Set<string>();
      for (let i = 0; i < count; i++) {
        picked.add(NODES[Math.floor(Math.random() * NODES.length)].id);
      }
      setActiveIds(picked);
    }
  });
  return null;
}

function UniversePage() {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Node | null>(null);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const hovered = hoveredId ? NODE_MAP[hoveredId] : null;

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <PageHeader
        title="System Universe"
        subtitle="3D Neuralmap des OmniTrader-Systems — Knoten feuern wie Synapsen, sobald ein Modul arbeitet."
        status="ONLINE"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <GlassCard className="relative h-[640px] p-0 overflow-hidden">
          <Canvas
            camera={{ position: [0, 2, 18], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <color attach="background" args={["#070712"]} />
            <fog attach="fog" args={["#070712", 18, 42]} />
            <ambientLight intensity={0.35} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#a78bfa" />
            <pointLight position={[-10, -5, -10]} intensity={0.8} color="#38bdf8" />
            <Suspense fallback={null}>
              <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={0.4} />
              <Brain
                onHover={setHoveredId}
                onSelect={setSelected}
                hoveredId={hoveredId}
                activeIds={activeIds}
              />
              <ActivityDriver setActiveIds={setActiveIds} />
            </Suspense>
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              autoRotate
              autoRotateSpeed={0.4}
              minDistance={8}
              maxDistance={32}
            />
          </Canvas>

          {/* HUD overlay */}
          <div className="pointer-events-none absolute left-4 top-4 space-y-1.5">
            {(Object.keys(CLUSTER_LABEL) as Cluster[]).map((c) => (
              <div key={c} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: CLUSTER_COLOR[c], color: CLUSTER_COLOR[c] }} />
                {CLUSTER_LABEL[c]}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute right-4 top-4 text-right text-[10px] uppercase tracking-wider text-muted-foreground">
            <div>Drag · Rotate</div>
            <div>Scroll · Zoom</div>
            <div>Click · Open module</div>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success anim-pulse-soft" />
              {activeIds.size} Knoten feuern
            </span>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Inspector</div>
            {selected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{selected.label}</h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: `${CLUSTER_COLOR[selected.cluster]}22`,
                      color: CLUSTER_COLOR[selected.cluster],
                    }}
                  >
                    {CLUSTER_LABEL[selected.cluster]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selected.desc}</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <StatusBadge tone={activeIds.has(selected.id) ? "success" : "muted"}>
                    {activeIds.has(selected.id) ? "firing" : "idle"}
                  </StatusBadge>
                  <StatusBadge tone="muted">
                    {EDGES.filter(([a, b]) => a === selected.id || b === selected.id).length} synapses
                  </StatusBadge>
                </div>
                {selected.route && (
                  <button
                    onClick={() => navigate({ to: selected.route! })}
                    className="w-full rounded-lg bg-[var(--gradient-primary)] px-3 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow-primary)] hover:opacity-95"
                  >
                    Modul öffnen →
                  </button>
                )}
              </div>
            ) : hovered ? (
              <div className="space-y-2">
                <h3 className="text-base font-semibold">{hovered.label}</h3>
                <p className="text-xs text-muted-foreground">{hovered.desc}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Klick für Details</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Hover über einen Knoten um das Modul zu sehen, oder klicke ihn an um zu navigieren.
              </p>
            )}
          </GlassCard>

          <GlassCard>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Live Activity</div>
            <ul className="space-y-1.5 text-xs">
              {NODES.filter((n) => activeIds.has(n.id)).slice(0, 8).map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full anim-pulse-soft" style={{ background: CLUSTER_COLOR[n.cluster] }} />
                  <span className="text-foreground">{n.label}</span>
                  <span className="ml-auto text-muted-foreground">{CLUSTER_LABEL[n.cluster]}</span>
                </li>
              ))}
              {activeIds.size === 0 && (
                <li className="text-muted-foreground">Warte auf nächsten Puls…</li>
              )}
            </ul>
          </GlassCard>

          <GlassCard className="text-[11px] text-muted-foreground">
            <p>
              Das Universum spiegelt jedes Modul des Systems. Synapsen-Pulse zeigen den
              Datenfluss zwischen Knoten — von <span className="text-foreground">Market Data</span> bis hin zu
              <span className="text-foreground"> MiroFish</span>. Read-only Ansicht.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
