import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { signOut } from "../actions";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

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
      <header className="border-b border-line bg-[#fffdf9]">
        <div aria-hidden className="h-[3px] bg-bamboo-700" />
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between pb-1 pt-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-mark.jpg" alt="" aria-hidden className="h-8 w-auto" />
              <p className="a-eyebrow !text-[0.74rem]">Bamboo · Admin</p>
            </div>
            <form action={signOut}>
              <button type="submit" className="text-sm text-ink-soft hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
          <AdminNav />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </>
  );
}
