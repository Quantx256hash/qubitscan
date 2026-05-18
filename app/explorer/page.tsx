"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { HudPanel } from "@/components/explorer/HudPanel";
import { ScrambleText } from "@/components/explorer/ScrambleText";
import { BlockRow, EventRow } from "@/components/explorer/Rows";
import {
  useNetworkStatus,
  useLatestBlocks,
  useEventStream,
} from "@/lib/qubitor/hooks";
import { hexToNumber, formatQbt } from "@/lib/qubitor/format";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 border border-qb-line bg-qb-ink p-5">
      <span className="qb-label text-qb-mist">{label}</span>
      <span
        className={`font-display text-2xl tracking-tight md:text-3xl ${
          accent ? "text-qb-spark" : "text-qb-bone"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ExplorerOverview() {
  const { data: status, meta, error } = useNetworkStatus();
  const { data: blocks } = useLatestBlocks(10);
  const { data: events } = useEventStream({ limit: 24 });

  const head = status ? hexToNumber(status.mining?.blockNumber) : 0;
  const bridge = status?.deployments?.qubitorNativeBridge;

  return (
    <div className="flex flex-col gap-20">
      <header className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Qubitor Testnet · Live Surface"
          headline="The chain, observed."
        />
        <p className="qb-body max-w-[60ch]">
          A direct read of the live Qubitor testnet gateway. No indexer, no
          cache layer — every value below is the chain answering for itself.
        </p>
        {error ? (
          <p className="qb-label text-qb-spark">
            ◇ RPC UNREACHABLE — {error}. Retrying…
          </p>
        ) : null}
      </header>

      {/* live stat grid */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <Stat
          label="Network"
          value={status?.network ?? "…"}
          accent
        />
        <Stat label="Chain ID" value={status ? String(status.chainId) : "…"} />
        <Stat
          label="Head Block"
          value={head ? head.toLocaleString() : "…"}
          accent
        />
        <Stat
          label="Block Time"
          value={
            status ? `${status.targetBlockTimeSeconds}s` : "…"
          }
        />
        <Stat
          label="Mining"
          value={status ? (status.mining?.mining ? "TRUE" : "FALSE") : "…"}
        />
        <Stat
          label="Peers"
          value={
            status ? String(hexToNumber(status.mining?.peerCount)) : "…"
          }
        />
        <Stat
          label="Account Model"
          value={status?.defaultSecurityMode ?? "…"}
          accent
        />
        <Stat
          label="ECDSA Control"
          value={status ? (status.ecdsaControl ? "YES" : "NONE") : "…"}
        />
      </section>

      {/* system status + exact claim */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HudPanel label="SYSTEM STATUS" status="GENESIS-INSTALLED">
          <dl className="flex flex-col gap-3 font-mono text-sm">
            <Row k="Precompile" v={status?.precompile?.name} />
            <Row
              k="Primitive"
              v={status?.precompile?.primitive}
              accent
            />
            <Row
              k="ML-DSA Verify"
              v={status?.precompile?.address}
              mono
            />
            <Row
              k="Account Factory"
              v={status?.deployments?.qubitorAccountFactory}
              mono
            />
            <Row
              k="Security Registry"
              v={status?.deployments?.securityModeRegistry}
              mono
            />
            <Row
              k="Readiness Registry"
              v={status?.deployments?.accountReadinessRegistry}
              mono
            />
            <Row k="Deployment" v={status?.deployments?.deploymentMode} />
          </dl>
        </HudPanel>

        <HudPanel label="NATIVE BRIDGE" status={bridge ? "READABLE" : "—"}>
          <dl className="flex flex-col gap-3 font-mono text-sm">
            <Row k="Registry" v={bridge?.registry} mono />
            <Row k="Guardian Verifier" v={bridge?.guardianVerifier} mono />
            <Row k="Vault" v={bridge?.nativeBridgeVault} mono />
            <Row
              k="Native Liquidity"
              v={
                bridge
                  ? `${formatQbt(
                      BigInt(bridge.initialNativeLiquidityWei),
                    )} QBT`
                  : undefined
              }
              accent
            />
            <Row
              k="Guardian Gas"
              v={
                bridge
                  ? `${formatQbt(
                      BigInt(bridge.guardianGasBalanceWei),
                    )} QBT`
                  : undefined
              }
            />
          </dl>
        </HudPanel>
      </section>

      {/* exact claim boundary — verbatim */}
      {status ? (
        <section>
          <HudPanel label="EXACT CLAIM · COVERAGE BOUNDARY">
            <blockquote className="flex flex-col gap-4">
              <p className="font-mono text-base uppercase leading-relaxed tracking-[0.06em] text-qb-bone">
                “{status.exactClaim}”
              </p>
              <p className="qb-body text-sm">
                {status.compatibilityBoundary}
              </p>
            </blockquote>
          </HudPanel>
        </section>
      ) : null}

      {/* latest blocks + event feed */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HudPanel label="LATEST BLOCKS" status="STREAMING">
          <div className="flex flex-col">
            {(blocks ?? []).map((b) => (
              <BlockRow key={b.hash} block={b} />
            ))}
            {!blocks ? (
              <p className="qb-label py-8 text-qb-mist">DECRYPTING LEDGER…</p>
            ) : null}
          </div>
        </HudPanel>

        <HudPanel label="PQ EVENT FEED" status="eth_getLogs">
          <div className="flex flex-col">
            {(events ?? []).map((e) => (
              <EventRow key={e.id} ev={e} />
            ))}
            {events && events.length === 0 ? (
              <p className="qb-label py-8 text-qb-mist">
                NO SYSTEM EVENTS IN WINDOW — CHAIN IS YOUNG
              </p>
            ) : null}
            {!events ? (
              <p className="qb-label py-8 text-qb-mist">
                SCANNING SYSTEM CONTRACTS…
              </p>
            ) : null}
          </div>
        </HudPanel>
      </section>

      {meta ? (
        <footer className="qb-label text-qb-mist">
          GATEWAY {meta.name} · {meta.shortName} · GAS LIMIT{" "}
          {meta.gasLimit.toLocaleString()} · NATIVE {meta.nativeCurrency.symbol}
        </footer>
      ) : null}
    </div>
  );
}

function Row({
  k,
  v,
  mono,
  accent,
}: {
  k: string;
  v?: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-qb-line/60 pb-2">
      <dt className="qb-label text-qb-mist">{k}</dt>
      <dd
        className={
          accent ? "text-qb-spark" : "text-qb-bone"
        }
      >
        {v == null ? (
          <span className="text-qb-mist">…</span>
        ) : mono ? (
          <ScrambleText
            value={v}
            truncateTo={{ head: 10, tail: 6 }}
            className="text-sm"
          />
        ) : (
          v
        )}
      </dd>
    </div>
  );
}
