"use client";

import { useReducer } from "react";
import DiagramFrame, { DiagramButton } from "./diagram/DiagramFrame";
import { useDiagramPlayback, useTicker } from "./diagram/useDiagramPlayback";
import { createBucket, refill, tryTake, type BucketState } from "@/lib/diagrams/tokenBucket";

const CAPACITY = 5;
const REFILL_PER_SECOND = 1;
const TICK_MS = 100;
const LOG_LENGTH = 16;

interface SimState {
  now: number;
  bucket: BucketState;
  log: boolean[];
}

type Action = { type: "advance"; ms: number } | { type: "send"; count: number } | { type: "reset" };

function initial(): SimState {
  return { now: 0, bucket: createBucket(CAPACITY, REFILL_PER_SECOND, 0), log: [] };
}

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case "advance": {
      const now = state.now + action.ms;
      return { ...state, now, bucket: refill(state.bucket, now) };
    }
    case "send": {
      let bucket = state.bucket;
      const results: boolean[] = [];
      for (let i = 0; i < action.count; i++) {
        const result = tryTake(bucket, state.now);
        bucket = result.state;
        results.push(result.allowed);
      }
      return { ...state, bucket, log: [...state.log, ...results].slice(-LOG_LENGTH) };
    }
    case "reset":
      return initial();
  }
}

export default function TokenBucket() {
  const { ref, playing, reducedMotion, paused, setPaused } = useDiagramPlayback<HTMLElement>();
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  useTicker(playing, TICK_MS, () => dispatch({ type: "advance", ms: TICK_MS }));

  const tokens = state.bucket.tokens;
  const allowed = state.log.filter(Boolean).length;

  return (
    <DiagramFrame
      ref={ref}
      title="Token bucket rate limiter"
      caption="A request passes only if it can take a token. A burst drains the bucket at once; after that, the refill rate caps sustained throughput."
      controls={
        <>
          <DiagramButton onClick={() => dispatch({ type: "send", count: 1 })}>Send 1 request</DiagramButton>
          <DiagramButton onClick={() => dispatch({ type: "send", count: 8 })}>Send burst of 8</DiagramButton>
          {!reducedMotion && <DiagramButton onClick={() => setPaused(!paused)}>{paused ? "Resume refill" : "Pause refill"}</DiagramButton>}
          <DiagramButton onClick={() => dispatch({ type: "advance", ms: 1000 })}>Wait 1 second</DiagramButton>
          <DiagramButton onClick={() => dispatch({ type: "reset" })}>Reset</DiagramButton>
        </>
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            Bucket · {tokens.toFixed(1)} / {CAPACITY} tokens
          </div>
          <div className="flex gap-2" role="img" aria-label={`${Math.floor(tokens)} of ${CAPACITY} tokens available`}>
            {Array.from({ length: CAPACITY }, (_, i) => {
              const fill = Math.max(0, Math.min(1, tokens - i));
              return (
                <div
                  key={i}
                  className="relative h-10 w-10 overflow-hidden"
                  style={{ border: "2.5px solid var(--border)", background: "var(--paper)" }}
                >
                  <div
                    className="absolute inset-x-0 bottom-0"
                    style={{ height: `${fill * 100}%`, background: "var(--yellow)", transition: `height ${TICK_MS}ms linear` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="font-mono-label mt-2" style={{ color: "var(--muted)" }}>
            Refill: {REFILL_PER_SECOND} token / second
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mono-label mb-2" style={{ color: "var(--muted)" }}>
            Last {LOG_LENGTH} requests · {allowed} allowed, {state.log.length - allowed} rejected
          </div>
          <ol className="flex flex-wrap gap-1.5" aria-label="Recent requests">
            {state.log.map((ok, i) => (
              <li
                key={i}
                className="grid h-7 w-7 place-items-center text-sm font-bold"
                style={{
                  background: ok ? "var(--green)" : "var(--red)",
                  color: ok ? "var(--on-green)" : "var(--on-red)",
                  border: "2px solid var(--border)",
                }}
                aria-label={ok ? "allowed" : "rejected"}
              >
                {ok ? "✓" : "✗"}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DiagramFrame>
  );
}
