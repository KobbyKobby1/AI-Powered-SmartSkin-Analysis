/**
 * Reads a build-time environment variable, failing loudly when it is missing.
 *
 * Next.js inlines `NEXT_PUBLIC_*` values at build time, so these are baked into
 * the static export. They are visible to anyone who opens devtools — treat them
 * as public identifiers, never as secrets. Anything that must stay secret has to
 * live behind the payment backend instead.
 */
export function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}
