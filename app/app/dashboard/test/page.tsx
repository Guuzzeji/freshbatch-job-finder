import {
  getWebhookLogsForCurrentUser,
  getWebhookSettingsForCurrentUser,
} from "@/app/dashboard/actions";
import TestFireClient from "./TestFireClient";

export default async function TestFirePage() {
  const [initialWebhook, initialLogs] = await Promise.all([
    getWebhookSettingsForCurrentUser(),
    getWebhookLogsForCurrentUser(true),
  ]);

  return <TestFireClient initialWebhook={initialWebhook} initialLogs={initialLogs} />;
}
