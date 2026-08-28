"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasSession = Boolean(
      localStorage.getItem("authToken") || localStorage.getItem("user"),
    );
    if (!hasSession) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center text-muted-foreground"
        role="status"
      >
        Loading your career space...
      </div>
    );
  }

  return <>{children}</>;
}
