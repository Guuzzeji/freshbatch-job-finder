"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { TEST_PAYLOAD } from "@/lib/mock-data";
import { getStoredWebhookEndpoint } from "@/lib/webhook";

export default function TestFirePage() {
  const { showToast } = useToast();
  const [showResult, setShowResult] = useState(false);
  const [endpoint] = useState(() => getStoredWebhookEndpoint());
  const actionButtonBase =
    "rounded-[9px] px-4 py-2 font-[var(--font-dm-mono)] text-[11px] font-medium transition active:scale-[0.97]";

  const fireTest = () => {
    if (!endpoint) {
      showToast("add a delivery endpoint before firing a test");
      return;
    }

    setShowResult(true);
    showToast("test cookie fired 🔥");
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
        <div className="mb-4 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
          Target endpoint: {endpoint || "not configured yet"}
        </div>
        <div className="overflow-x-auto rounded-[10px] border border-[color:var(--border-light)] bg-white p-4 font-[var(--font-dm-mono)] text-[11px] leading-[1.8]">
          <code>
            <span className="text-[#0F6E56]">{"{"}</span><br />
            {Object.entries(TEST_PAYLOAD).map(([key, value], i, arr) => (
              <span key={key}>
                &nbsp;&nbsp;<span className="text-[#0F6E56]">&quot;{key}&quot;:</span>{" "}
                {typeof value === "string" ? (
                  <span className="text-[#3B6D11]">&quot;{value}&quot;</span>
                ) : typeof value === "boolean" ? (
                  <span className="text-[#185FA5]">{value.toString()}</span>
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
        <div className="mt-4 flex flex-wrap gap-2 max-sm:flex-col">
          <button
            className={`${actionButtonBase} ${endpoint ? "bg-[color:var(--caramel)] text-white hover:bg-[color:var(--brown-mid)]" : "border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)] hover:bg-[color:var(--border-light)]"} max-sm:w-full`}
            onClick={fireTest}
          >
            🔥 fire test payload
          </button>
          <Link
            href="/dashboard"
            className={`${actionButtonBase} border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)] hover:bg-[color:var(--border-light)] no-underline max-sm:w-full max-sm:text-center`}
          >
            ← back
          </Link>
        </div>
      </div>

      {showResult && (
        <div className="mb-5 rounded-2xl border border-[color:var(--border-light)] bg-[color:var(--cream)] px-[1.4rem] py-5 animate-[popin_0.35s_ease] max-sm:px-4">
          <div className="mb-3 text-sm font-bold text-[color:var(--brown)]">result</div>
          <div className="flex items-center gap-2.5 py-2">
            <div className="h-[7px] w-[7px] rounded-full bg-[color:var(--green)]" />
            <div>
              <div className="text-[13px] font-bold text-[color:var(--brown)]">
                200 OK — delivered in 312ms
              </div>
              <div className="mt-0.5 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
                your hook is warm and ready 🍪
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
