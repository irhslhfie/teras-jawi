import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetPropertyAll = (props) => {
  const { property_name, type_name, type_id } = props;
  const { data, isSuccess, isLoading, error, refetch } = useQuery({
    queryKey: ["property-all", { property_name, type_name, type_id }],
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

  return useMutation({
    mutationFn: async (newProperty) => {
      const formData = new FormData();
      formData.append("property_name", newProperty.property_name);
      formData.append("type_id", newProperty.type_id);
      formData.append("price", newProperty.price);
      formData.append("sq_meter", newProperty.sq_meter);
      formData.append("description", newProperty.description);

      // Mengubah cara append gambar
      if (newProperty.images && newProperty.images.length > 0) {
        newProperty.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await api.post("/property", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data Properti berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["property-all"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan data Properti"
      );
      console.log("Error Post Data:", error.response?.data);
    },
  });
};

export const useUpdateProperty = (props) => {
  const { property_id } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateProperty) => {
      const formData = new FormData();
      formData.append("property_name", updateProperty.property_name);
      formData.append("type_id", updateProperty.type_id);
      formData.append("price", updateProperty.price);
      formData.append("sq_meter", updateProperty.sq_meter);
      formData.append("description", updateProperty.description);
      // Hanya kirim gambar jika ada file baru yang diupload
      if (updateProperty.image && updateProperty.image instanceof File) {
        formData.append("image", updateProperty.image);
      }

      const response = await api.put(`/property/${property_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Sukses memperbarui data Property");
      queryClient.invalidateQueries({ queryKey: ["property-all"] });
      queryClient.invalidateQueries({
        queryKey: [`Property-By-Id-${property_id}`],
      });
    },
    onError: (error) => {
      toast.warning(error.response?.data?.message || "Error Update Property");
      console.log("Error Update Property:", error.response?.data);
    },
  });
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

export const useAddPropertyImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ property_id, images }) => {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      const response = await api.post(
        `/property/images/${property_id}`,
        formData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Gambar baru berhasil ditambahkan.");
      queryClient.invalidateQueries(["Property-By-Id-", variables.property_id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menambah gambar.");
    },
  });
};

// HOOK BARU untuk menghapus gambar
export const useDeletePropertyImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image_id) => {
      const response = await api.delete(`/property/images/${image_id}`);
      return response.data;
    },
    onSuccess: (data, image_id) => {
      toast.success("Gambar berhasil dihapus.");
      // Invalidate semua query properti agar daftar gambar diperbarui
      queryClient.invalidateQueries(["property-all"]);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0].startsWith("Property-By-Id-"),
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus gambar.");
    },
  });
};
