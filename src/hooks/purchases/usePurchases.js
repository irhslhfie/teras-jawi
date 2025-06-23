import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useGetPendingPurchases = () => {
  return useQuery({
    queryKey: ["purchases-pending"],
    queryFn: async () => {
      const response = await api.get("/purchases");
      return response.data.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengambil data verifikasi."
      );
    },
  });
};

export const useGetPurchaseHistory = (startDate, endDate, propertyType) => {
  return useQuery({
    queryKey: ["purchases-history", startDate, endDate, propertyType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (propertyType) params.append("property_type", propertyType);
      const response = await api.get(`/purchases/history?${params.toString()}`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengambil histori pembelian."
      );
    },
  });
};

export const useConfirmPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.patch(`/purchases/confirm/${purchaseId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Pembelian berhasil dikonfirmasi.");
      queryClient.invalidateQueries({ queryKey: ["purchases-pending"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengkonfirmasi pembelian."
      );
    },
  });
};

export const useCancelPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.patch(`/purchases/cancel/${purchaseId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.info(data.message || "Pembelian telah dibatalkan.");
      queryClient.invalidateQueries({ queryKey: ["purchases-pending"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal membatalkan pembelian."
      );
    },
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (newPurchase) => {
      const response = await api.post("/purchases", newPurchase);
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Permintaan pembelian berhasil dikirim! Anda akan dialihkan ke halaman profil."
      );
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengajukan pembelian."
      );
    },
  });
};
