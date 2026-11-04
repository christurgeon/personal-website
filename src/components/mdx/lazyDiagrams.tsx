"use client";

// Interactive (client) diagrams, code-split per component. They still render on
// the server (next/dynamic defaults to ssr: true), so the HTML is unchanged, but
// each diagram's JS now ships only with posts that actually use it instead of in
// the chunk shared by every blog post.
import dynamic from "next/dynamic";

export const ConsistentHashRing = dynamic(() => import("./ConsistentHashRing"));
export const TokenBucket = dynamic(() => import("./TokenBucket"));
export const LruCache = dynamic(() => import("./LruCache"));
export const QuorumReplicas = dynamic(() => import("./QuorumReplicas"));
export const LoadBalancerRace = dynamic(() => import("./LoadBalancerRace"));
export const PageTableWalk = dynamic(() => import("./PageTableWalk"));
export const HandshakeSequence = dynamic(() => import("./HandshakeSequence"));
export const LsmTree = dynamic(() => import("./LsmTree"));
export const PacketEncapsulation = dynamic(() => import("./PacketEncapsulation"));
export const ShardedVsReplicatedCache = dynamic(() => import("./ShardedVsReplicatedCache"));
