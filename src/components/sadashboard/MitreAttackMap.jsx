import { useState } from "react";

const T = {
  bg:         "#0c0a08",
  surface:    "#131009",
  surfaceAlt: "#1a1610",
  border:     "#2c2418",
  borderHi:   "#4a3c24",
  gold:       "#c8a55a",
  goldDim:    "#6a5630",
  cream:      "#e0d0b0",
  creamDim:   "#8a7a60",
  teal:       "#4ecdc4",
  tealDim:    "#1a5550",
  red:        "#d45050",
  orange:     "#cc7840",
  green:      "#5aaa68",
  purple:     "#8a6ab0",
  blue:       "#5a80b0",
};

const TACTICS = [
  { id: "TA0043", name: "Reconnaissance",       abbr: "Recon" },
  { id: "TA0042", name: "Resource Development", abbr: "Resource Dev" },
  { id: "TA0001", name: "Initial Access",        abbr: "Init Access" },
  { id: "TA0002", name: "Execution",             abbr: "Execution" },
  { id: "TA0003", name: "Persistence",           abbr: "Persistence" },
  { id: "TA0004", name: "Privilege Escalation",  abbr: "Priv Esc" },
  { id: "TA0005", name: "Defense Evasion",       abbr: "Def Evasion" },
  { id: "TA0006", name: "Credential Access",     abbr: "Cred Access" },
  { id: "TA0007", name: "Discovery",             abbr: "Discovery" },
  { id: "TA0008", name: "Lateral Movement",      abbr: "Lateral Mv" },
  { id: "TA0009", name: "Collection",            abbr: "Collection" },
  { id: "TA0011", name: "Command & Control",     abbr: "C2" },
  { id: "TA0010", name: "Exfiltration",          abbr: "Exfil" },
  { id: "TA0040", name: "Impact",                abbr: "Impact" },
];

// Hypothetical telemetry events mapped to ATT&CK
const EVENTS = [
  { id: "E01", tactic: "TA0043", technique: "T1595", name: "Active Scanning",          severity: "medium", count: 14, blocked: true,  response: "FW rule auto-deployed; scan source isolated. PPO reward +0.92" },
  { id: "E02", tactic: "TA0001", technique: "T1190", name: "Exploit Public-Facing App", severity: "critical",count: 3, blocked: true, response: "Container c-07 isolated <91ms. Patch recommendation generated." },
  { id: "E03", tactic: "TA0002", technique: "T1059", name: "Command Scripting",         severity: "high",   count: 8, blocked: true,  response: "Script execution blocked via eBPF hook. EDR alert raised." },
  { id: "E04", tactic: "TA0003", technique: "T1053", name: "Scheduled Task/Job",        severity: "medium", count: 5, blocked: false, response: "Detected; task quarantined. Awaiting analyst review." },
  { id: "E05", tactic: "TA0004", technique: "T1548", name: "Abuse Elevation Control",   severity: "high",   count: 4, blocked: true,  response: "Privilege request denied; session terminated. LSASS protected." },
  { id: "E06", tactic: "TA0005", technique: "T1562", name: "Impair Defenses",           severity: "critical",count: 2, blocked: true, response: "Anti-tamper triggered; agent restored. Adversarial pattern logged." },
  { id: "E07", tactic: "TA0006", technique: "T1003", name: "OS Credential Dumping",     severity: "critical",count: 1, blocked: true, response: "LSASS dump intercepted. Memory protection enforced. Alert P1." },
  { id: "E08", tactic: "TA0007", technique: "T1082", name: "System Info Discovery",     severity: "low",    count: 22, blocked: false, response: "Enumeration logged; baseline deviation flagged for review." },
  { id: "E09", tactic: "TA0008", technique: "T1021", name: "Remote Services",           severity: "high",   count: 6, blocked: true,  response: "SMB lateral hop blocked via RL policy. Network segment isolated." },
  { id: "E10", tactic: "TA0009", technique: "T1560", name: "Archive Collected Data",    severity: "medium", count: 3, blocked: false, response: "DLP alert raised; data staged for exfil identified. Manual review." },
  { id: "E11", tactic: "TA0011", technique: "T1071", name: "App Layer Protocol (C2)",   severity: "high",   count: 9, blocked: true,  response: "DNS sinkhole deployed; C2 beacon traffic absorbed. TTD: 91ms." },
  { id: "E12", tactic: "TA0010", technique: "T1041", name: "Exfil Over C2 Channel",     severity: "critical",count: 1, blocked: true, response: "Egress throttled; 0 bytes exfiltrated. Forensic capture initiated." },
  { id: "E13", tactic: "TA0040", technique: "T1486", name: "Data Encrypted (Ransom)",   severity: "critical",count: 1, blocked: true, response: "Crypto-write pattern detected; kill-chain playbook PB-006 invoked." },
  { id: "E14", tactic: "TA0042", technique: "T1588", name: "Obtain Capabilities",       severity: "low",    count: 7, blocked: false, response: "OSINT signal correlated; threat actor TTPs attributed." },
  { id: "E15", tactic: "TA0005", technique: "T1027", name: "Obfuscated Files",          severity: "medium", count: 11, blocked: true, response: "YARA rule matched; obfuscated payload detonated in sandbox." },
];

const SEV_STYLE = {
  critical: { bg: "#2a0a0a", text: T.red,    border: T.red,    label: "CRITICAL" },
  high:     { bg: "#1e1000", text: T.orange, border: T.orange, label: "HIGH" },
  medium:   { bg: "#140e00", text: T.gold,   border: T.goldDim,label: "MEDIUM" },
  low:      { bg: "#0a1a0e", text: T.green,  border: T.green,  label: "LOW" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Share+Tech+Mono&display=swap');

  .mitre-matrix-cell {
    cursor: pointer;
    transition: all 0.15s ease;
    border-radius: 2px;
  }
  .mitre-matrix-cell:hover {
    filter: brightness(1.4);
    transform: scale(1.05);
  }
  .mitre-detail-fade {
    animation: mitreFade 0.3s ease;
  }
  @keyframes mitreFade {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: none; }
  }
`;

export default function MitreAttackMap({ telemetryEvents }) {
  const [selected, setSelected] = useState(null);

  // Merge prop events with defaults
  const events = telemetryEvents && telemetryEvents.length ? telemetryEvents : EVENTS;

  // Build lookup: tacticId → [events]
  const tacticMap = {};
  events.forEach(e => {
    if (!tacticMap[e.tactic]) tacticMap[e.tactic] = [];
    tacticMap[e.tactic].push(e);
  });

  const selectedEvent = events.find(e => e.id === selected);

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{
        fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
        padding: "8px 14px", borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(90deg, #131009 0%, #110e07 100%)",
      }}>
        <span style={{ color: T.gold, fontFamily: "'EB Garamond',serif", fontSize: 14, letterSpacing: "0.06em" }}>
          MITRE ATT&CK® Framework — Simulated Telemetry Mapping
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {Object.entries(SEV_STYLE).map(([k, v]) => (
            <span key={k} style={{ fontSize: 9, color: v.text, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, background: v.bg, border: `1px solid ${v.border}`, display: "inline-block" }} />
              {v.label}
            </span>
          ))}
          <span style={{ color: T.creamDim, fontSize: 9, marginLeft: 6 }}>{events.length} EVENTS</span>
        </div>
      </div>

      {/* Tactic header row */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 900, padding: "10px 14px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${TACTICS.length}, 1fr)`, gap: 3, marginBottom: 4 }}>
            {TACTICS.map(t => (
              <div key={t.id} style={{
                fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
                color: T.goldDim, textAlign: "center", padding: "4px 2px",
                borderBottom: `1px solid ${T.border}`,
              }}>
                {t.abbr}
              </div>
            ))}
          </div>

          {/* Event cells */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${TACTICS.length}, 1fr)`, gap: 3, paddingBottom: 14 }}>
            {TACTICS.map(tactic => {
              const cells = tacticMap[tactic.id] || [];
              return (
                <div key={tactic.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {cells.length === 0 ? (
                    <div style={{ height: 38, background: T.bg, borderRadius: 2, opacity: 0.4 }} />
                  ) : cells.map(ev => {
                    const s = SEV_STYLE[ev.severity];
                    const isSelected = selected === ev.id;
                    return (
                      <div
                        key={ev.id}
                        className="mitre-matrix-cell"
                        onClick={() => setSelected(isSelected ? null : ev.id)}
                        style={{
                          background: s.bg,
                          border: `1px solid ${isSelected ? s.text : s.border}`,
                          padding: "5px 6px",
                          boxShadow: isSelected ? `0 0 8px ${s.text}55` : "none",
                        }}
                      >
                        <div style={{ fontSize: 8, color: s.text, fontWeight: "bold", letterSpacing: "0.06em" }}>{ev.technique}</div>
                        <div style={{ fontSize: 8, color: T.cream, marginTop: 2, lineHeight: 1.3 }}>{ev.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                          <span style={{ fontSize: 7, color: ev.blocked ? T.green : T.orange }}>
                            {ev.blocked ? "✓ BLOCKED" : "⚠ DETECTED"}
                          </span>
                          <span style={{ fontSize: 7, color: T.creamDim }}>×{ev.count}</span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Empty filler to align columns */}
                  {cells.length === 0 && null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedEvent && (
        <div className="mitre-detail-fade" style={{
          borderTop: `1px solid ${T.border}`,
          padding: "14px 18px",
          background: T.surfaceAlt,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 18,
          alignItems: "start",
        }}>
          <div>
            <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: "0.12em", marginBottom: 6 }}>SELECTED TECHNIQUE</div>
            <div style={{ fontSize: 20, color: SEV_STYLE[selectedEvent.severity].text, fontFamily: "monospace" }}>{selectedEvent.technique}</div>
            <div style={{ fontSize: 13, color: T.cream, marginTop: 4, fontFamily: "'EB Garamond',serif" }}>{selectedEvent.name}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 9, padding: "2px 8px",
                background: SEV_STYLE[selectedEvent.severity].bg,
                color: SEV_STYLE[selectedEvent.severity].text,
                border: `1px solid ${SEV_STYLE[selectedEvent.severity].border}`,
                letterSpacing: "0.08em",
              }}>
                {SEV_STYLE[selectedEvent.severity].label}
              </span>
              <span style={{ fontSize: 9, padding: "2px 8px", background: "#061414", color: T.teal, border: `1px solid ${T.tealDim}` }}>
                OBSERVATIONS ×{selectedEvent.count}
              </span>
              <span style={{
                fontSize: 9, padding: "2px 8px",
                background: selectedEvent.blocked ? "#0a1a0e" : "#1e1000",
                color: selectedEvent.blocked ? T.green : T.orange,
                border: `1px solid ${selectedEvent.blocked ? T.green : T.orange}`,
              }}>
                {selectedEvent.blocked ? "✓ AUTONOMOUS BLOCK" : "⚠ DETECTED — UNDER REVIEW"}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: T.goldDim, letterSpacing: "0.12em", marginBottom: 6 }}>PPO AGENT RESPONSE LOG</div>
            <div style={{
              fontFamily: "monospace", fontSize: 11, color: T.teal,
              background: T.bg, border: `1px solid ${T.border}`,
              padding: "10px 14px", lineHeight: 1.7,
            }}>
              &gt; {selectedEvent.response}
            </div>
            <div style={{ marginTop: 8, fontSize: 9, color: T.creamDim, fontStyle: "italic", fontFamily: "'EB Garamond',serif" }}>
              Tactic: {TACTICS.find(t => t.id === selectedEvent.tactic)?.name} ({selectedEvent.tactic})
              &nbsp;·&nbsp; Technique: {selectedEvent.technique}
              &nbsp;·&nbsp; Source: Simulated educational telemetry — PhD Research
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div style={{ padding: "6px 14px 8px", borderTop: `1px solid ${T.border}`, fontSize: 9, color: T.goldDim, fontStyle: "italic", fontFamily: "'EB Garamond',serif", textAlign: "center" }}>
        All data is hypothetical and generated for academic research purposes only. MITRE ATT&CK® is a registered trademark of The MITRE Corporation.
      </div>
    </div>
  );
}