import { describe, it, expect } from "vitest";
import { assign, createLb, lbArrive, lbServe, lbTick, type Strategy } from "@/lib/diagrams/loadBalancer";

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

  it("arrivals load the fast servers before they drain", () => {
    const arrived = lbArrive(run("round-robin", 5), "round-robin", 6);
    expect(arrived.queues).toEqual([2, 2, 7]);
    expect(arrived.tick).toBe(5);
    expect(lbServe(arrived, SPEEDS).queues).toEqual([0, 0, 6]);
  });

  it("least connections spreads arrivals so every server holds work", () => {
    expect(lbArrive(run("least-connections", 5), "least-connections", 6).queues).toEqual([3, 2, 2]);
  });

  it("serving advances the tick", () => {
    expect(lbServe(createLb(3), SPEEDS).tick).toBe(1);
  });

  it("counts ticks", () => {
    expect(run("round-robin", 3).tick).toBe(3);
  });
});
