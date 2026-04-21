export async function register() {
  // Only run in Node.js runtime — skip Edge and build phase
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { getMigrations } = await import("better-auth/db/migration");
  const { auth } = await import("@/lib/auth");

  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(
    auth.options,
  );

  if (toBeCreated.length === 0 && toBeAdded.length === 0) {
    console.log("[better-auth] db schema up to date");
    return;
  }

  console.log(
    `[better-auth] running migrations — ${toBeCreated.length} table(s) to create, ${toBeAdded.length} column(s) to add`,
  );
  await runMigrations();
  console.log("[better-auth] migrations complete ✓");
}