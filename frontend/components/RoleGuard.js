"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleGuard({ allowedRoles, children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // stored on login

    if (!token || !allowedRoles.includes(role)) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router, allowedRoles]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
