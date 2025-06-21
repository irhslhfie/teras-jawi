import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

// Hook untuk mengambil semua data pembelian yang statusnya 'Pending'
export const useGetPendingPurchases = () => {
  const { data, isSuccess, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pending-purchases"],
    queryFn: async () => {
      // PERBAIKAN: Endpoint diubah dari "/purchases/pending" menjadi "/purchases"
      // agar sesuai dengan yang ada di backend.
      const response = await api.get("/purchases");
      return response.data.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Gagal mengambil data verifikasi pembelian"
      );
    },
  });

  return { data, isSuccess, isLoading, isError, error, refetch };
};

// Hook untuk mengambil histori pembelian
export const useGetPurchaseHistory = (startDate, endDate, propertyType) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["purchase-history", startDate, endDate, propertyType],
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
  return { data, isLoading, isError, error, refetch };
};

// Hook untuk mengkonfirmasi pembelian (untuk pembelian 'Cash')
export const useConfirmPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.patch(`/purchases/confirm/${purchaseId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Pembelian berhasil dikonfirmasi.");
      queryClient.invalidateQueries({ queryKey: ["pending-purchases"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengkonfirmasi pembelian."
      );
    },
  });
};

// Hook untuk membatalkan pembelian
export const useCancelPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.patch(`/purchases/cancel/${purchaseId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.info(data.message || "Pembelian telah dibatalkan.");
      queryClient.invalidateQueries({ queryKey: ["pending-purchases"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal membatalkan pembelian."
      );
    },
  });
};

/**
 * Hook untuk mengkonfirmasi pembelian via KPR.
 * Mengirim data KPR untuk dihitung dan dibuat jadwalnya oleh backend.
 */
export const useConfirmKprPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ purchaseId, kprData }) => {
      // kprData akan berisi { down_payment, annual_interest_rate, tenor_years }
      const response = await api.post(
        `/purchases/confirm-kpr/${purchaseId}`,
        kprData
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Pembelian KPR berhasil dikonfirmasi.");
      queryClient.invalidateQueries({ queryKey: ["pending-purchases"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengkonfirmasi KPR.");
    },
  });
};
