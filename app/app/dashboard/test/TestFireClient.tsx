"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Selectable } from "kysely";
import { sendTestWebhookAction } from "@/app/dashboard/actions";
import LogItem from "@/components/LogItem";
import { useToast } from "@/components/Toast";
import type { WebhooksLogTable, WebhookRow } from "@/lib/db/webhook-types";

const TEST_PREVIEW_PAYLOAD = {
  is_test: true,
  is_fte: true,
  is_intern: true,
  company_name: "Test Company",
  title: "Test Engineer",
  date_posted: 1700000000,
  url: "https://example.com/jobs/test",
  source: "test",
  degrees: [],
  sponsorship: "does not sponsor",
  locations: ["Remote"],
  category: "software-engineering",
};

export default function TestFireClient({
  initialWebhook,
  initialLogs,
}: {
  initialWebhook: WebhookRow | null;
  initialLogs: Selectable<WebhooksLogTable>[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefreshTransition] = useTransition();
  const { showToast } = useToast();
  const [queuedAt, setQueuedAt] = useState<number | null>(null);

  const actionButtonBase =
    "rounded-[9px] px-4 py-2 font-[var(--font-dm-mono)] text-[11px] font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";
  const endpoint = initialWebhook?.hook_url ?? "";
  const canFire = Boolean(initialWebhook && initialWebhook.is_active);

  const fireTest = () => {
    startTransition(() => {
      void (async () => {
        const result = await sendTestWebhookAction();

        if (result.ok) {
          setQueuedAt(Date.now());
          showToast("test queued 🍪 check test deliveries in a few seconds");
          router.refresh();
          return;
        }

        showToast(result.message ?? "failed to queue test");
      })();
    });
  };

  const refreshDeliveries = () => {
    startRefreshTransition(() => {
      router.refresh();
      showToast("refreshing latest test deliveries…");
    });
  };

  return (
    <>
      <div className="mb-6">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          test fire
        </div>
        <div className="text-[26px] font-black tracking-[-1px] text-[color:var(--brown)]">
          send a test cookie
        </div>
        <div className="mt-0.5 text-[13px] italic text-[color:var(--brown-mid)]">
          fires a fake payload to your saved endpoint so you can make sure everything&apos;s wired up.
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.4rem] py-5 max-sm:px-4">
        <div className="mb-3 text-sm font-bold text-[color:var(--brown)]">
          preview payload
        </div>
        <div className="mb-4 rounded-[10px] border border-[color:var(--border-light)] bg-white px-3 py-2">
          <div className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1px] text-[color:var(--muted)]">
            tested endpoint
          </div>
          <div className="mt-1 break-all text-[13px] font-bold text-[color:var(--brown)]">
            {endpoint || "not configured yet"}
          </div>
        </div>
        <div className="overflow-x-auto rounded-[10px] border border-[color:var(--border-light)] bg-white p-4 font-[var(--font-dm-mono)] text-[11px] leading-[1.8]">
          <code>
            <span className="text-[#0F6E56]">{"{"}</span>
            <br />
            {Object.entries(TEST_PREVIEW_PAYLOAD).map(([key, value], i, arr) => (
              <span key={key}>
                &nbsp;&nbsp;<span className="text-[#0F6E56]">&quot;{key}&quot;:</span>{" "}
                {typeof value === "string" ? (
                  <span className="text-[#3B6D11]">&quot;{value}&quot;</span>
                ) : typeof value === "boolean" ? (
                  <span className="text-[#185FA5]">{value.toString()}</span>
                ) : Array.isArray(value) ? (
                  <span className="text-[#185FA5]">[{value.map((item) => `"${item}"`).join(", ")}]</span>
                ) : (
                  <span className="text-[#185FA5]">{value}</span>
                )}
                {i < arr.length - 1 ? "," : ""}
                <br />
              </span>
            ))}
            <span className="text-[#0F6E56]">{"}"}</span>
          </code>
        </div>

        {!initialWebhook && (
          <div className="mt-4 rounded-[10px] border border-[color:var(--caramel-light)] bg-[#FEF3E2] px-3 py-2 font-[var(--font-dm-mono)] text-[11px] text-[#8B4513]">
            configure your webhook first
          </div>
        )}

        {initialWebhook && !initialWebhook.is_active && (
          <div className="mt-4 rounded-[10px] border border-[color:var(--caramel-light)] bg-[#FEF3E2] px-3 py-2 font-[var(--font-dm-mono)] text-[11px] text-[#8B4513]">
            your webhook is not active
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 max-sm:flex-col">
          <button
            className={`${actionButtonBase} ${canFire ? "bg-[color:var(--caramel)] text-white hover:bg-[color:var(--brown-mid)]" : "border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)] hover:bg-[color:var(--border-light)]"} max-sm:w-full`}
            onClick={fireTest}
            disabled={isPending || !canFire}
          >
            {isPending ? "⏳ queueing test..." : "🔥 fire test payload"}
          </button>
          <button
            type="button"
            className={`${actionButtonBase} border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)] hover:bg-[color:var(--border-light)] max-sm:w-full`}
            onClick={refreshDeliveries}
            disabled={isRefreshing}
          >
            {isRefreshing ? "↻ refreshing..." : "↻ refresh deliveries"}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-bold text-[color:var(--brown)]">test deliveries</div>
          {queuedAt && (
            <div className="font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
              last queued {Math.max(0, Math.floor((Date.now() - queuedAt) / 1000))}s ago
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {initialLogs.length === 0 ? (
            <div className="font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)]">
              no test deliveries yet
            </div>
          ) : (
            initialLogs.map((entry, i) => <LogItem key={`${entry.webhook_id}-${entry.created_at.toString()}-${i}`} entry={entry} />)
          )}
        </div>
      </div>
    </>
  );
}
