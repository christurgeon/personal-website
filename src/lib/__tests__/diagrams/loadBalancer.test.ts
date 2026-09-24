import { describe, it, expect } from "vitest";
import { assign, createLb, lbTick, type Strategy } from "@/lib/diagrams/loadBalancer";

const SPEEDS = [3, 3, 1];

function run(strategy: Strategy, ticks: number) {
  let state = createLb(3);
  for (let i = 0; i < ticks; i++) state = lbTick(state, strategy, SPEEDS, 6);
  return state;
}

describe("load balancer", () => {
  it("round robin cycles through servers", () => {
    let state = createLb(3);
    const picks: number[] = [];
    for (let i = 0; i < 4; i++) {
      const result = assign(state, "round-robin");
      state = result.state;
      picks.push(result.server);
    }
    expect(picks).toEqual([0, 1, 2, 0]);
  });

  it("least connections breaks ties toward the lowest index", () => {
    expect(assign(createLb(3), "least-connections").server).toBe(0);
  });

  it("round robin lets the slow server's queue grow by one per tick", () => {
    expect(run("round-robin", 10).queues).toEqual([0, 0, 10]);
  });

  it("least connections keeps every queue short", () => {
    expect(Math.max(...run("least-connections", 10).queues)).toBeLessThanOrEqual(1);
  });

  it("counts ticks", () => {
    expect(run("round-robin", 3).tick).toBe(3);
  });
});
