"use client";

import { useMemo, useState } from "react";
import DiagramFrame, { DiagramButton } from "./diagram/DiagramFrame";
import { assignKeys, buildRing, hash32, modAssign, movedKeys, ringAngle } from "@/lib/diagrams/hashRing";

const SERVERS = ["A", "B", "C", "D", "E"];
const FILL: Record<string, string> = { A: "var(--red)", B: "var(--blue)", C: "var(--green)", D: "var(--yellow)", E: "var(--pink)" };
const TEXT: Record<string, string> = { A: "var(--on-red)", B: "var(--on-blue)", C: "var(--on-green)", D: "var(--on-yellow)", E: "var(--on-pink)" };
// 60 keys and 16 virtual nodes are pinned by a hashRing test: fewer keys make virtual nodes look worse, not better.
const KEYS = Array.from({ length: 60 }, (_, i) => `key-${i}`);
const MIN_SERVERS = 2;
const VIRTUAL_NODES = 16;
const CENTER = 180;
const RING_RADIUS = 130;
const KEY_RADIUS = 106;

function polar(angleDeg: number, radius: number) {
  const radians = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(radians), y: CENTER + radius * Math.sin(radians) };
}

export default function ConsistentHashRing() {
  const [count, setCount] = useState(3);
  const [virtualNodes, setVirtualNodes] = useState(false);
  const [previousCount, setPreviousCount] = useState<number | null>(null);

  const perServer = virtualNodes ? VIRTUAL_NODES : 1;
  const ring = useMemo(() => buildRing(SERVERS.slice(0, count), perServer), [count, perServer]);
  const owners = useMemo(() => assignKeys(KEYS, ring), [ring]);

  const change = useMemo(() => {
    if (previousCount === null) return null;
    const before = assignKeys(KEYS, buildRing(SERVERS.slice(0, previousCount), perServer));
    const moved = new Set(movedKeys(before, owners));
    const modMoved = movedKeys(modAssign(KEYS, SERVERS.slice(0, previousCount)), modAssign(KEYS, SERVERS.slice(0, count))).length;
    return { moved, modMoved, added: count > previousCount, server: SERVERS[Math.max(count, previousCount) - 1] };
  }, [previousCount, perServer, owners, count]);

  const resize = (next: number) => {
    setPreviousCount(count);
    setCount(next);
  };
  const toggleVirtual = () => {
    setVirtualNodes((v) => !v);
    setPreviousCount(null);
  };

  const loads = SERVERS.slice(0, count).map((server) => ({ server, keys: KEYS.filter((k) => owners[k] === server).length }));

  return (
    <DiagramFrame
      title="Consistent hashing ring"
      caption="Each key belongs to the next server clockwise. Adding or removing a server only moves the keys in one arc. Virtual nodes scatter each server around the ring so the load evens out."
      controls={
        <>
          <DiagramButton onClick={() => resize(count + 1)} disabled={count >= SERVERS.length}>
            Add server
          </DiagramButton>
          <DiagramButton onClick={() => resize(count - 1)} disabled={count <= MIN_SERVERS}>
            Remove server
          </DiagramButton>
          <DiagramButton onClick={toggleVirtual} pressed={virtualNodes}>
            Virtual nodes: {virtualNodes ? `${VIRTUAL_NODES} each` : "off"}
          </DiagramButton>
        </>
      }
    >
      <svg
        viewBox="0 0 360 360"
        className="mx-auto block h-auto w-full max-w-[420px]"
        role="img"
        aria-label={`Hash ring with ${count} servers and ${KEYS.length} keys`}
      >
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} style={{ fill: "none", stroke: "var(--border)", strokeWidth: 3 }} />
        {KEYS.map((key) => {
          const { x, y } = polar(ringAngle(hash32(key)), KEY_RADIUS);
          const moved = change?.moved.has(key) ?? false;
          return (
            <circle
              key={key}
              cx={x}
              cy={y}
              r={moved ? 6 : 4}
              style={{ fill: FILL[owners[key]], stroke: "var(--border)", strokeWidth: moved ? 2.5 : 1.25, transition: "fill 0.4s ease" }}
            />
          );
        })}
        {ring.map((node) => {
          const angle = ringAngle(node.position);
          const { x, y } = polar(angle, RING_RADIUS);
          const label = polar(angle, RING_RADIUS + 22);
          return (
            <g key={node.id}>
              <rect x={x - 7} y={y - 7} width={14} height={14} style={{ fill: FILL[node.server], stroke: "var(--border)", strokeWidth: 2 }} />
              {!virtualNodes && (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ fill: "var(--ink)", fontFamily: "var(--font-mono), monospace", fontSize: 14, fontWeight: 700 }}
                >
                  {node.server}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="mt-3 text-[0.95rem]" aria-live="polite">
        {change
          ? `${change.added ? "Adding" : "Removing"} server ${change.server} moved ${change.moved.size} of ${KEYS.length} keys. Modulo hashing (hash % servers) would have moved ${change.modMoved}.`
          : "Add or remove a server to see which keys move. Squares are servers; dots are keys."}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {loads.map(({ server, keys }) => (
          <li
            key={server}
            className="font-mono-label px-2 py-1"
            style={{ background: FILL[server], color: TEXT[server], border: "2px solid var(--border)" }}
          >
            {server}: {keys} keys
          </li>
        ))}
      </ul>
    </DiagramFrame>
  );
}
