import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — n8n Workflow",
  description:
    "Connect Freshbatch to n8n with a webhook workflow and route new job listings to Google Sheets, email, Slack, and more.",
};

const installCmd = `npx n8n`;

const ngrokCmd = `ngrok http --domain=your-static-domain.ngrok-free.app 5678`;

const webhookUrl = `https://your-static-domain.ngrok-free.app/webhook/jobs`;

export default function IntegrationsN8nPage() {
  return (
    <article>
      <div className="mb-3 font-(--font-dm-mono) text-[10px] uppercase tracking-[1.4px] text-(--caramel)">
        integrations
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        n8n Workflow
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-(--brown-mid)">
        This example shows how to receive Freshbatch webhook deliveries in n8n
        and turn them into no-code automations. After the webhook is connected,
        you can route jobs to Google Sheets, send notifications, or trigger any
        other n8n node.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Prerequisites
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- Node.js installed (used by n8n and ngrok).</li>
        <li>- A free ngrok account and a static domain.</li>
        <li>- A Google account (useful for Google Sheets nodes).</li>
        <li>- A GitHub account to sign in to Freshbatch.</li>
      </ul>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Step 1 — Install n8n
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-(--brown-mid)">
        Run the n8n CLI in a terminal. It will start the editor on{" "}
        <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
          http://localhost:5678
        </code>
        .
      </p>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{installCmd}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Step 2 — Expose n8n with ngrok
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-(--brown-mid)">
        Freshbatch needs a public HTTPS URL. In a second terminal, tunnel your
        local n8n editor through the static domain you claimed in the ngrok
        dashboard.
      </p>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{ngrokCmd}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Step 3 — Create the webhook workflow
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- Open the n8n editor and create a new workflow from scratch.</li>
        <li>- Add a Webhook node and set the HTTP Method to POST.</li>
        <li>- Set the Path to jobs. This makes the listener URL:</li>
      </ul>
      <div className="mt-3 overflow-x-auto rounded-[18px] border border-(--border-light) bg-[#2E1505] p-4 font-(--font-dm-mono) text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{webhookUrl}</pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Step 4 — Connect Freshbatch
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- Sign in to Freshbatch with GitHub.</li>
        <li>- Go to Dashboard → Delivery Settings.</li>
        <li>- Paste the webhook URL into the endpoint field.</li>
        <li>- Toggle the job types you want (internships, new grad).</li>
        <li>- Save settings and use Test Fire to confirm the workflow runs.</li>
      </ul>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Next steps
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-(--brown-mid)">
        Once the webhook is flowing, add nodes after the Webhook trigger. A
        common next step is a Google Sheets node that appends each job to a
        spreadsheet. You can also branch on{" "}
        <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
          is_intern
        </code>{" "}
        or{" "}
        <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
          is_fte
        </code>{" "}
        to route internships and full-time roles differently.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Example: append jobs to Google Sheets
      </h2>
      <p className="mt-3 text-[15px] leading-[1.7] text-(--brown-mid)">
        A common follow-up is to send each Freshbatch job to a Google Sheet. n8n
        has a built-in{" "}
        <Link
          href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-(--brown) hover:underline"
        >
          Google Sheets node
        </Link>{" "}
        that supports creating spreadsheets, appending rows, updating rows,
        reading rows, clearing sheets, and more.
      </p>

      <h3 className="mt-5 text-[1rem] font-bold tracking-[-0.3px]">
        Quick steps
      </h3>
      <ul className="mt-2 space-y-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        <li>- Add a Google Sheets node after the Webhook trigger.</li>
        <li>
          - Set the operation to <strong>Append Row</strong> (or{" "}
          <strong>Append or Update Row</strong>).
        </li>
        <li>
          - Create or select Google Sheets credentials. n8n will walk you
          through OAuth authentication.
        </li>
        <li>- Choose the spreadsheet and sheet to write to.</li>
        <li>
          - Map Freshbatch fields such as{" "}
          <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
            title
          </code>
          ,{" "}
          <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
            company_name
          </code>
          ,{" "}
          <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
            url
          </code>
          , and{" "}
          <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
            date_posted
          </code>{" "}
          to the matching sheet columns.
        </li>
      </ul>

      <h3 className="mt-5 text-[1rem] font-bold tracking-[-0.3px]">
        What the Google Sheets node can do
      </h3>
      <p className="mt-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        According to n8n's docs, the node can create and delete spreadsheets,
        create and delete sheets, append or update rows, read rows, clear sheet
        data, and delete rows or columns. If the built-in operations don't cover
        what you need, you can fall back to the HTTP Request node and reuse the
        same Google Sheets credential.
      </p>

      <p className="mt-2 text-[15px] leading-[1.7] text-(--brown-mid)">
        n8n docs:{" "}
        <a
          className="font-semibold text-(--brown) hover:underline"
          href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/"
        >
          n8n-nodes-base.googlesheets
        </a>
      </p>

      <div className="mt-8 rounded-[20px] border border-(--border-light) bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-(--brown-mid)">
          This example keeps things simple and does not verify the Freshbatch
          signature. For production workflows, validate the{" "}
          <code className="rounded bg-(--cream-dark) px-1 py-0.5 font-(--font-dm-mono) text-[12px] text-(--brown)">
            webhook-signature
          </code>{" "}
          header in a Code node or HTTP Request node before processing payloads.
          See{" "}
          <Link
            href="/docs/signature-verification"
            className="font-semibold text-(--brown) hover:underline"
          >
            Signature Verification
          </Link>{" "}
          for details.
        </p>
      </div>
    </article>
  );
}
