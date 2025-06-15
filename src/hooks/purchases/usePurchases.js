import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetPendingPurchases = () => {
  return useQuery({
    queryKey: ["purchases-pending"],
    queryFn: async () => {
      const response = await api.get(`/purchases/pending`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error("Error fetching pending purchases");
      console.error(error);
    },
  });
};

export const useGetPurchaseHistory = (startDate, endDate, propertyType) => {
  return useQuery({
    queryKey: ["purchases-history", startDate, endDate, propertyType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate)
        params.append("start_date", startDate.format("YYYY-MM-DD"));
      if (endDate) params.append("end_date", endDate.format("YYYY-MM-DD"));
      if (propertyType) params.append("property_type", propertyType);

      const response = await api.get(`/purchases/history?${params.toString()}`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error("Error fetching purchase history");
      console.error(error);
    },
  });
};

export const useConfirmPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.put(`/purchases/${purchaseId}/confirm`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Purchase confirmed successfully");
      queryClient.invalidateQueries("purchases-pending");
    },
    onError: (error) => {
      toast.error("Error confirming purchase");
      console.error(error);
    },
  });
};

export const useCancelPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (purchaseId) => {
      const response = await api.put(`/purchases/${purchaseId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Purchase cancelled successfully");
      queryClient.invalidateQueries("purchases-pending");
    },
    onError: (error) => {
      toast.error("Error cancelling purchase");
      console.error(error);
    },
  });
};
