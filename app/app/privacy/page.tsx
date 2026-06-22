import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <PublicNavbar variant="legal" />
      <main className="mx-auto max-w-[820px] px-6 py-12 max-sm:px-5">
        <article>
          <div className="mb-3 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-[1.4px] text-[color:var(--caramel)]">
            privacy policy
          </div>
          <h1 className="text-[2rem] font-black tracking-[-1px] leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[15px] leading-[1.7] text-[color:var(--muted)]">
            Last Updated: June 2026
          </p>

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            1. Information We Collect
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch collects your GitHub profile, email, webhook URL, job-type preferences, and delivery logs to operate the service. We do not collect anything beyond what is needed.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            When you sign in with GitHub OAuth, we receive your GitHub profile information including your name, email address, and avatar URL. You provide your webhook endpoint URL so we can deliver job listings to you. You select job-type preferences — such as internships and new grad roles — to tailor deliveries. We log webhook delivery attempts including timestamps, HTTP status codes, and the job payloads transmitted. We do not collect or store your GitHub password or any other credentials; authentication is handled entirely by GitHub.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            2. How We Use Your Information
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Your data powers webhook deliveries, helps us improve the service, and lets us communicate with you. We do not use it for anything else.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            We use the information we collect for the following purposes: (a) operating the webhook delivery service and sending job listings to your configured endpoint; (b) improving, debugging, and maintaining the reliability of the service; (c) sending you service-related communications, such as delivery confirmations or account updates; (d) complying with applicable legal obligations; and (e) enforcing our Terms of Service and protecting the security of the platform.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We use a session cookie to keep you signed in, functional cookies for preferences, and Google Analytics to understand site usage. No advertising or third-party tracking cookies.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch uses a Better Auth HTTP-only session cookie, which is essential for authentication and keeping you signed in during your visit. We may use functional cookies to remember your preferences across sessions. Google Analytics is used to collect aggregated, anonymous usage statistics such as page views and session duration; Google Analytics may set its own cookies for this purpose. We do not use advertising cookies, third-party tracking cookies, or any form of cross-site tracking. You can disable cookies through your browser settings at any time, though some features of the service may not function properly without them.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            4. How We Share Information
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We share data with GitHub for authentication, Google for analytics, and your own webhook endpoint because you asked us to. We do not sell data.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            Your information may be shared in the following limited circumstances: with GitHub as our OAuth provider, solely to complete the authentication handshake; with Google Analytics, which receives aggregated, anonymized usage data; and with your configured webhook endpoint, to which we deliver job listing payloads per your explicit configuration. Our hosting and infrastructure are self-hosted using PostgreSQL and Redis. We do not sell, rent, or trade your personal information to any third party. For California residents under the CCPA, freshbatch does not sell or share personal information for cross-context behavioral advertising.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            5. Data Retention
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We keep your data as long as your account is active. When you delete your account, we delete your personal data within 30 days unless the law requires us to keep it.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            We retain your personal information for as long as your account remains active and as needed to provide the service to you. Upon account deletion, we will delete your personal data within 30 days. Webhook delivery logs may be retained in anonymized or aggregated form for operational analytics after account deletion, but such data will no longer be associated with your identity. Exceptions to our deletion policy apply where retention is necessary to comply with a legal obligation, to protect the security of the service, or to resolve a dispute.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            6. Data Security
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We use HMAC signing for webhook deliveries, SSRF protection, and avoid logging personal data. No system is 100% secure, but we take reasonable precautions.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            We implement a range of technical and organizational measures to protect your data. Webhook deliveries are signed with HMAC-SHA256 so you can verify their authenticity. Outbound webhook requests include SSRF protection to prevent abuse. Our server logs are configured to exclude personal identifiers such as email addresses or full names. Database connections are encrypted, and authentication is handled exclusively through session-based tokens — we never store or transmit plaintext passwords. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            7. Your GDPR Rights (EU/EEA Users)
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              EU users can access, correct, delete, export, restrict, or object to processing of their data. Contact us to exercise any right.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            If you are located in the European Union or European Economic Area, you have the following rights under the General Data Protection Regulation (GDPR): the right of access to your personal data (Article 15), the right to rectification of inaccurate data (Article 16), the right to erasure — also known as the right to be forgotten (Article 17), the right to restriction of processing (Article 18), the right to data portability (Article 20), and the right to object to processing (Article 21). Our legal bases for processing include contractual necessity for the core service, legitimate interest for service improvement and security, and consent where applicable for cookies and analytics. To exercise any of these rights, contact us at @guuzzeji. We will respond within 30 days. You also have the right to lodge a complaint with your local supervisory authority.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            8. Your CCPA Rights (California Users)
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              California users can know what we collect, delete their data, opt out of sales (we do not sell), and will not be discriminated against for exercising rights.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            Under the California Consumer Privacy Act (CCPA), California residents have the following rights: the right to know the categories and specific pieces of personal information we have collected about you; the right to request deletion of your personal information; the right to opt out of the sale or sharing of your personal information — freshbatch does not sell or share personal information for cross-context behavioral advertising; and the right not to be discriminated against for exercising any of these rights. To submit a verifiable consumer request, contact us at @guuzzeji. We will verify your identity before processing any request.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            9. Children&apos;s Privacy
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch is for users 13 and older. We do not knowingly collect data from children under 13. Parents, contact us if you believe we have collected your child&apos;s data.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch complies with the Children&apos;s Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under the age of 13. If we discover that we have inadvertently collected such information, we will promptly delete it. GitHub OAuth, which we use for account creation, imposes its own age requirements. Minors between the ages of 13 and the age of majority in their jurisdiction may use the service only with parental consent, as described in Section 3 of our Terms of Service.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            10. International Data Transfers
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              freshbatch operates from the United States. If you are outside the US, your data is transferred and processed here. We apply the same protections regardless of location.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            freshbatch is operated from servers located in the United States. If you access the service from outside the United States, your personal data will be transferred to, stored, and processed in the United States. For users in the European Union or EEA, we process your data under the applicable legal bases described in this policy and commit to cooperating with EU data protection authorities regarding any unresolved complaints. We rely on contractual and technical safeguards to ensure your data receives an adequate level of protection regardless of where it is processed.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            11. Changes to This Privacy Policy
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              We will post updates here with a new effective date. Continued use means acceptance. Material changes get extra notice.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            We may update this Privacy Policy from time to time to reflect changes in our practices, the service, or applicable law. Updates will be posted on this page with a revised effective date. Your continued use of freshbatch after any changes take effect constitutes your acceptance of the updated policy. For material changes, we will make reasonable efforts to notify you via email or a prominent notice on the service, when feasible.
          </p>

          <hr className="border-t border-dashed border-[color:var(--border-light)] my-8" />

          <h2 className="mt-8 text-[1.25rem] font-bold tracking-[-0.5px]">
            12. Contact
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7]">
            <strong>TL;DR:</strong>{" "}
            <span className="text-[color:var(--muted)]">
              Questions or data requests? Reach out on Twitter/X at @guuzzeji.
            </span>
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--brown-mid)]">
            For questions about this Privacy Policy or to exercise any of your data rights described above, please contact us on Twitter/X at{" "}
            <a
              href="https://x.com/Guuzzeji"
              className="font-semibold text-[color:var(--brown)] hover:underline"
            >
              @guuzzeji
            </a>
            . This is the same contact as our Terms of Service. Please allow a reasonable time for a response.
          </p>
        </article>
      </main>
    </div>
  );
}
