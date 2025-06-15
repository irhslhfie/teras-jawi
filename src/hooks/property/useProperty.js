import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetPropertyAll = (props) => {
  const { property_name, type_name, type_id } = props; // Tambahkan type_id dari props
  const { data, isSuccess, isLoading, error, refetch } = useQuery({
    queryKey: ["property-all", { property_name, type_name, type_id }], // Tambahkan dependency untuk queryKey
    queryFn: async () => {
      let queryParams = "";

      if (property_name) {
        queryParams += `?property_name=${encodeURIComponent(property_name)}`;
      }

      if (type_name) {
        queryParams += queryParams
          ? `&type_name=${encodeURIComponent(type_name)}`
          : `?type_name=${encodeURIComponent(type_name)}`;
      }

      if (type_id && type_id !== null) {
        queryParams += queryParams
          ? `&type_id=${encodeURIComponent(type_id)}`
          : `?type_id=${encodeURIComponent(type_id)}`;
      }

      const response = await api.get(`/property${queryParams}`);
      const data = response.data;
      console.log("cek data property----", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Get Data property Sukses ----", data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
      console.log("Error Get Data");
      console.log(error);
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  const result = data?.data || [];
  return { data: result, isSuccess, isLoading, error, refetch };
};

export const useGetPropertyById = (props) => {
  const { property_id } = props;
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: [`Property-By-Id-${property_id}`],
    queryFn: async () => {
      console.log(`/property/${property_id}`, "----okk");
      const response = await api.get(`/property/${property_id}`);
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

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProperty) => {
      console.log("NEW property--", newProperty);
      const response = await api.post("/property", newProperty);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data Property berhasil ditambahkan");
      queryClient.invalidateQueries("property-all");
      console.log("Post Data Property Sukses ----", data);
    },
    onError: (error) => {
      toast.error("Terjadi kesalahan saat menambahkan data Property");
      console.log("Error Post Data");
      console.log(error.response.data);
    },
  });

  return mutation;
};

export const useUpdateProperty = (props) => {
  const { property_id } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updateProperty) => {
      console.log("Update PS--", updateProperty);
      const response = await api.put(
        `/property/${property_id}`,
        updateProperty
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Success Update Property");
      console.log("Success Update Property");
      console.log(data);
      queryClient.invalidateQueries("property-all");
      return data;
    },
    onError: (error) => {
      toast.warning("Error Update Property");
      console.log("Error Update Property");
      console.log(error);
    },
  });
  return mutation;
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (property_id) => {
      const response = await api.delete(`/property/${property_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Success Delete Property");
      console.log("success");
      queryClient.invalidateQueries("property-all");
      return data;
    },
    onError: (error) => {
      toast.error("Tidak bisa hapus data Property");
      console.log(error);
    },
  });
  return mutation;
};
