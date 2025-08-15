"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/admin", label: "Admin Dashboard" },
    { href: "/dashboard/teacher", label: "Teacher Dashboard" },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-2 rounded ${
              pathname === link.href ? "bg-blue-700" : "hover:bg-blue-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
