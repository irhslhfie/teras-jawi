import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

/**
 * Hook untuk mengambil daftar semua KPR yang aktif
 */
export const useGetKprList = () => {
  return useQuery({
    queryKey: ["kpr-list"],
    queryFn: async () => {
      const response = await api.get("/kpr");
      return response.data.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memuat daftar KPR.");
    },
  });
};

/**
 * Hook untuk mengambil detail informasi dari satu KPR, termasuk jadwal pembayarannya
 * @param {string} kprId - ID dari KPR yang akan diambil
 */
export const useGetKprDetail = (kprId) => {
  return useQuery({
    queryKey: ["kpr-detail", kprId],
    queryFn: async () => {
      if (!kprId) return null;
      const response = await api.get(`/kpr/${kprId}`);
      return response.data.data;
    },
    enabled: !!kprId, // Query hanya akan berjalan jika kprId ada
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memuat detail KPR.");
    },
  });
};

/**
 * Hook untuk menandai sebuah cicilan sebagai 'Lunas'
 */
export const useMarkPaymentAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId) => {
      const response = await api.patch(`/kpr/payments/${paymentId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Status pembayaran berhasil diperbarui.");
      // Invalidate query detail agar data di halaman langsung ter-refresh
      queryClient.invalidateQueries({ queryKey: ["kpr-detail"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui status.");
    },
  });
};
