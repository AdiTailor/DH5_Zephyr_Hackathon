"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar({ user, alias }: { user: User; alias: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/community", label: "Community" },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              MindSpace
            </Link>
            <nav className="hidden md:flex gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {alias}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}