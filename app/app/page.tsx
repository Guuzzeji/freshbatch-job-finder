"use client";

import { useState } from "react";
import Link from "next/link";
import Ticker from "@/components/Ticker";
import CookieBackground from "@/components/CookieBackground";
import JobCard from "@/components/JobCard";
import StepCard from "@/components/StepCard";
import { MOCK_JOBS } from "@/lib/mock-data";
import {
  getStoredWebhookEndpoint,
  isValidWebhookEndpoint,
  WEBHOOK_STORAGE_KEY,
} from "@/lib/webhook";

export default function LandingPage() {
  const [savedEndpoint] = useState(() => getStoredWebhookEndpoint());
  const [navOpen, setNavOpen] = useState(false);
  const [hookUrl, setHookUrl] = useState(savedEndpoint);
  const [hookHint, setHookHint] = useState(
    savedEndpoint
      ? "saved endpoint loaded from your last visit"
      : "paste the endpoint your agent, bot, or automation already listens on",
  );
  const [bakeText, setBakeText] = useState(
    savedEndpoint ? "saved ✓" : "bake 🧑‍🍳",
  );
  const [bakeColor, setBakeColor] = useState<string | undefined>(
    savedEndpoint ? "var(--green)" : undefined,
  );
  const navLinkClass =
    "rounded-full border border-[color:var(--border)] bg-transparent px-[14px] py-[5px] font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] transition hover:bg-[color:var(--cream-dark)]";
  const statClass =
    "flex min-w-[120px] flex-col items-center gap-1 rounded-2xl border border-[color:var(--border-light)] bg-white/80 px-4 py-3 backdrop-blur-sm";

  const saveHook = () => {
    const trimmedUrl = hookUrl.trim();

    if (!isValidWebhookEndpoint(trimmedUrl)) {
      setHookHint("enter a valid http:// or https:// webhook endpoint");
      setBakeText("try again");
      setBakeColor(undefined);
      return;
    }

    window.localStorage.setItem(WEBHOOK_STORAGE_KEY, trimmedUrl);
    setHookUrl(trimmedUrl);
    setHookHint("endpoint saved. freshbatch will deliver jobs to your URL.");
    setBakeText("saved ✓");
    setBakeColor("var(--green)");
  };

  return (
    <div className="overflow-x-hidden bg-[color:var(--cream)] text-[color:var(--brown)]">
      <nav className="relative z-10 flex items-center justify-between border-b border-dashed border-[color:var(--border)] bg-[rgba(253,246,236,0.92)] px-6 py-4 backdrop-blur-[4px]">
        <div>
          <div className="text-[22px] font-black tracking-[-1px] text-[color:var(--brown)]">
            fresh<span className="text-[color:var(--caramel)]">batch</span>
          </div>
          <div className="font-[var(--font-dm-mono)] text-[9px] uppercase tracking-[1px] text-[color:var(--caramel)]">
            cs jobs, warm &amp; ready
          </div>
        </div>
        <button
          className="flex rounded-lg border border-[color:var(--border)] px-[10px] py-[6px] text-lg text-[color:var(--brown)] sm:hidden"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          {navOpen ? "✕" : "☰"}
        </button>
        <div className="hidden items-center gap-[6px] sm:flex">
          <div className={navLinkClass}>docs</div>
          <div className={navLinkClass}>twitter/x</div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] font-[var(--font-dm-mono)] text-[11px] text-white no-underline transition hover:bg-[color:var(--brown-mid)]"
          >
            Sign In - GitHub
          </Link>
        </div>
      </nav>
      {navOpen && (
        <div className="z-20 flex flex-col gap-2 border-b border-dashed border-[color:var(--border)] bg-[color:var(--cream)] px-6 py-4 sm:hidden">
          <div className={navLinkClass}>docs</div>
          <div className={navLinkClass}>twitter/x</div>
          <Link
            href="/dashboard"
            className="rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-[14px] py-[5px] text-center font-[var(--font-dm-mono)] text-[11px] text-white no-underline transition hover:bg-[color:var(--brown-mid)]"
          >
            open dashboard
          </Link>
        </div>
      )}

      <Ticker />

      <div className="relative min-h-[81vh] overflow-hidden max-sm:min-h-[480px]">
        <CookieBackground />
        <div className="relative z-[2] mx-auto max-w-[820px] px-6 pt-12 pb-10 text-center max-sm:px-5 max-sm:pt-8 max-sm:pb-8">
          <div className="mb-6 inline-flex items-center gap-[6px] rounded-full border border-[color:var(--border)] bg-white/85 px-[14px] py-1 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)]">
            <div className="h-[7px] w-[7px] rounded-full bg-[color:var(--caramel)] animate-[pulse_1.4s_infinite]" />
            oven preheated · jobs baking now
          </div>
          <h1 className="mb-4 text-[clamp(2.2rem,6vw,4.4rem)] leading-none font-black tracking-[-2px] text-[color:var(--brown)]">
            fresh CS jobs,
            <br />
            <em className="italic text-[color:var(--caramel)]">
              hot out the oven
            </em>
          </h1>
          <p className="mx-auto mb-8 max-w-[480px] text-[15px] leading-[1.6] italic text-[color:var(--brown-mid)] max-sm:text-sm">
            Send fresh CS jobs to the webhook endpoint you already use for your
            AI agent, Discord bot, or cursed 2am automation.
          </p>

          <div className="mx-auto max-w-[560px]">
            <div className="mb-1.5 text-left font-[var(--font-dm-mono)] text-[13px] tracking-[0.5px] text-[color:var(--caramel)]">
              {"// paste your webhook endpoint"}
            </div>
            <div className="flex items-center gap-2 rounded-[14px] border-2 border-[color:var(--border)] bg-white/95 px-4 py-[10px] shadow-[4px_4px_0_#C8720A] max-sm:flex-col max-sm:gap-2.5 max-sm:p-3">
              <input
                className="min-w-0 flex-1 bg-transparent font-[var(--font-dm-mono)] text-sm text-[color:var(--brown-mid)] outline-none placeholder:text-[color:var(--muted)] max-sm:w-full"
                value={hookUrl}
                onChange={(event) => {
                  setHookUrl(event.target.value);
                  setHookHint(
                    "paste the endpoint your agent, bot, or automation already listens on",
                  );
                  setBakeText("bake 🧑‍🍳");
                  setBakeColor(undefined);
                }}
                placeholder="https://hooks.slack.com/services/..."
                aria-label="Webhook endpoint"
              />
              <button
                className={`shrink-0 whitespace-nowrap rounded-[10px] px-4 py-2 font-[var(--font-dm-mono)] text-[13px] font-medium text-white transition hover:bg-[color:var(--brown-mid)] max-sm:w-full ${bakeColor ? "bg-[color:var(--green)]" : "bg-[color:var(--caramel)]"}`}
                onClick={saveHook}
              >
                {bakeText}
              </button>
            </div>
            <div className="mt-2 text-center font-[var(--font-dm-mono)] text-[10px] text-[color:var(--muted)]">
              {hookHint}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className={statClass}>
              <span className="text-[1.4rem] font-black text-[color:var(--caramel)]">
                2,341
              </span>
              <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[0.8px] text-[color:var(--brown-mid)]">
                jobs today
              </span>
            </div>
            <div className={statClass}>
              <span className="text-[1.4rem] font-black text-[color:var(--caramel)]">
                ~1.8s
              </span>
              <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[0.8px] text-[color:var(--brown-mid)]">
                avg bake time
              </span>
            </div>
            <div className={statClass}>
              <span className="text-[1.4rem] font-black text-[color:var(--caramel)]">
                847
              </span>
              <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[0.8px] text-[color:var(--brown-mid)]">
                hungry students
              </span>
            </div>
            <div className={statClass}>
              <span className="text-[1.4rem] font-black text-[color:var(--caramel)]">
                $0
              </span>
              <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[0.8px] text-[color:var(--brown-mid)]">
                forever &amp; always
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-2 text-center text-[color:var(--border)]">• • •</div>

      <div className="mx-auto max-w-[1140px] px-6 py-6 max-sm:px-5">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          🔥 latest batch
        </div>
        <div className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black tracking-[-1.5px] text-[color:var(--brown)]">
          fresh out the oven
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MOCK_JOBS.map((job, i) => (
            <JobCard key={i} job={job} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1140px] px-6 pt-13 pb-6 max-sm:px-5">
        <div className="mb-1 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          the recipe
        </div>
        <div className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black tracking-[-1.5px] text-[color:var(--brown)]">
          stupid simple. painfully good.
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StepCard
            icon="🧑‍🍳"
            stepNum="step 01"
            title="paste your endpoint"
            description="bring the webhook URL you already trust. no generated hook required."
          />
          <StepCard
            icon="🎚️"
            stepNum="step 02"
            title="season to taste"
            description="new grad, internship, co-op. class year. remote. faang or startup. your call."
          />
          <StepCard
            icon="🤖"
            stepNum="step 03"
            title="plug into anything"
            description="discord bot, n8n, claude agent, python. we send JSON, you do the magic."
            chips={["discord", "n8n", "make", "claude"]}
          />
          <StepCard
            icon="😴"
            stepNum="the result"
            title="go touch grass"
            description="the webhook finds jobs while you sleep, go to class, or doom-scroll something else."
          />
        </div>
      </div>

      <div className="px-6 pt-8 pb-12 text-center max-sm:px-5">
        <h2 className="mb-3 text-[clamp(1.9rem,4vw,3rem)] font-black tracking-[-1.2px] text-[color:var(--brown)]">
          your batch is ready. 🍪
        </h2>
        <p className="mx-auto mb-5 max-w-[520px] text-[15px] leading-[1.6] text-[color:var(--brown-mid)]">
          stop refreshing linkedin. point freshbatch at your own endpoint and
          let the jobs come to you.
        </p>
        <Link href="/dashboard">
          <button className="rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-6 py-3 font-[var(--font-dm-mono)] text-xs tracking-[0.3px] text-white transition hover:bg-[color:var(--brown-mid)]">
            configure my endpoint →
          </button>
        </Link>
      </div>
    </div>
  );
}
