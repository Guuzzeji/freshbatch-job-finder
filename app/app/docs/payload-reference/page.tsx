import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "freshbatch docs — Payload Reference",
  description:
    "Full field-by-field reference for the Freshbatch webhook payload, including types and descriptions.",
};

const fields = [
  {
    name: "is_test",
    type: "boolean",
    desc: "true for dashboard-triggered test deliveries; false for live job deliveries.",
  },
  {
    name: "is_fte",
    type: "boolean",
    desc: "true when the job is classified as a full-time / new grad role.",
  },
  {
    name: "is_intern",
    type: "boolean",
    desc: "true when the job is classified as an internship or co-op role.",
  },
  {
    name: "company_name",
    type: "string",
    desc: 'Company name for the job listing (for example, "Stripe").',
  },
  {
    name: "title",
    type: "string",
    desc: 'Job title as Freshbatch received it (for example, "Software Engineer Intern").',
  },
  {
    name: "date_posted",
    type: "number",
    desc: "Integer timestamp for when the job was posted.",
  },
  {
    name: "url",
    type: "string",
    desc: "Canonical job posting URL.",
  },
  {
    name: "source",
    type: "string",
    desc: "Source identifier for where Freshbatch found the listing.",
  },
  {
    name: "degrees",
    type: "string[]",
    desc: "Degree requirements or target degree labels, if provided by the source.",
  },
  {
    name: "sponsorship",
    type: "string",
    desc: "Sponsorship status text from the source data.",
  },
  {
    name: "locations",
    type: "string[]",
    desc: "One or more locations attached to the listing.",
  },
  {
    name: "category",
    type: "string",
    desc: "Freshbatch job category slug for the listing.",
  },
] as const;

const examplePayload = {
  data: [
    {
      is_test: true,
      is_fte: true,
      is_intern: false,
      company_name: "Example Company",
      title: "Software Engineer, New Grad",
      date_posted: 1700000000,
      url: "https://example.com/jobs/software-engineer-new-grad",
      source: "example-source",
      degrees: ["bs", "ms"],
      sponsorship: "does not sponsor",
      locations: ["Remote", "San Francisco, CA"],
      category: "software-engineering",
    },
  ],
};

export default function PayloadReferencePage() {
  return (
    <article>
      <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
        reference
      </div>
      <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
        Payload Reference
      </h1>
      <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        Every delivery is a POST request with{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          Content-Type: application/json
        </code>{" "}
        and a{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          webhook-signature
        </code>{" "}
        header. The body is a transport wrapper that contains a{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">data</code>{" "}
        array of one or more job objects serialized from Freshbatch&apos;s
        runtime{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">
          JobInformation.to_json()
        </code>{" "}
        contract.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Request structure
      </h2>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre>{`POST {your-endpoint}
Content-Type: application/json
webhook-signature: <hmac-sha256-hex>

{ "data": [ ...JobObject ] }`}</pre>
      </div>
      <p className="mt-3 text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
        Freshbatch signs the contents of{" "}
        <code className="font-[var(--font-dm-mono)] text-[13px]">data</code>,
        then sends that same array inside the outer JSON object.
      </p>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        JobObject fields
      </h2>
      <div className="mt-4 overflow-x-auto rounded-[20px] border border-[color:var(--border-light)]">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--border-light)] bg-[#fffaf1]">
              <th className="px-4 py-3 text-left font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.2px] text-[color:var(--caramel)]">
                Field
              </th>
              <th className="px-4 py-3 text-left font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.2px] text-[color:var(--caramel)]">
                Type
              </th>
              <th className="px-4 py-3 text-left font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.2px] text-[color:var(--caramel)]">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border-light)]">
            {fields.map((field) => (
              <tr key={field.name}>
                <td className="px-4 py-3 font-[var(--font-dm-mono)] text-[12px] text-[color:var(--brown)]">
                  {field.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-[var(--font-dm-mono)] text-[12px] text-[color:var(--brown-mid)]">
                  {field.type}
                </td>
                <td className="px-4 py-3 text-[13px] leading-[1.6] text-[color:var(--brown-mid)]">
                  {field.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Example payload
      </h2>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-[color:var(--border-light)] bg-[#2E1505] p-4 font-[var(--font-dm-mono)] text-[12px] leading-[1.8] text-[#FDF6EC]">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(examplePayload, null, 2)}
        </pre>
      </div>

      <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
        Best practices
      </h2>
      <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
        <li>
          — Return{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">2xx</code>{" "}
          quickly. Process jobs asynchronously if needed.
        </li>
        <li>
          — Iterate over every item in{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            body.data
          </code>
          ; a single delivery can contain more than one job.
        </li>
        <li>
          — Handle duplicate{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            is_test: true
          </code>{" "}
          events safely — you may send multiple tests during setup.
        </li>
        <li>
          — Log or persist the full job object if you need a forensic trail.
          Avoid lossy field remapping before verification.
        </li>
      </ul>

      <div className="mt-8 rounded-[20px] border border-[color:var(--border-light)] bg-white/80 p-5">
        <p className="text-[14px] leading-[1.7] text-[color:var(--brown-mid)]">
          The{" "}
          <code className="font-[var(--font-dm-mono)] text-[13px]">
            webhook-signature
          </code>{" "}
          header is described in detail in{" "}
          <Link
            href="/docs/signature-verification"
            className="font-semibold text-[color:var(--brown)] hover:underline"
          >
            Signature Verification
          </Link>
        </p>
      </div>
    </article>
  );
}
