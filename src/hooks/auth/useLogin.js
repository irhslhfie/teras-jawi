import { api } from "@/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
        typeof window !== "undefined" &&
          localStorage.setItem("fullname", JSON.stringify(data.user.full_name));
        const role = JSON.parse(localStorage.getItem("role"));
        if (role === "admin") {
          setTimeout(() => {
            toast.success("Login Sukses, Selamat datang Admin 🤗")
            router.push('/');
          }, 2000);
        } else if (role === "owner") {
          setTimeout(() => {
            toast.success("Login Sukses, Selamat datang Pemilik 🤗")
            router.push('/');
          }, 2000);
        } else {
          toast.warning("Maaf hanya admin yang dapat login");
          localStorage.clear();
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

export const useRegister = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await api.post('/auth/register', newUser);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Register Berhasil Dilakukan');
      console.log('Register User Sukses ----', data);
      router.push('/auth/signin');
    },
    onError: (error) => {
      toast.error('Terjadi kesalahan saat melakukan registrasi');
      console.log('Error Post Data');
      console.log(error.response.data);
    }
  });

  return mutation;
};

const forgotPassword = async (username) => {
  const response = await api.post('/auth/forgot-password', { username });
  return response.data;
};


export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('Silahkan cek E-Mail anda untuk langkah selanjutnya!');
      console.log('Send Forgot Password Sukses');
    },
    onError: (error) => {
      toast.error('Gagal Kirim Tautan');
      console.log('Gagal Kirim Tautan : ', error);
    },
  });
};

const resetPassword = async ({ token, newPassword }) => {
  const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
  return response.data;
};

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push('/auth/signin');
      toast.success('Berhasil Reset Password');
      console.log('Reset Password Sukses');
    },
    onError: (error) => {
      toast.error('Gagal Reset Password');
      console.log('Gagal Reset Password : ', error);
    },
  });
};