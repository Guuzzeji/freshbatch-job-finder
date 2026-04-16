"use client";

import { useState } from "react";
import { useToast } from "./Toast";
import ToggleSwitch from "./ToggleSwitch";
import {
  getStoredWebhookEndpoint,
  isValidWebhookEndpoint,
  WEBHOOK_STORAGE_KEY,
} from "@/lib/webhook";

export default function HookCard() {
  const { showToast } = useToast();
  const [endpoint, setEndpoint] = useState(() => getStoredWebhookEndpoint());
  const [active, setActive] = useState(true);
  const buttonBase =
    "whitespace-nowrap rounded-[9px] px-4 py-2 font-[var(--font-dm-mono)] text-[11px] font-medium transition active:scale-[0.97]";
  const secondaryButton =
    "border border-[color:var(--border)] bg-[color:var(--cream-dark)] text-[color:var(--brown)] hover:bg-[color:var(--border-light)]";

  const saveEndpoint = () => {
    const trimmedEndpoint = endpoint.trim();

    if (!isValidWebhookEndpoint(trimmedEndpoint)) {
      showToast("enter a valid http:// or https:// endpoint");
      return;
    }

    window.localStorage.setItem(WEBHOOK_STORAGE_KEY, trimmedEndpoint);
    setEndpoint(trimmedEndpoint);
    showToast("endpoint saved 🍪 deliveries are pointed at your URL");
  };

  const clearEndpoint = () => {
    window.localStorage.removeItem(WEBHOOK_STORAGE_KEY);
    setEndpoint("");
    showToast("saved endpoint cleared");
  };

  const toggleActive = (checked: boolean) => {
    setActive(checked);
    showToast(checked ? "deliveries reactivated 🍪" : "deliveries paused");
  };

  const endpointConfigured = endpoint.trim().length > 0;

  return (
    <div className="relative mb-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--cream)] px-[1.4rem] py-5 max-sm:px-4">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[14px] bg-[color:var(--caramel)]" />
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-bold text-[color:var(--brown)]">
          delivery endpoint
        </div>
        <div
          className={`flex items-center gap-[5px] rounded-full border px-[10px] py-[3px] font-[var(--font-dm-mono)] text-[10px] ${endpointConfigured && active ? "border-[#52B788] bg-[#E8F5EF] text-[color:var(--green)]" : "border-[color:var(--caramel-light)] bg-[#FEF3E2] text-[#8B4513]"}`}
          id="statusPill"
        >
          <div
            className={`h-[6px] w-[6px] shrink-0 rounded-full ${endpointConfigured && active ? "bg-[color:var(--green)] animate-[pulse_1.4s_infinite]" : "bg-[color:var(--caramel)]"}`}
          />
          {endpointConfigured ? (active ? "active" : "paused") : "needs setup"}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[color:var(--border-light)] bg-white px-3 py-2 max-sm:flex-col">
        <input
          className="min-w-0 flex-1 bg-transparent font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] outline-none placeholder:text-[color:var(--muted)] max-sm:w-full"
          value={endpoint}
          onChange={(event) => setEndpoint(event.target.value)}
          placeholder="https://your-app.com/webhooks/jobs"
          aria-label="Delivery endpoint"
        />
        <button
          className="rounded-[7px] border border-[color:var(--border)] bg-transparent px-3 py-[5px] font-[var(--font-dm-mono)] text-[10px] whitespace-nowrap text-[color:var(--brown-mid)] transition hover:bg-[color:var(--cream-dark)] max-sm:w-full"
          onClick={saveEndpoint}
        >
          save
        </button>
        <button
          className="rounded-[7px] border border-[color:var(--border)] bg-transparent px-3 py-[5px] font-[var(--font-dm-mono)] text-[10px] whitespace-nowrap text-[color:var(--brown-mid)] transition hover:bg-[color:var(--cream-dark)] max-sm:w-full"
          onClick={clearEndpoint}
        >
          clear
        </button>
      </div>
      <div className="font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
        Freshbatch sends each matching job payload to the endpoint you configure here.
      </div>

      <div className="mt-5 mb-3 border-b border-dashed border-[color:var(--border-light)] pb-[0.4rem] font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1px] text-[color:var(--muted)]">
        delivery settings
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[color:var(--border-light)] py-3">
        <div>
          <div className="text-[13px] font-bold text-[color:var(--brown)]">deliveries active</div>
          <div className="mt-0.5 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
            pause this to stop all deliveries
          </div>
        </div>
        <ToggleSwitch defaultChecked={active} onChange={toggleActive} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[color:var(--border-light)] py-3">
        <div>
          <div className="text-[13px] font-bold text-[color:var(--brown)]">internships</div>
          <div className="mt-0.5 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
            summer &amp; co-op roles
          </div>
        </div>
        <ToggleSwitch defaultChecked={true} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-dashed border-[color:var(--border-light)] py-3">
        <div>
          <div className="text-[13px] font-bold text-[color:var(--brown)]">new grad roles</div>
          <div className="mt-0.5 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
            full-time entry level
          </div>
        </div>
        <ToggleSwitch defaultChecked={true} />
      </div>

      <div className="flex items-center justify-between gap-3 py-3">
        <div>
          <div className="text-[13px] font-bold text-[color:var(--brown)]">remote only</div>
          <div className="mt-0.5 font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
            filter out on-site listings
          </div>
        </div>
        <ToggleSwitch defaultChecked={false} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 max-sm:flex-col">
        <a
          href="/dashboard/test"
          className={`${buttonBase} ${endpointConfigured ? "bg-[color:var(--caramel)] text-white hover:bg-[color:var(--brown-mid)]" : secondaryButton} no-underline max-sm:w-full max-sm:text-center`}
        >
          🧪 test fire webhook
        </a>
        <button
          className={`${buttonBase} ${secondaryButton} max-sm:w-full`}
          onClick={saveEndpoint}
        >
          💾 save endpoint
        </button>
      </div>
    </div>
  );
}
