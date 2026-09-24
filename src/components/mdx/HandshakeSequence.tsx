"use client";

import DiagramFrame, { StepControls } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useStepper } from "./diagram/useDiagramPlayback";
import { liveRegion } from "@/lib/diagrams/playback";

interface Message {
  from: "client" | "server";
  label: string;
  detail: string;
  phase: "TCP" | "TLS 1.3" | "HTTP";
}

const MESSAGES: Message[] = [
  { from: "client", label: "SYN", detail: "The client picks an initial sequence number and asks to open a connection.", phase: "TCP" },
  { from: "server", label: "SYN-ACK", detail: "The server acknowledges the client's number and sends its own.", phase: "TCP" },
  { from: "client", label: "ACK", detail: "The client acknowledges. The connection is open after one round trip.", phase: "TCP" },
  {
    from: "client",
    label: "ClientHello",
    detail: "Supported TLS versions and cipher suites, plus a key share so keys can be derived right away.",
    phase: "TLS 1.3",
  },
  {
    from: "server",
    label: "ServerHello … Finished",
    detail:
      "The server's key share, then its certificate, a signature proving it holds the private key, and Finished. Everything after ServerHello is encrypted.",
    phase: "TLS 1.3",
  },
  {
    from: "client",
    label: "Finished",
    detail: "The client verifies the certificate chain and the signature, then confirms the handshake.",
    phase: "TLS 1.3",
  },
  {
    from: "client",
    label: "GET /",
    detail: "The first HTTP request, encrypted with the session keys. It can travel in the same flight as Finished.",
    phase: "HTTP",
  },
];

const CLIENT_X = 60;
const SERVER_X = 300;
const TOP = 56;
const GAP = 46;
const HEIGHT = TOP + MESSAGES.length * GAP;
const MONO = "var(--font-mono), monospace";

export default function HandshakeSequence() {
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const { step, atEnd, next, reset } = useStepper(MESSAGES.length, playing, 1400);
  const current = MESSAGES[step];

  return (
    <DiagramFrame
      ref={ref}
      title="TCP and TLS 1.3 handshakes"
      caption="TCP spends one round trip before any data moves, and TLS 1.3 adds one more. That is why connection reuse matters, and why HTTP/3 merges the transport and TLS handshakes."
      controls={
        <StepControls
          step={step}
          total={MESSAGES.length}
          atEnd={atEnd}
          onNext={() => {
            setPaused(true);
            next();
          }}
          onReset={reset}
          paused={paused}
          onTogglePause={() => setPaused(!paused)}
          reducedMotion={reducedMotion}
          playing={playing}
        />
      }
    >
      <svg
        viewBox={`0 0 360 ${HEIGHT}`}
        className="mx-auto block h-auto w-full max-w-[480px]"
        role="img"
        aria-label={`Handshake step ${step + 1} of ${MESSAGES.length}: ${current.label}`}
      >
        <defs>
          {(["ink", "accent"] as const).map((tone) => (
            <marker
              key={tone}
              id={`handshake-arrow-${tone}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: tone === "ink" ? "var(--ink)" : "var(--accent)" }} />
            </marker>
          ))}
        </defs>
        {[
          { x: CLIENT_X, label: "CLIENT" },
          { x: SERVER_X, label: "SERVER" },
        ].map(({ x, label }) => (
          <g key={label}>
            <text x={x} y={24} textAnchor="middle" style={{ fill: "var(--ink)", fontFamily: MONO, fontSize: 13, fontWeight: 700 }}>
              {label}
            </text>
            <line x1={x} y1={34} x2={x} y2={HEIGHT - 8} style={{ stroke: "var(--border)", strokeWidth: 2.5 }} />
          </g>
        ))}
        {MESSAGES.map((message, i) => {
          if (i > step) return null;
          const y = TOP + i * GAP + 18;
          const [x1, x2] = message.from === "client" ? [CLIENT_X, SERVER_X] : [SERVER_X, CLIENT_X];
          const active = i === step;
          const color = active ? "var(--accent)" : "var(--ink)";
          const phaseStart = i === 0 || MESSAGES[i - 1].phase !== message.phase;
          return (
            <g key={message.label}>
              {phaseStart && (
                <text
                  x={180}
                  y={y - 26}
                  textAnchor="middle"
                  style={{ fill: "var(--muted)", fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em" }}
                >
                  {message.phase}
                </text>
              )}
              <line
                x1={x1}
                y1={y}
                x2={x2 + (x2 > x1 ? -4 : 4)}
                y2={y}
                markerEnd={`url(#handshake-arrow-${active ? "accent" : "ink"})`}
                style={{ stroke: color, strokeWidth: active ? 3 : 2 }}
              />
              <text x={180} y={y - 7} textAnchor="middle" style={{ fill: color, fontFamily: MONO, fontSize: 12, fontWeight: active ? 700 : 400 }}>
                {message.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3" aria-live={liveRegion(playing)}>
        <strong>{current.label}.</strong> {current.detail}
      </p>
    </DiagramFrame>
  );
}
