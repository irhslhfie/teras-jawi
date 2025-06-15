import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetTypesAll = (props) => {
  const { data, isSuccess, isLoading, error, refetch } = useQuery({
    queryKey: ["types-all"],
    queryFn: async () => {
      const response = await api.get(`/types`);
      const data = response.data;
      console.log("cek data types----", data);
      return data;
    },

    onSuccess: (data) => {
      console.log("Get Data types Sukses ----", data);
    },
    onError: (error) => {
      toast.error(error.response.data.response.message);
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

export const useGetTypesById = (props) => {
  const { type_id } = props;
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: [`Type-By-Id-${type_id}`],
    queryFn: async () => {
      console.log(`/types/${type_id}`, "----okk");
      const response = await api.get(`/types/${type_id}`);
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

export const useCreateTypes = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTypes) => {
      console.log("NEW branchs --", newTypes);
      const response = await api.post("/types", newTypes);
      return response.data;
    },

    onSuccess: (data) => {
      toast.success("Data Tipe berhasil ditambahkan");
      queryClient.invalidateQueries("types-all");
      console.log("Post Data Type Sukses ----", data);
    },
    onError: (error) => {
      toast.error("Terjadi kesalahan saat menambahkan data Cabang");
      console.log("Error Post Data");
      console.log(error.response.data);
    },
  });

  return mutation;
};

export const useUpdateTypes = (props) => {
  const { type_id } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updateTypes) => {
      console.log("Update Cabang--", updateTypes);
      const response = await api.put(`/types/${type_id}`, updateTypes);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sukses memperbarui data Type");
      console.log("Success Update type");
      console.log(data);
      queryClient.invalidateQueries("type-all");
      return data;
    },
    onError: (error) => {
      toast.warning("Error Update Type");
      console.log("Error Update type");
      console.log(error);
    },
  });
  return mutation;
};

export const useDeleteTypes = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (type_id) => {
      const response = await api.delete(`/types/${type_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sukses menghapus data Type");
      console.log("success");
      queryClient.invalidateQueries("type-all");
      return data;
    },
    onError: (error) => {
      toast.error("Tidak bisa hapus data Type");
      console.log(error);
    },
  });
  return mutation;
};
