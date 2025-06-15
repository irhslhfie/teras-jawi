import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetBrochuresAll = () => {
  return useQuery({
    queryKey: ["brochures-all"],
    queryFn: async () => {
      const response = await api.get(`/brochures`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error("Error fetching brochures");
      console.error(error);
    },
  });
};

export const useGetBrochuresByUser = (user_id) => {
  return useQuery({
    queryKey: ["brochures", user_id],
    queryFn: async () => {
      console.log("Fetching brochures for user_id:", user_id);
      const response = await api.get(`/brochures/${user_id}`);
      return response.data.data; // Sesuaikan struktur response
    },
    enabled: !!user_id, // Fetch hanya berjalan jika user_id ada
    onError: (error) => {
      toast.error("Error fetching brochures: " + error.message);
    },
  });
};

export const useCreateBrochure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBrochure) => {
      const formData = new FormData();
      formData.append("brochure_title", newBrochure.brochure_title);
      formData.append("brochure_desc", newBrochure.brochure_desc);
      formData.append("user_id", newBrochure.user_id);
      formData.append("file", newBrochure.file);

      const response = await api.post("/brochures", newBrochure);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Brochure uploaded successfully");
      queryClient.invalidateQueries("brochures-all");
    },
    onError: (error) => {
      toast.error("Error uploading brochure");
      console.error(error);
    },
  });
};

export const useUpdateBrochureStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brochure_id, status }) => {
      const response = await api.put(`/brochures/${brochure_id}`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Brochure status updated successfully");
      queryClient.invalidateQueries("brochures-all");
    },
    onError: (error) => {
      toast.error("Error updating brochure status");
      console.error(error);
    },
  });
};

export const useGetMarketingUsers = () => {
  return useQuery({
    queryKey: ["marketing-users"],
    queryFn: async () => {
      const response = await api.get(`/users/marketing`);
      return response.data.data;
    },
    onError: (error) => {
      toast.error("Error fetching marketing users");
      console.error(error);
    },
  });
};

export const useDeleteBrochure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brochureId) => {
      const response = await api.delete(`/brochures/${brochureId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Brochure deleted successfully");
      queryClient.invalidateQueries("brochures-all");
    },
    onError: (error) => {
      toast.error(
        "Error deleting brochure: " +
          (error.response?.data?.message || error.message)
      );
      console.error(error);
    },
  });
};

// Add any additional hooks or utility functions as needed
