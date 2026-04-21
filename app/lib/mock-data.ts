export interface Job {
  co: string;
  role: string;
  type: "intern" | "ng";
  pay: string;
  loc: string;
  yr: string;
  ago: string;
}

export interface LogEntry {
  company: string;
  role: string;
  time: string;
  type: string;
  location: string;
  status: "ok" | "warn";
  code: string;
}

export const MOCK_JOBS: Job[] = [
  { co: "Stripe", role: "Software Engineer Intern", type: "intern", pay: "$65/hr", loc: "Remote", yr: "'26", ago: "2 min ago" },
  { co: "Figma", role: "New Grad SWE", type: "ng", pay: "$185k", loc: "San Francisco", yr: "'25", ago: "11 min ago" },
  { co: "Linear", role: "Frontend Intern", type: "intern", pay: "$58/hr", loc: "Remote", yr: "'26", ago: "23 min ago" },
  { co: "Vercel", role: "Software Engineer", type: "ng", pay: "$190k", loc: "Remote", yr: "'25", ago: "34 min ago" },
  { co: "Anthropic", role: "Research Eng Intern", type: "intern", pay: "$70/hr", loc: "SF", yr: "'26", ago: "1 hr ago" },
  { co: "Cursor", role: "Full Stack Intern", type: "intern", pay: "$62/hr", loc: "NYC", yr: "'26", ago: "1 hr ago" },
];

export const MOCK_JOB_POOL: Job[] = [
  ...MOCK_JOBS,
  { co: "Notion", role: "Product Engineer Intern", type: "intern", pay: "$60/hr", loc: "San Francisco", yr: "'26", ago: "just now" },
  { co: "Databricks", role: "New Grad Software Engineer", type: "ng", pay: "$205k", loc: "Seattle", yr: "'25", ago: "4 min ago" },
  { co: "Ramp", role: "Backend Engineer Intern", type: "intern", pay: "$64/hr", loc: "NYC", yr: "'26", ago: "6 min ago" },
  { co: "Mercury", role: "Software Engineer, New Grad", type: "ng", pay: "$198k", loc: "Remote", yr: "'25", ago: "8 min ago" },
  { co: "Canva", role: "Frontend Intern", type: "intern", pay: "$57/hr", loc: "Remote", yr: "'26", ago: "12 min ago" },
  { co: "Plaid", role: "Early Career SWE", type: "ng", pay: "$192k", loc: "San Francisco", yr: "'25", ago: "14 min ago" },
  { co: "Robinhood", role: "Android Intern", type: "intern", pay: "$59/hr", loc: "Menlo Park", yr: "'26", ago: "17 min ago" },
  { co: "OpenAI", role: "Software Engineer, New Grad", type: "ng", pay: "$215k", loc: "San Francisco", yr: "'25", ago: "21 min ago" },
  { co: "Retool", role: "Infrastructure Intern", type: "intern", pay: "$61/hr", loc: "Remote", yr: "'26", ago: "25 min ago" },
  { co: "Asana", role: "New Grad Product Engineer", type: "ng", pay: "$188k", loc: "NYC", yr: "'25", ago: "28 min ago" },
  { co: "Brex", role: "Security Engineer Intern", type: "intern", pay: "$63/hr", loc: "Remote", yr: "'26", ago: "31 min ago" },
  { co: "Cloudflare", role: "Software Engineer, Early Career", type: "ng", pay: "$183k", loc: "Austin", yr: "'25", ago: "37 min ago" },
];

export const MOCK_LOGS = [
  { webhook_id: 1, created_at: new Date(Date.now() - 14 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Stripe", title: "Software Engineer Intern" }]), is_test: true },
  { webhook_id: 2, created_at: new Date(Date.now() - 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Figma", title: "New Grad SWE" }]), is_test: false },
  { webhook_id: 3, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Linear", title: "Frontend Intern" }]), is_test: false },
  { webhook_id: 4, created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), success: false, error_message: "timeout", status_code: null, jobs_payload: JSON.stringify([{ company_name: "Vercel", title: "Software Engineer" }]), is_test: false },
  { webhook_id: 5, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Anthropic", title: "Research Eng Intern" }]), is_test: false },
  { webhook_id: 6, created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Cursor", title: "Full Stack Intern" }]), is_test: false },
  { webhook_id: 7, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Vercel", title: "Frontend Intern" }]), is_test: false },
  { webhook_id: 8, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), success: true, error_message: null, status_code: 200, jobs_payload: JSON.stringify([{ company_name: "Notion", title: "SWE New Grad" }]), is_test: false },
] satisfies readonly {
  webhook_id: number;
  created_at: Date;
  success: boolean;
  error_message: string | null;
  status_code: number | null;
  jobs_payload: string | null;
  is_test: boolean;
}[];

export const MOCK_STATS = {
  totalDelivered: 142,
  lastDelivery: "14m ago",
  lastDeliveryDetail: "Stripe · intern",
  successRate: "98%",
  successRatePeriod: "last 30 days",
};

export const TEST_PAYLOAD = {
  event: "job.posted",
  type: "internship",
  company: "Stripe",
  role: "Software Engineer Intern",
  pay: "$65/hr",
  location: "Remote",
  class_year: 2026,
  apply_url: "https://stripe.com/jobs/...",
  posted_at: "2025-03-28T14:22:00Z",
  test: true,
};
