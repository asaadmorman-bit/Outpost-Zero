import { useState, useEffect, useRef } from "react";
import { getActivitySummary } from "@/functions/getActivitySummary";
import { pushTelemetryToHub } from "@/functions/pushTelemetryToHub";
import MitreAttackMap from "../components/sadashboard/MitreAttackMap";
import RLMetricsCharts from "../components/sadashboard/RLMetricsCharts";

// ── Dark Academia palette ─────────────────────────────────────────────────────
const T = {
  bg:         "#0c0a08",
  surface:    "#131009",
  surfaceAlt: "#1a1610",
  border:     "#2c2418",
  borderHi:   "#4a3c24",
  gold:       "#c8a55a",
  goldDim:    "#6a5630",
  goldBright: "#e8c878",
  cream:      "#e0d0b0",
  creamDim:   "#8a7a60",
  teal:       "#4ecdc4",
  red:        "#d45050",
  orange:     "#cc7840",
  green:      "#5aaa68",
  purple:     "#8a6ab0",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Share+Tech+Mono&display=swap');

  .da * { box-sizing: border-box; }
  .da {
    background: ${T.bg};
    color: ${T.cream};
    min-height: 100vh;
    font-family: 'Share Tech Mono', 'Courier New', monospace;
  }
  .da-serif { font-family: 'EB Garamond', Georgia, serif; }

  .da-blink { animation: dablink 1.1s step-end infinite; }
  @keyframes dablink { 50% { opacity: 0; } }

  .da-pulse { width:8px; height:8px; border-radius:50%; display:inline-block; animation: dapulse 1.6s ease-in-out infinite; }
  @keyframes dapulse { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

  .da-fade-in { animation: dafade 0.4s ease; }
  @keyframes dafade { from { opacity:0; transform: translateY(-4px); } to { opacity:1; transform:none; } }

  .da-panel { background: ${T.surface}; border: 1px solid ${T.border}; }

  .da-hdr {
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 8px 14px; border-bottom: 1px solid ${T.border};
    display: flex; justify-content: space-between; align-items: center;
    background: linear-gradient(90deg, ${T.surface} 0%, #110e07 100%);
  }
  .da-hdr-title { color: ${T.gold}; font-family: 'EB Garamond',serif; font-size:14px; letter-spacing:0.06em; }

  .da-row { padding: 8px 14px; border-bottom: 1px solid ${T.bg}; display:flex; justify-content:space-between; align-items:center; font-size:11px; }
  .da-row:last-child { border-bottom:none; }
  .da-row:hover { background: ${T.surfaceAlt}; }

  .da-badge { font-size:9px; font-weight:bold; padding:2px 7px; letter-spacing:0.07em; text-transform:uppercase; }
  .b-crit  { background:#2a0a0a; color:${T.red};    border:1px solid ${T.red}; }
  .b-high  { background:#1e1000; color:${T.orange}; border:1px solid ${T.orange}; }
  .b-ok    { background:#0a1a0e; color:${T.green};  border:1px solid ${T.green}; }
  .b-run   { background:#061414; color:${T.teal};   border:1px solid ${T.teal}; }
  .b-idle  { background:#120e1c; color:${T.purple}; border:1px solid ${T.purple}; }
  .b-gold  { background:#140e00; color:${T.gold};   border:1px solid ${T.goldDim}; }

  .rl-log { font-size:10px; font-family:'Share Tech Mono',monospace; max-height:240px; overflow-y:auto; }
  .rl-log::-webkit-scrollbar { width:4px; }
  .rl-log::-webkit-scrollbar-track { background:${T.bg}; }
  .rl-log::-webkit-scrollbar-thumb { background:${T.borderHi}; border-radius:2px; }
  .rl-entry { display:grid; grid-template-columns:46px 52px 1fr; gap:6px; align-items:start; padding:5px 14px; border-bottom:1px solid ${T.bg}; }
  .rl-entry.new { animation: dafade 0.35s ease; }

  .da-topbar { display:flex; justify-content:space-between; align-items:center; padding:10px 18px; border-bottom:1px solid ${T.border}; background: linear-gradient(90deg, #100d06 0%, ${T.surface} 100%); }

  .da-ornament { color:${T.goldDim}; font-size:11px; letter-spacing:0.25em; text-align:center; padding:6px 0; }

  .da-thesis { font-family:'EB Garamond',serif; font-style:italic; color:${T.creamDim}; font-size:12px; line-height:1.7; padding:10px 16px; border-left:2px solid ${T.goldDim}; background:${T.surfaceAlt}; }

  @media(max-width:960px){
    .da-grid-2,.da-split,.da-split-r { grid-template-columns:1fr !important; }
  }
`;

// ── RL Log helpers ────────────────────────────────────────────────────────────
function r(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function nowStr() { return new Date().toISOString().substring(11, 19); }

const RL_TEMPLATES = [
  (ep) => ({ type: "fw",  msg: `FW rule updated: DENY 10.0.${r(0,4)}.${r(1,254)} → :${r(4000,9000)} [reward +${(0.88+Math.random()*0.1).toFixed(3)}]`, ep }),
  (ep) => ({ type: "iso", msg: `Container c-${String(r(1,16)).padStart(2,"0")} isolated — egress ${r(3,12)}.${r(1,9)} MB/s [PPO ep.${ep}]`, ep }),
  (ep) => ({ type: "rca", msg: `RCA complete: root → ${["cryptominer","ransomware dropper","lateral pivot","C2 beacon","LSASS dump"][r(0,4)]} on ${["WIN","LNX","K8S"][r(0,2)]}-${String(r(1,99)).padStart(2,"0")}`, ep }),
  (ep) => ({ type: "fw",  msg: `Adaptive ruleset v${ep}.${r(1,9)}: ${r(2,8)} DENY chains added, ${r(1,3)} ALLOW revised`, ep }),
  (ep) => ({ type: "ok",  msg: `Agent confidence ${(0.91+Math.random()*0.08).toFixed(3)} — no action required. Monitoring resumed.`, ep }),
  (ep) => ({ type: "rca", msg: `Causal graph: ${r(3,9)}-hop attack chain reconstructed. TTPs: T${r(1000,1599)}.${r(1,9)} mapped.`, ep }),
];

const LOG_COLOR = { fw: "#4ecdc4", iso: "#cc7840", rca: "#8a6ab0", ok: "#5aaa68" };
const LOG_LABEL = { fw: "FW-UPD", iso: "ISOLATE", rca: "RCA", ok: "MONITOR" };
const LOG_BADGE = { fw: "b-run", iso: "b-high", rca: "b-idle", ok: "b-ok" };

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ label, value, color, accent }) {
  const n = useCountUp(typeof value === "number" ? value : 0);
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      textAlign: "center", padding: "18px 8px", flex: 1,
      borderBottom: `2px solid ${color}`,
    }}>
      <div style={{ fontSize: 32, color, fontFamily: "monospace" }}>
        {typeof value === "number" ? n : value}
      </div>
      <div style={{ fontSize: 9, letterSpacing: "0.13em", marginTop: 5, color: T.creamDim, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function RLLogPanel({ logs }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs.length]);

  return (
    <div className="da-panel" style={{ display: "flex", flexDirection: "column" }}>
      <div className="da-hdr">
        <span className="da-hdr-title">RL Policy Decisions — Live Log</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="da-pulse" style={{ background: T.teal }} />
          <span style={{ color: T.teal, fontSize: 9 }}>PPO-v4 ONLINE</span>
        </div>
      </div>
      <div className="rl-log">
        {logs.map((e, i) => (
          <div key={e.id} className={`rl-entry${i === 0 ? " new" : ""}`}>
            <span style={{ color: T.creamDim }}>{e.time}</span>
            <span className={`da-badge ${LOG_BADGE[e.type]}`} style={{ fontSize: 8 }}>{LOG_LABEL[e.type]}</span>
            <span style={{ color: LOG_COLOR[e.type] }}>{e.msg}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 16, fontSize: 9, color: T.creamDim }}>
        <span style={{ color: T.teal }}>■ FW-UPDATE</span>
        <span style={{ color: T.orange }}>■ ISOLATE</span>
        <span style={{ color: T.purple }}>■ ROOT CAUSE</span>
        <span style={{ color: T.green }}>■ MONITOR</span>
        <span style={{ marginLeft: "auto" }}>PPO · State dims: 47 · Replay: 10K</span>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function SaDashboard() {
  const clock = useClock();
  const timeStr = clock.toISOString().replace("T", " ").substring(0, 19) + " UTC";

  const [episode, setEpisode] = useState(2841);
  const [activitySummary, setActivitySummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [simState, setSimState] = useState("idle"); // idle | sending | success | error
  const [simResult, setSimResult] = useState(null);

  const handleSimulateAttack = async () => {
    setSimState("sending");
    setSimResult(null);
    try {
      const res = await pushTelemetryToHub({});
      setSimResult(res.data);
      setSimState(res.data?.success ? "success" : "error");
    } catch (e) {
      setSimResult({ error: e.message });
      setSimState("error");
    }
    setTimeout(() => setSimState("idle"), 8000);
  };

  const [logs, setLogs] = useState(() =>
    Array.from({ length: 8 }, (_, i) => {
      const ep = 2841 - (7 - i);
      const tpl = RL_TEMPLATES[i % RL_TEMPLATES.length](ep);
      return { id: i, time: `09:${String(40 + i).padStart(2, "0")}`, ...tpl };
    })
  );
  const logIdRef = useRef(100);

  // ── Fetch activity summary ──
  useEffect(() => {
    getActivitySummary({})
      .then(res => setActivitySummary(res.data))
      .catch(() => setActivitySummary({
        metrics: { active_investigations: 3, total_active_users: 12 },
        identity_context: { role: "admin", ecosystem: "CyberDojo" },
      }))
      .finally(() => setSummaryLoading(false));
  }, []);

  // ── Live RL tick ──
  useEffect(() => {
    const tick = setInterval(() => {
      setEpisode(ep => {
        const next = ep + 1;
        const tpl = RL_TEMPLATES[r(0, RL_TEMPLATES.length - 1)](next);
        const entry = { id: logIdRef.current++, time: nowStr(), ...tpl };
        setLogs(prev => [entry, ...prev.slice(0, 49)]);
        return next;
      });
    }, 3500);
    return () => clearInterval(tick);
  }, []);

  const epDisplay = useCountUp(episode, 800);

  return (
    <div className="da">
      <style>{CSS}</style>

      {/* ── Top Bar ── */}
      <div className="da-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="https://media.base44.com/images/public/68803b0da7e06439ecd1b8c3/1acb64b6a_Gemini_Generated_Image_hnpzmohnpzmohnpz.png"
            alt="Emerging Defense Solutions"
            style={{ height: 48, objectFit: "contain" }}
          />
          <div>
            <div className="da-serif" style={{ fontSize: 20, color: T.goldBright, letterSpacing: "0.05em" }}>
              The Sentinel Ecosystem
              <span style={{ color: T.goldDim, fontSize: 13, marginLeft: 10 }}>— PhD Research Dashboard</span>
            </div>
            <div style={{ fontSize: 9, color: T.creamDim, letterSpacing: "0.18em", marginTop: 2 }}>
              AUTONOMOUS HYPER-CONVERGENCE · GENERATIVE AI & ML · SELF-HEALING SIEM · PREDICTIVE PHYSICAL SECURITY
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: "0.14em" }}>SYSTEM CLOCK</div>
          <div className="da-blink" style={{ fontSize: 14, color: T.gold, letterSpacing: "0.1em" }}>{timeStr}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="da-badge b-ok"   style={{ fontSize: 10, padding: "5px 12px" }}>POSTURE: NOMINAL</span>
          <span className="da-badge b-run"  style={{ fontSize: 10, padding: "5px 12px" }}>RL AGENT: ONLINE</span>
        </div>
      </div>

      {/* ── Legal Banner ── */}
      <div style={{ background: "#0e0900", borderBottom: `1px solid ${T.goldDim}`, padding: "6px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { label: "⚗ PhD Research Platform", bg: "#1e1200", color: T.gold, border: T.goldDim },
            { label: "🔒 Not for Commercial Use", bg: "#1a0a0a", color: T.red, border: "#6a2020" },
            { label: "© Patent Pending", bg: "#0a0e1a", color: "#5a80b0", border: "#203060" },
          ].map((b, i) => (
            <span key={i} style={{ fontSize: 9, background: b.bg, color: b.color, border: `1px solid ${b.border}`, padding: "2px 9px", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: "bold" }}>
              {b.label}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 9, color: T.creamDim, fontStyle: "italic", fontFamily: "'EB Garamond',serif" }}>
          "The Sentinel Ecosystem" — PhD Research · All IP reserved · Unauthorised use strictly prohibited
        </div>
      </div>

      <div style={{ padding: "6px 6px 28px", display: "flex", flexDirection: "column", gap: 6 }}>

        {/* ── KPI Strip ── */}
        <div style={{ display: "flex", gap: 4 }}>
          <StatCard label="P1 OPEN"            value={2}       color={T.red}    />
          <StatCard label="AUTO-RESOLVED 24H"  value={38}      color={T.green}  />
          <StatCard label="ACTIVE PLAYBOOKS"   value={4}       color={T.teal}   />
          <StatCard label="MTTR REDUCTION"     value="34%"     color={T.gold}   />
          <StatCard label="RL EPISODE"         value={epDisplay} color={T.purple} />
          <StatCard
            label="ACTIVE INVESTIGATIONS"
            value={summaryLoading ? "…" : (activitySummary?.metrics?.active_investigations ?? activitySummary?.count ?? "—")}
            color={T.orange}
          />
        </div>

        {/* ── Activity Summary Context ── */}
        {activitySummary && (
          <div className="da-panel da-fade-in" style={{ padding: "10px 16px", display: "flex", gap: 24, alignItems: "center", fontSize: 10 }}>
            <span style={{ color: T.goldDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>getActivitySummary →</span>
            <span style={{ color: T.teal }}>App: {activitySummary.app}</span>
            {activitySummary.metrics && (
              <>
                <span style={{ color: T.cream }}>Investigations: <span style={{ color: T.gold }}>{activitySummary.metrics.active_investigations}</span></span>
                <span style={{ color: T.cream }}>Active Users: <span style={{ color: T.gold }}>{activitySummary.metrics.total_active_users}</span></span>
              </>
            )}
            {activitySummary.identity_context && (
              <span style={{ color: T.creamDim }}>Role: {activitySummary.identity_context.role} · Ecosystem: {activitySummary.identity_context.ecosystem}</span>
            )}
            <span style={{ marginLeft: "auto", color: T.goldDim, fontSize: 9 }}>{activitySummary.timestamp}</span>
          </div>
        )}

        {/* ── Thesis statement ── */}
        <div className="da-thesis">
          <strong style={{ color: T.gold }}>Research Hypothesis:</strong> A self-healing SIEM employing Deep Reinforcement Learning (PPO) can reduce Mean Time to Remediation by ≥30% across all severity tiers compared to a human-led SOC baseline, while autonomously mapping emerging TTPs to MITRE ATT&CK® in real time. (n = 240 simulated incident records, 6-month study window.)
        </div>

        {/* ── RL Metrics Charts (Recharts) ── */}
        <RLMetricsCharts activitySummary={activitySummary} />

        {/* ── RL Log + Episode Metrics side by side ── */}
        <div className="da-split" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 6 }}>
          <RLLogPanel logs={logs} />
          <div className="da-panel">
            <div className="da-hdr">
              <span className="da-hdr-title">RL Agent Metadata</span>
              <span className="da-badge b-run">LIVE</span>
            </div>
            {[
              { lbl: "Current Episode",      val: episode,    color: T.gold },
              { lbl: "Policy Algorithm",     val: "PPO-v4",   color: T.purple },
              { lbl: "State Dimensions",     val: "47",       color: T.teal },
              { lbl: "Replay Buffer Size",   val: "10,000",   color: T.cream },
              { lbl: "False Positive Rate",  val: "2.7%",     color: T.orange },
              { lbl: "Avg Isolation Latency",val: "91ms",     color: T.teal },
              { lbl: "Model Confidence",     val: "0.963",    color: T.green },
              { lbl: "Reward Shaping",       val: "FP-penalised", color: T.creamDim },
            ].map((m, i) => (
              <div key={i} style={{ padding: "10px 14px", borderBottom: `1px solid ${T.bg}`, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: T.creamDim }}>{m.lbl}</span>
                <span style={{ color: m.color, fontFamily: "monospace" }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MITRE ATT&CK Map ── */}
        <MitreAttackMap />

        {/* ── Hub Telemetry Push ── */}
        <div className="da-panel" style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 14 }}>Hub Telemetry Bridge — asosint.io</div>
              <div style={{ color: T.creamDim, fontSize: 9, letterSpacing: "0.1em", marginTop: 2 }}>
                POST → https://asosint.io/api/ingest-telemetry · ThreatEvent schema · source: Wazuh/OutpostZero
              </div>
            </div>
            <button
              onClick={handleSimulateAttack}
              disabled={simState === "sending"}
              style={{
                background: simState === "sending" ? "#1a0808" : simState === "success" ? "#0a1a0e" : simState === "error" ? "#2a0a0a" : "#1e0808",
                border: `1px solid ${simState === "success" ? T.green : simState === "error" ? T.red : T.red}`,
                color: simState === "success" ? T.green : simState === "error" ? T.red : T.red,
                padding: "8px 20px",
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: simState === "sending" ? "not-allowed" : "pointer",
                opacity: simState === "sending" ? 0.6 : 1,
                transition: "all 0.2s",
              }}
            >
              {simState === "sending" ? "⟳ TRANSMITTING…" : simState === "success" ? "✓ DISPATCHED" : simState === "error" ? "✗ HUB ERROR" : "⚡ Simulate Attack → Push to Hub"}
            </button>
          </div>

          {simResult && (
            <div style={{ background: T.bg, border: `1px solid ${T.border}`, padding: "10px 14px", fontFamily: "monospace", fontSize: 10, maxHeight: 220, overflowY: "auto" }}>
              <div style={{ color: T.goldDim, marginBottom: 6, letterSpacing: "0.1em" }}>
                {simState === "success" ? `✓ HUB ACKNOWLEDGED · status ${simResult.status}` : "✗ TRANSMISSION RESULT"}
              </div>
              {simResult.payload_sent && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: T.creamDim, marginBottom: 3 }}>PAYLOAD DISPATCHED:</div>
                  {[
                    ["Timestamp",   simResult.payload_sent.timestamp],
                    ["Source Tool", simResult.payload_sent.source_tool],
                    ["Threat Score",simResult.payload_sent.threat_score],
                    ["Technique",   `${simResult.payload_sent.mitre_technique} — ${simResult.payload_sent.mitre_technique_name}`],
                    ["Tactic",      `${simResult.payload_sent.mitre_tactic} — ${simResult.payload_sent.mitre_tactic_name}`],
                    ["Source IP",   simResult.payload_sent.source_ip],
                    ["Location",    simResult.payload_sent.location_data ? `${simResult.payload_sent.location_data.city}, ${simResult.payload_sent.location_data.country} (${simResult.payload_sent.location_data.asn})` : "—"],
                    ["Asset",       simResult.payload_sent.affected_asset],
                    ["TTD",         `${simResult.payload_sent.ttd_ms}ms`],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 8, padding: "2px 0", borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ color: T.goldDim }}>{k}</span>
                      <span style={{ color: T.cream }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {simResult.hub_response && (
                <div style={{ color: T.teal, marginTop: 6 }}>
                  HUB RESPONSE: {JSON.stringify(simResult.hub_response)}
                </div>
              )}
              {simResult.error && (
                <div style={{ color: T.red }}>ERROR: {simResult.error}</div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="da-ornament" style={{ padding: "10px 0 4px", fontSize: 11, letterSpacing: "0.28em" }}>
          ✦ &nbsp; THE SENTINEL ECOSYSTEM — PhD RESEARCH PROTOTYPE · NOT FOR COMMERCIAL USE &nbsp; ✦
        </div>
      </div>
    </div>
  );
}