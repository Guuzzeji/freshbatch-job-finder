import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs - Discord Integration",
  description:
    "Showcase of the Freshbatch Discord notification bot example, including architecture, setup, and repository link.",
};

const envExample = `PORT=3232
WEBHOOK_SECRET=your_shared_secret
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
SERVER_URL=http://localhost:3232`;

const runCommands = `bun install
bun run server

# In a separate terminal (with server running)
bun run mock-test`;

const requestShape = `{
	"data": [
		{
			"title": "...",
			"url": "...",
			"company_name": "...",
			"is_fte": true,
			"is_intern": false,
			"is_test": true,
			"date_posted": 1704067200000,
			"source": "freshbatch-test",
			"degrees": ["BS Computer Science"],
			"sponsorship": "Available",
			"locations": ["Remote"],
			"category": "Engineering"
		}
	]
}`;

export default function IntegrationsDiscordPage() {
  return (
    <article>
      <div className="mb-3 font-(--font-dm-mono) text-[10px] uppercase tracking-[1.4px] text-(--caramel)">
        integrations
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Discord Notification Bot
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-(--brown-mid)">
        This example receives Freshbatch webhook payloads, verifies the HMAC
        signature, and forwards job listings to a Discord channel using webhook
        embeds.
      </p>

      <div className="mt-6 rounded-[20px] border border-(--border-light) bg-white/80 p-5 shadow-[4px_4px_0_#E8D0B0]">
        <div className="font-(--font-dm-mono) text-[10px] uppercase tracking-[1.4px] text-(--caramel)">
          github
        </div>
        <p className="mt-2 text-[14px] leading-[1.7] text-(--brown-mid)">
          Full source code and Docker setup live in this public repository:
          {"  "}
          <Link
            href="https://github.com/Guuzzeji/freshbatch-discord-notification-bot"
            target="_blank"
            rel="noreferrer"
            className="ml-1 font-semibold text-(--brown) hover:underline"
          >
            Open GitHub Repository
          </Link>
        </p>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        How it works
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- POST requests are received on /webhook.</li>
        <li>
          - The webhook-signature header is validated with WEBHOOK_SECRET.
        </li>
        <li>
          - Incoming jobs are normalized and formatted into Discord embeds.
        </li>
        <li>- A message is delivered via Discord webhook URL.</li>
      </ul>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Project structure
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- server.ts handles Express routes and webhook endpoint logic.</li>
        <li>
          - utils.ts contains signature verification and key sorting helpers.
        </li>
        <li>
          - discord-webhook.ts builds embeds and posts with discord.js
          WebhookClient.
        </li>
        <li>- call-hook.test.ts sends a signed local mock request.</li>
      </ul>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Environment variables
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{envExample}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Run locally
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{runCommands}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Expected request shape
      </h2>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap wrap-break-word">
          {requestShape}
        </pre>
      </div>

      <div className="mt-8 rounded-[20px] border border-(--border-light) bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-(--brown-mid)">
          Keep signature verification aligned with the canonicalization strategy
          in Freshbatch docs:
        </p>
        <div className="mt-2">
          <Link
            href="/docs/signature-verification/typescript"
            className="font-semibold text-(--brown) hover:underline"
          >
            Signature Verification - TypeScript
          </Link>
        </div>
      </div>
    </article>
  );
}
