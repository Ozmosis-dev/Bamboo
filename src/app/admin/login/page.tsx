import Link from "next/link";
import { signIn } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <div aria-hidden className="h-[3px] bg-bamboo-700" />
      <div className="mx-auto flex w-full max-w-md grow flex-col justify-center px-4 py-12">
        <div className="a-card px-8 py-10">
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-full-dark.png"
              alt="Bamboo on Market"
              className="h-28 w-auto"
            />
            <p className="a-eyebrow mt-5">Owner admin</p>
            <p className="mt-2 text-sm text-ink-soft">
              Sign in to update the menu, hours, photos, and page content.
            </p>
          </div>

          {error && (
            <p className="mt-6 rounded-md border border-bamboo-700/30 bg-bamboo-700/5 px-3 py-2 text-sm text-bamboo-700">
              Sign-in failed. Check email and password.
            </p>
          )}

          <form action={signIn} className="mt-7 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-md border border-line px-3 py-2.5 font-normal"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="mt-1.5 w-full rounded-md border border-line px-3 py-2.5 font-normal"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-bamboo-700 px-4 py-2.5 font-medium text-white hover:opacity-90"
            >
              Sign in
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mx-auto mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
        >
          <span aria-hidden>←</span> Return to home page
        </Link>
      </div>
    </div>
  );
}
