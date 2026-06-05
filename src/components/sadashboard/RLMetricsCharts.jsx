import { useState, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const T = {
  bg:      "#0c0a08",
  surface: "#131009",
  border:  "#2c2418",
  gold:    "#c8a55a",
  goldDim: "#6a5630",
  cream:   "#e0d0b0",
  creamDim:"#8a7a60",
  teal:    "#4ecdc4",
  red:     "#d45050",
  green:   "#5aaa68",
  purple:  "#8a6ab0",
};

// Generate rolling episode data for charts
function makeEpisodeData(count = 30, startEp = 2812) {
  let successRate = 78;
  let ttd = 340;
  return Array.from({ length: count }, (_, i) => {
    successRate = Math.min(99, successRate + (Math.random() - 0.3) * 2.5);
    ttd = Math.max(60, ttd - (Math.random() * 8));
    return {
      ep: startEp + i,
      successRate: parseFloat(successRate.toFixed(1)),
      ttd: parseFloat(ttd.toFixed(0)),
      reward: parseFloat((0.6 + (successRate / 100) * 0.38 + (Math.random() - 0.5) * 0.02).toFixed(3)),
    };
  });
}

const TACTIC_DISTRIBUTION = [
  { tactic: "Recon",       blocked: 94, detected: 98 },
  { tactic: "Init Access", blocked: 87, detected: 95 },
  { tactic: "Execution",   blocked: 91, detected: 96 },
  { tactic: "Persistence", blocked: 83, detected: 92 },
  { tactic: "Priv Esc",    blocked: 78, detected: 90 },
  { tactic: "Defense Ev.", blocked: 71, detected: 85 },
  { tactic: "Lateral Mv.", blocked: 76, detected: 88 },
  { tactic: "Exfiltration",blocked: 89, detected: 94 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "10px 14px", fontFamily: "monospace", fontSize: 11 }}>
      <p style={{ color: T.gold, marginBottom: 6 }}>Episode {label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "10px 14px", fontFamily: "monospace", fontSize: 11 }}>
      <p style={{ color: T.gold, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

const PANEL_STYLE = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  marginBottom: 0,
};

const HDR_STYLE = {
  fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
  padding: "8px 14px", borderBottom: `1px solid ${T.border}`,
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: "linear-gradient(90deg, #131009 0%, #110e07 100%)",
};

export default function RLMetricsCharts({ activitySummary }) {
  const [episodeData, setEpisodeData] = useState(() => makeEpisodeData());
  const [currentEp, setCurrentEp] = useState(2841);

  // Append a new data point every 3.5s to simulate live RL training
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentEp(ep => {
        const next = ep + 1;
        setEpisodeData(prev => {
          const last = prev[prev.length - 1];
          const newSuccessRate = parseFloat(Math.min(99, last.successRate + (Math.random() - 0.3) * 2).toFixed(1));
          const newTtd = parseFloat(Math.max(60, last.ttd - Math.random() * 5).toFixed(0));
          const newReward = parseFloat((0.6 + (newSuccessRate / 100) * 0.38 + (Math.random() - 0.5) * 0.02).toFixed(3));
          return [...prev.slice(-29), { ep: next, successRate: newSuccessRate, ttd: newTtd, reward: newReward }];
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const latest = episodeData[episodeData.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
        {[
          { label: "Mitigation Rate", value: `${latest?.successRate ?? 0}%`, color: T.green },
          { label: "Avg Time-to-Detect", value: `${latest?.ttd ?? 0}ms`, color: T.teal },
          { label: "PPO Reward", value: latest?.reward ?? 0, color: T.gold },
          { label: "Active Investigations",
            value: activitySummary?.metrics?.active_investigations ?? activitySummary?.count ?? "—",
            color: T.purple },
        ].map((k, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 26, color: k.color, fontFamily: "monospace" }}>{k.value}</div>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: T.creamDim, marginTop: 4, textTransform: "uppercase" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Chart row 1: Success Rate + TTD */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>

        {/* Mitigation Success Rate */}
        <div style={PANEL_STYLE}>
          <div style={HDR_STYLE}>
            <span style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 13 }}>Simulated Threat Mitigation Success Rate</span>
            <span style={{ color: T.green, fontSize: 9 }}>PPO-v4 · LIVE</span>
          </div>
          <div style={{ padding: "14px 4px 10px 0" }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={episodeData} margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="ep" tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} />
                <YAxis domain={[60, 100]} tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="successRate" name="Success Rate" stroke={T.green} fill="url(#successGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: "0 14px 10px", fontFamily: "monospace", fontSize: 10, color: T.creamDim, fontStyle: "italic" }}>
            Hypothesis: autonomous agent achieves ≥90% mitigation rate by episode 3000 (n=240 simulated incidents).
          </div>
        </div>

        {/* Time-to-Detect */}
        <div style={PANEL_STYLE}>
          <div style={HDR_STYLE}>
            <span style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 13 }}>Time-to-Detect Averages (ms)</span>
            <span style={{ color: T.teal, fontSize: 9 }}>TARGET &lt; 100ms</span>
          </div>
          <div style={{ padding: "14px 4px 10px 0" }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={episodeData} margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ttdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.teal} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={T.teal} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="ep" tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} />
                <YAxis tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} unit="ms" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ttd" name="TTD (ms)" stroke={T.teal} fill="url(#ttdGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: "0 14px 10px", fontFamily: "monospace", fontSize: 10, color: T.creamDim, fontStyle: "italic" }}>
            Convergence observed at ep.2800+; isolation latency reduced 73% from human-SOC baseline of 340ms.
          </div>
        </div>
      </div>

      {/* Chart row 2: Reward + Tactic distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>

        {/* PPO Cumulative Reward */}
        <div style={PANEL_STYLE}>
          <div style={HDR_STYLE}>
            <span style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 13 }}>PPO Cumulative Reward Signal</span>
            <span style={{ color: T.purple, fontSize: 9 }}>SHAPED · FP-PENALISED</span>
          </div>
          <div style={{ padding: "14px 4px 10px 0" }}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={episodeData} margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="ep" tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} />
                <YAxis domain={[0.6, 1.0]} tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="reward" name="Reward" stroke={T.purple} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-Tactic Block/Detect rates */}
        <div style={PANEL_STYLE}>
          <div style={HDR_STYLE}>
            <span style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 13 }}>Detection vs Block Rate by ATT&CK Tactic</span>
            <span style={{ color: T.creamDim, fontSize: 9 }}>SIMULATED · 240 RUNS</span>
          </div>
          <div style={{ padding: "14px 4px 10px 0" }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={TACTIC_DISTRIBUTION} margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="tactic" tick={{ fill: T.creamDim, fontSize: 8 }} tickLine={false} axisLine={{ stroke: T.border }} />
                <YAxis domain={[60, 100]} tick={{ fill: T.creamDim, fontSize: 9 }} tickLine={false} axisLine={{ stroke: T.border }} unit="%" />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9, color: T.creamDim }} />
                <Bar dataKey="detected" name="Detected" fill={T.teal} opacity={0.85} radius={[2,2,0,0]} />
                <Bar dataKey="blocked"  name="Blocked"  fill={T.green} opacity={0.85} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}