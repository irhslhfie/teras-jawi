import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthWrapper = ({ children, allowedRoles }) => {
  const router = useRouter();
  const token = typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/auth/signin");
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("fullname");
        router.push("/auth/signin");
      } else {
        const role = JSON.parse(localStorage.getItem("role"));
        if (!allowedRoles.includes(role)) {
          router.push("/unauthorized");
        }
      }
    }
  }, [token, allowedRoles, router]);

  return <>{children}</>;
};

export default AuthWrapper;
