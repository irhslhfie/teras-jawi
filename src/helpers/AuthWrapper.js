"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthWrapper = ({ children, allowedRoles }) => {
  const router = useRouter();
  const role = typeof window !== "undefined" && localStorage.getItem("role");

  useEffect(() => {
    if (!role) {
      router.push("/auth/signin");
    } else {
      const data = JSON.parse(role);
      if (!allowedRoles.includes(data)) {
        router.push("/unauthorized");
      }
    }
  }, [role, allowedRoles, router]);

  return <>{children}</>;
};

export default AuthWrapper;
