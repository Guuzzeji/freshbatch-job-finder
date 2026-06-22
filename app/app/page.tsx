"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Ticker from "@/components/Ticker";
import CookieBackground from "@/components/CookieBackground";
import JobCard from "@/components/JobCard";
import StepCard from "@/components/StepCard";
import PublicNavbar from "@/components/PublicNavbar";
import { MOCK_JOB_POOL, type Job } from "@/lib/mock-data";
import { authClient } from "@/lib/auth-client";

const HERO_STATS = [
  {
    label: "avg bake time",
    target: 1.8,
    prefix: "~",
    suffix: "s",
    decimals: 1,
  },
  {
    label: "registered job goblins",
    target: 137,
    prefix: "",
    suffix: "",
    decimals: 0,
  },
  {
    label: "student wallets harmed",
    target: 0,
    prefix: "$",
    suffix: "",
    decimals: 0,
  },
] as const;

function formatStatValue(
  value: number,
  options: { prefix: string; suffix: string; decimals: number },
) {
  const formatted =
    options.decimals > 0
      ? value.toFixed(options.decimals)
      : Math.round(value).toLocaleString();

  return `${options.prefix}${formatted}${options.suffix}`;
}

function getInitialJobs(count: number) {
  return MOCK_JOB_POOL.slice(0, count).map((job, index) => ({
    id: `${job.co}-${job.role}-${index}`,
    job,
  }));
}

export default function LandingPage() {
  const [displayedStats, setDisplayedStats] = useState(() =>
    HERO_STATS.map((stat) => formatStatValue(0, stat)),
  );
  const [jobCards, setJobCards] = useState<Array<{ id: string; job: Job }>>(
    () => getInitialJobs(6),
  );
  const { data: session } = authClient.useSession();
  const statClass =
    "motion-enter-rise motion-hover-lift motion-transition-subtle flex min-w-[120px] flex-col items-center gap-1 rounded-2xl border border-[color:var(--border-light)] bg-white/80 px-4 py-3 backdrop-blur-sm";

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();
    const durationMs = 1500;

    const tick = (now: number) => {
      const rawProgress = Math.min((now - startTime) / durationMs, 1);
      const easedProgress = 1 - (1 - rawProgress) ** 3;

      setDisplayedStats(
        HERO_STATS.map((stat) =>
          formatStatValue(stat.target * easedProgress, stat),
        ),
      );

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setJobCards((currentJobs) => {
        const nextJobs = [...currentJobs];
        const replaceIndex = Math.floor(Math.random() * nextJobs.length);
        const nextJob =
          MOCK_JOB_POOL[Math.floor(Math.random() * MOCK_JOB_POOL.length)];

        nextJobs[replaceIndex] = {
          id: `${nextJob.co}-${nextJob.role}-${Date.now()}-${replaceIndex}`,
          job: nextJob,
        };

        return nextJobs;
      });
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, []);

  const onboardingCta = session ? (
    <Link
      href="/dashboard"
      className="motion-enter-fade motion-hover-lift motion-transition-subtle inline-flex items-center justify-center rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-6 py-3 font-[var(--font-dm-mono)] text-xs tracking-[0.3px] text-white no-underline hover:bg-[color:var(--brown-mid)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
    >
      open dashboard
    </Link>
  ) : (
    <button
      onClick={() =>
        authClient.signIn.social({
          provider: "github",
          callbackURL: "/dashboard",
        })
      }
      className="motion-enter-fade motion-hover-lift motion-transition-subtle inline-flex items-center justify-center rounded-full border border-[color:var(--caramel)] bg-[color:var(--caramel)] px-6 py-3 font-[var(--font-dm-mono)] text-xs tracking-[0.3px] text-white hover:bg-[color:var(--brown-mid)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
    >
      Sign In with GitHub
    </button>
  );

  return (
    <div className="overflow-x-hidden bg-[color:var(--cream)] text-[color:var(--brown)]">
      <PublicNavbar variant="home" />

      <div className="relative min-h-[85vh] overflow-hidden max-sm:min-h-[480px]">
        <CookieBackground />
        <div className="relative z-[2] mx-auto max-w-[820px] px-6 pt-12 pb-10 text-center max-sm:px-5 max-sm:pt-8 max-sm:pb-8">
          <div
            className="motion-enter-fade mb-6 inline-flex items-center gap-[6px] rounded-full border border-[color:var(--border)] bg-white/85 px-[14px] py-1 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)]"
            style={{ animationDelay: "40ms" }}
          >
            <div className="motion-pulse-soft h-[7px] w-[7px] rounded-full bg-[color:var(--caramel)]" />
            oven preheated · jobs baking now
          </div>
          <h1
            className="motion-enter-pop mb-4 text-[clamp(2.2rem,6vw,4.4rem)] leading-none font-black tracking-[-2px] text-[color:var(--brown)]"
            style={{ animationDelay: "80ms" }}
          >
            stop refreshing job boards,
            <br />
            <em className="italic text-[color:var(--caramel)]">
              let jobs come to you
            </em>
          </h1>
          <p
            className="motion-enter-fade mx-auto mb-8 max-w-[480px] text-[15px] leading-[1.6] italic text-[color:var(--brown-mid)] max-sm:text-sm"
            style={{ animationDelay: "120ms" }}
          >
            freshbatch tracks new grad + internship openings in real time and
            routes them to your workflow after you sign in. no copy-paste setup
            on the homepage, no guessing where to start.
          </p>

          <div
            className="motion-enter-fade mx-auto mb-6 flex max-w-[560px] flex-col items-center gap-3 rounded-[14px] border-2 border-[color:var(--border)] bg-white/95 px-4 py-4 shadow-[4px_4px_0_var(--caramel)]"
            style={{ animationDelay: "160ms" }}
          >
            <div className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.5px] text-[color:var(--caramel)]">
              {"// onboarding in under a minute"}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-[6px]">
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--cream-dark)] px-[10px] py-[4px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
                github sign-in
              </span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--cream-dark)] px-[10px] py-[4px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
                tune filters
              </span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--cream-dark)] px-[10px] py-[4px] font-[var(--font-dm-mono)] text-[10px] text-[color:var(--brown-mid)]">
                connect webhook once
              </span>
            </div>
            {onboardingCta}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
            {HERO_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={statClass}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="text-[1.4rem] font-black text-[color:var(--caramel)]">
                  {displayedStats[index]}
                </span>
                <span className="font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[0.8px] text-[color:var(--brown-mid)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-2 text-center text-[color:var(--border)]">• • •</div>

      <div className="mx-auto max-w-[1140px] px-6 py-6 max-sm:px-5">
        <div className="mb-1 flex items-center gap-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.5px] text-[color:var(--caramel)]">
          <span>🔥 latest batch</span>
        </div>
        <div className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black tracking-[-1.5px] text-[color:var(--brown)]">
          fresh out the oven
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {jobCards.map(({ id, job }, index) => (
            <div
              key={id}
              className="motion-enter-fade"
              style={{ animationDelay: `${250}ms` }}
            >
              <JobCard job={job} />
            </div>
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
          <div
            className="motion-enter-fade motion-hover-lift motion-transition-subtle"
            style={{ animationDelay: "80ms" }}
          >
            <StepCard
              icon="🧑‍🍳"
              stepNum="step 01"
              title="sign in + open dashboard"
              description="start with github auth, then configure everything from one clear home base."
            />
          </div>
          <div
            className="motion-enter-fade motion-hover-lift motion-transition-subtle"
            style={{ animationDelay: "140ms" }}
          >
            <StepCard
              icon="🧂"
              stepNum="step 02"
              title="season to taste"
              description="new grad, internship, co-op. class year. remote. faang or startup. your call."
            />
          </div>
          <div
            className="motion-enter-fade motion-hover-lift motion-transition-subtle"
            style={{ animationDelay: "200ms" }}
          >
            <StepCard
              icon="🤖"
              stepNum="step 03"
              title="plug into anything"
              description="discord bot, n8n, claude agent, python. we send JSON, you do the magic."
              chips={["discord", "n8n", "make", "claude"]}
            />
          </div>
          <div
            className="motion-enter-fade motion-hover-lift motion-transition-subtle"
            style={{ animationDelay: "260ms" }}
          >
            <StepCard
              icon="😴"
              stepNum="the result"
              title="go touch grass"
              description="the webhook finds jobs while you sleep, go to class, or doom-scroll something else."
            />
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 pb-12 text-center max-sm:px-5">
        <h2 className="mb-3 text-[clamp(1.9rem,4vw,3rem)] font-black tracking-[-1.2px] text-[color:var(--brown)]">
          your batch is ready. 🍪
        </h2>
        <p className="mx-auto mb-5 max-w-[520px] text-[15px] leading-[1.6] text-[color:var(--brown-mid)]">
          freshbatch keeps your job feed warm while you do literally anything
          else. onboarding starts in the dashboard.
        </p>
        <Link
          href="/docs"
          className="motion-enter-fade motion-hover-lift motion-transition-subtle inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/85 px-5 py-2 font-[var(--font-dm-mono)] text-[11px] text-[color:var(--brown-mid)] no-underline hover:bg-[color:var(--cream-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--caramel)]"
          style={{ animationDelay: "120ms" }}
        >
          read the docs first
        </Link>
      </div>
    </div>
  );
}
