import { api } from "@/helpers";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await api.post(
        "/auth",
        { username, password }
      );
      const data = response.data;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        typeof window !== "undefined" &&
          localStorage.setItem("token", JSON.stringify(data.token));
        typeof window !== "undefined" &&
          localStorage.setItem("role", JSON.stringify(data.user.role));
        const role = JSON.parse(localStorage.getItem("role"));
        if (role === "admin") {
          toast.success("Login Success");
          router.push("/");
        } else {
          toast.warning("Maaf hanya admin yang dapat login");
          router.push("/unauthorized")
        }
      }
      console.log('login :', data.user.role);
    },
    onError: (error) => {
      toast.error(error.response.data);
      console.log('Error Login :', error.response.data);
    },
    onSettled: () => {
      console.log("onSettled");
    },
  });
  return mutation;
};
