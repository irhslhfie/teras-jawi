import { api } from "@/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await api.post("/auth", { username, password });
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("role", JSON.stringify(data.user.role));
        localStorage.setItem("fullname", JSON.stringify(data.user.full_name));
        localStorage.setItem("user_id", JSON.stringify(data.user.user_id));

        const role = JSON.parse(localStorage.getItem("role"));
        if (role === "admin" || role === "owner" || role === "marketing") {
          toast.success(`Login Sukses, Selamat datang ${role} 🤗`);
          router.push("/dashboard");
        } else if (role === "customer") {
          toast.success("Login Sukses, Selamat datang di Teras Jawi Home 🏠");
          router.push("/");
        } else {
          toast.warning(
            "Maaf, terjadi kesalahan saat login. Silakan coba lagi."
          );
          localStorage.clear();
          router.push("/auth/signin");
        }
      }
    },
    onError: (error) => {
      toast.error(error.response?.data || "An error occurred during login");
      console.error("Error Login:", error);
    },
  });
  return mutation;
};

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/auth/signin");
  };

  return { logout };
};

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await api.post("/auth/register", newUser);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Register Berhasil Dilakukan");
      console.log("Register User Sukses ----", data);
      router.push("/auth/signin");
    },
    onError: (error) => {
      toast.error("Terjadi kesalahan saat melakukan registrasi");
      console.log("Error Post Data");
      console.log(error.response.data);
    },
  });

  return mutation;
};

const forgotPassword = async (username) => {
  const response = await api.post("/auth/forgot-password", { username });
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Silahkan cek E-Mail anda untuk langkah selanjutnya!");
      console.log("Send Forgot Password Sukses");
    },
    onError: (error) => {
      toast.error(error.response.data);
      console.log("Gagal Kirim Tautan : ", error);
    },
  });
};

const resetPassword = async ({ token, newPassword }) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push("/auth/signin");
      toast.success("Berhasil Reset Password");
      console.log("Reset Password Sukses");
    },
    onError: (error) => {
      toast.error(error.response.data);
      console.log("Gagal Reset Password : ", error);
    },
  });
};
