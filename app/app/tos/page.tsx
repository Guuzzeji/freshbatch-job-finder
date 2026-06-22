import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <PublicNavbar variant="legal" />
      <main className="mx-auto max-w-[820px] px-6 py-12 max-sm:px-5">
        <article>
          <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
            terms of service
          </div>
          <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--muted)]">
            Last Updated: June 2026
          </p>

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            1. Acceptance of Terms
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              By using freshbatch, you agree to these terms. If you do not agree, do not use the service.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            These Terms of Service form a binding agreement between you and freshbatch. By accessing or using the website, dashboard, API, webhook deliveries, or any related service, you accept these terms and our data practices. If you are using freshbatch on behalf of an organization, you represent that you have authority to bind that organization.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            2. Description of Service
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch relays job-listing notifications to your webhook endpoint. It is not a job board and does not host listings itself.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch monitors publicly available computer science job repositories and sends notifications about newly discovered listings to subscriber-owned webhook endpoints. The service acts only as a notification relay. We do not create, endorse, screen, or verify the accuracy of any job posting. All listings originate from third-party sources.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            3. User Accounts and Registration
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Sign in with GitHub. You must be at least 13 years old, and minors need parental consent. Keep your account secure.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            Accounts are created through{" "}
            <code className="font-[var(--font-dm-mono)] text-[13px]">GitHub OAuth</code>. You must provide accurate information and maintain the security of your account credentials. You must be at least 13 years old to use freshbatch. If you are between 13 and the age of majority in your jurisdiction, you may use the service only with the consent and supervision of a parent or legal guardian. You are responsible for all activity that occurs under your account.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            4. User Webhook Endpoints and Responsibilities
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Your endpoint must be reachable and respond promptly. We sign deliveries with HMAC, but you are responsible for your own server.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            You must register a publicly reachable HTTP or HTTPS endpoint that can receive{" "}
            <code className="font-[var(--font-dm-mono)] text-[13px]">POST</code>{" "}
            requests. Your endpoint should return a successful status code quickly and handle retries responsibly. Each delivery is signed with an{" "}
            <code className="font-[var(--font-dm-mono)] text-[13px]">HMAC-SHA256</code>{" "}
            signature so you can verify it came from freshbatch. You are solely responsible for the security, availability, and lawful use of your endpoint, including verifying signatures and protecting any signing secrets.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            5. Acceptable Use
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Use freshbatch for legitimate job-seeking purposes only. Do not scrape, abuse, or overload the service.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            You may use freshbatch only for personal, educational, or legitimate job-search automation. You may not scrape, crawl, reverse engineer, interfere with, or overload the service. You may not use freshbatch to distribute spam, malware, or unsolicited communications. You may not attempt to circumvent rate limits, access accounts you do not own, or use the service for any illegal purpose.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            6. Data Collection and Privacy
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We collect your GitHub identity, webhook URL, and delivery logs needed to operate the service.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            To provide the service, freshbatch collects and stores your GitHub profile information, email address, registered webhook URL, job-type preferences, and webhook delivery logs. We retain this data only as long as necessary to operate and improve the service. You can request deletion of your account and associated data at any time. A separate privacy policy may provide additional detail.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            7. Third-Party Content and Sources
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Job listings come from public repositories. We do not verify them. Contact us if you believe content infringes your rights.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch aggregates listings from publicly available repositories and sources. We do not review, edit, or guarantee the accuracy, legality, or completeness of any listing. If you believe content delivered through freshbatch infringes your copyright or other rights, please contact us with a detailed notice, including the relevant listing and source, and we will review it under applicable law, including the Digital Millennium Copyright Act.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            8. Intellectual Property
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch owns its own code and branding. The service may rely on open-source components.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            All freshbatch branding, software, designs, logos, and content provided by us are owned by freshbatch or its licensors and are protected by intellectual property laws. You receive a limited, revocable license to use the service according to these terms. The service may incorporate open-source software, which remains subject to its own licenses.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            9. Service Availability and Modifications
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              The service is provided on a best-effort basis. We may change or discontinue features without notice.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch is provided on a best-effort, as-is basis. We do not guarantee uninterrupted, timely, secure, or error-free delivery. We reserve the right to modify, suspend, or discontinue any part of the service, temporarily or permanently, with or without notice. We are not liable for any modification, suspension, or discontinuation.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            10. Termination
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Either of us can end this agreement. We will delete your data within 30 days of account deletion, except where we must keep it by law.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            You may stop using freshbatch and delete your account at any time. We may suspend or terminate your access if you violate these terms, harm the service, or if required by law. Upon termination, we will delete your personal data within 30 days, except where retention is necessary for security, legal compliance, or dispute resolution.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            11. Disclaimers
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch comes with no warranty. We are not a job placement service. Listings may be outdated, inaccurate, or fraudulent. Always verify postings directly with the employer.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. freshbatch DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT ANY LISTING IS ACCURATE, CURRENT, COMPLETE, LEGITIMATE, OR STILL OPEN.
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch IS NOT A JOB PLACEMENT SERVICE, RECRUITER, OR EMPLOYMENT AGENCY. WE DO NOT GUARANTEE INTERVIEWS, HIRES, OR ANY SPECIFIC OUTCOME. JOB LISTINGS ARE AGGREGATED FROM PUBLIC SOURCES AND HAVE NOT BEEN VERIFIED BY US. YOU ARE SOLELY RESPONSIBLE FOR VERIFYING ANY OPPORTUNITY, EMPLOYER, DEADLINE, OR REQUIREMENT BEFORE ACTING ON IT. DO NOT SHARE SENSITIVE PERSONAL INFORMATION WITH EMPLOYERS OR POSTERS UNLESS YOU HAVE INDEPENDENTLY CONFIRMED THE LISTING IS GENUINE.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            12. Limitation of Liability
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Our total liability is capped at $100. We are not responsible for missed job opportunities or decisions you make based on listings.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            TO THE FULLEST EXTENT PERMITTED BY LAW, freshbatch AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST OPPORTUNITIES, OR MISSED JOB APPLICATIONS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATED TO THE SERVICE IS CAPPED AT ONE HUNDRED UNITED STATES DOLLARS ($100).
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            13. Indemnification
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              If your webhook misuse causes problems, you agree to cover our costs and damages.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            You agree to indemnify, defend, and hold harmless freshbatch and its operators from any claims, damages, losses, liabilities, costs, or expenses, including reasonable attorneys' fees, arising out of or related to your use of the service, your webhook endpoint, your violation of these terms, or your violation of any third-party right.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            14. Governing Law and Dispute Resolution
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              California law governs these terms, and disputes will be handled in California, USA.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Any dispute arising from these terms or your use of the service will be brought exclusively in the state or federal courts located in California. You consent to the personal jurisdiction of those courts.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            Changes to Terms
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            We may update these Terms of Service from time to time. Material changes will be posted on this page with an updated effective date. Your continued use of freshbatch after changes take effect means you accept the revised terms.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            Severability
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect. The invalid provision will be modified to the minimum extent necessary to make it valid and enforceable.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            Entire Agreement
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            These terms, together with any policies or guidelines referenced herein, constitute the entire agreement between you and freshbatch regarding the service. They supersede any prior agreements or understandings, whether written or oral.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            Contact
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            For questions about these terms, please reach out on Twitter/X at{" "}
            <a
              href="https://x.com/Guuzzeji"
              className="font-semibold text-[color:var(--brown)] hover:underline"
            >
              @guuzzeji
            </a>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
