import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch all facilities
export const useGetFacilitiesAll = () => {
  const { data, isSuccess, isLoading, error, refetch } = useQuery({
    queryKey: ["facilities-all"],
    queryFn: async () => {
      const response = await api.get(`/facilities`);
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Get Data Facilities Sukses ----", data);
    },
    onError: (error) => {
      toast.error(error.response.data.response.message);
      console.log("Error Get Data");
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  const result = data?.data || [];
  return { data: result, isSuccess, isLoading, error, refetch };
};

// Fetch facility by ID
export const useGetFacilityById = ({ facility_id }) => {
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: [`Facility-By-Id-${facility_id}`],
    queryFn: async () => {
      const response = await api.get(`/facilities/${facility_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  const result = data?.data;
  return { data: result, isSuccess, isLoading, error };
};

// Create a new facility
export const useCreateFacility = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newFacility) => {
      const response = await api.post("/facilities", newFacility);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Data Fasilitas berhasil ditambahkan");
      queryClient.invalidateQueries("facilities-all");
      console.log("Post Data Facility Sukses ----", data);
    },
    onError: (error) => {
      toast.error("Terjadi kesalahan saat menambahkan data Fasilitas");
      console.log("Error Post Data Facility");
    },
  });

  return mutation;
};

// Update an existing facility
export const useUpdateFacility = ({ facility_id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updateFacility) => {
      const response = await api.put(
        `/facilities/${facility_id}`,
        updateFacility
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sukses memperbarui data Fasilitas");
      queryClient.invalidateQueries("facilities-all");
      return data;
    },
    onError: (error) => {
      toast.warning("Error Update Facility");
      console.log("Error Update Facility");
    },
  });

  return mutation;
};

// Delete a facility
export const useDeleteFacility = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (facility_id) => {
      const response = await api.delete(`/facilities/${facility_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sukses menghapus data Fasilitas");
      queryClient.invalidateQueries("facilities-all");
      return data;
    },
    onError: (error) => {
      toast.error("Tidak bisa hapus data Fasilitas");
      console.log(error);
    },
  });

  return mutation;
};
