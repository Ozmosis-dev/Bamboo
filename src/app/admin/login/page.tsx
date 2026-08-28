import { signIn } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold text-bamboo-800">Bamboo Admin</h1>
      {error && (
        <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          Sign-in failed. Check email and password.
        </p>
      )}
      <form action={signIn} className="mt-6 space-y-4">
        <label className="block text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded border border-line px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded border border-line px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-bamboo-700 px-4 py-2 font-medium text-white hover:bg-bamboo-800"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
