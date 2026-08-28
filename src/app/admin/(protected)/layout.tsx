import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Menu items" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/locations", label: "Locations" },
] as const;

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex gap-5 text-sm font-medium">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink-soft hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <button type="submit" className="text-sm text-ink-soft hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </>
  );
}
