"use client";

import type { ReactNode } from "react";
import DiagramFrame, { StepControls } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useStepper } from "./diagram/useDiagramPlayback";

const LAYERS = [
  { name: "Application", label: "email body", background: "var(--yellow)", color: "var(--on-yellow)" },
  { name: "Transport", label: "TCP header · ports 49152 → 587", background: "var(--green)", color: "var(--on-green)" },
  { name: "Network", label: "IP header · 198.51.100.7 → 203.0.113.9", background: "var(--blue)", color: "var(--on-blue)" },
  { name: "Link", label: "Ethernet header + trailer · MAC addresses, checksum", background: "var(--pink)", color: "var(--on-pink)" },
];

type Host = "Sender" | "Network" | "Receiver";
const HOSTS: Host[] = ["Sender", "Network", "Receiver"];

const STEPS: { host: Host; depth: number; note: string }[] = [
  { host: "Sender", depth: 1, note: "The mail client hands the message to the transport layer." },
  { host: "Sender", depth: 2, note: "Transport adds a TCP header with source and destination ports. The unit is now a segment." },
  { host: "Sender", depth: 3, note: "Network adds an IP header with source and destination addresses. The unit is now a packet." },
  { host: "Sender", depth: 4, note: "Link wraps the packet in a frame addressed to the next hop's MAC address and sends the bits." },
  {
    host: "Network",
    depth: 4,
    note: "Each router strips the frame, reads the destination IP, decrements the TTL, and wraps the packet in a new frame for the next hop.",
  },
  { host: "Receiver", depth: 4, note: "The receiver's network card checks the frame checksum." },
  { host: "Receiver", depth: 3, note: "The link layer strips the frame and passes the packet up." },
  { host: "Receiver", depth: 2, note: "The destination IP matches this host, so the network layer strips the IP header." },
  {
    host: "Receiver",
    depth: 1,
    note: "Transport uses the destination port to find the listening socket, strips the TCP header, and delivers the bytes.",
  },
];

function Wrapped({ depth }: { depth: number }) {
  let inner: ReactNode = null;
  for (let i = 0; i < depth; i++) {
    const layer = LAYERS[i];
    inner = (
      <div className="min-w-0 p-2 sm:p-3" style={{ background: layer.background, color: layer.color, border: "2.5px solid var(--border)" }}>
        <div className="font-mono-label mb-1 break-words" style={{ fontSize: "0.68rem" }}>
          {layer.name} · {layer.label}
        </div>
        {inner}
      </div>
    );
  }
  return inner;
}

export default function PacketEncapsulation() {
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const { step, atEnd, next, reset } = useStepper(STEPS.length, playing, 1600);
  const current = STEPS[step];

  return (
    <DiagramFrame
      ref={ref}
      title="Encapsulation down and up the stack"
      caption="Each layer wraps what it receives from above in its own header and knows nothing about the layers inside. The receiver unwraps in reverse order."
      controls={
        <StepControls
          step={step}
          total={STEPS.length}
          atEnd={atEnd}
          onNext={() => {
            setPaused(true);
            next();
          }}
          onReset={reset}
          paused={paused}
          onTogglePause={() => setPaused(!paused)}
          reducedMotion={reducedMotion}
        />
      }
    >
      <ol className="mb-4 flex flex-wrap gap-2" aria-label="Where the data is">
        {HOSTS.map((host) => (
          <li
            key={host}
            className="font-mono-label px-2 py-1"
            aria-current={host === current.host ? "step" : undefined}
            style={{
              border: "2px solid var(--border)",
              background: host === current.host ? "var(--ink)" : "var(--paper)",
              color: host === current.host ? "var(--paper)" : "var(--muted)",
            }}
          >
            {host}
          </li>
        ))}
      </ol>
      <Wrapped depth={current.depth} />
      <p className="mt-4" aria-live="polite">
        {current.note}
      </p>
    </DiagramFrame>
  );
}
