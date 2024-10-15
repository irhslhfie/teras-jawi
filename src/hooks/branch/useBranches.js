import { api } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetBranchAll = (props) => {
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["branch-all"],
        queryFn: async () => {
            const response = await api.get(`/branch`);
            const data = response.data;
            console.log('cek data branch----', data)
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data branch Sukses ----', data);
        },
        onError: (error) => {
            toast.error(error.response.data.response.message);
            console.log('Error Get Data');
            console.log(error);
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
        refetchOnMount: true,
    });

    const result = data?.data || [];
    return { data: result, isSuccess, isLoading, error, refetch };
};

export const useGetBranchById = (props) => {
    const { branch_id } = props;
    const { data, isSuccess, isLoading, error } = useQuery({
        queryKey: [`Branch-By-Id-${branch_id}`],
        queryFn: async () => {
            console.log(`/branch/${branch_id}`, '----okk')
            const response = await api.get(`/branch/${branch_id}`);
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


export const useCreateBranche = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newBranche) => {
            console.log("NEW branche --", newBranche)
            const response = await api.post('/branch', newBranche);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Data Cabang berhasil ditambahkan');
            queryClient.invalidateQueries('branch-all');
            console.log('Post Data Branch Sukses ----', data);
        },
        onError: (error) => {
            toast.error('Terjadi kesalahan saat menambahkan data Cabang');
            console.log('Error Post Data');
            console.log(error.response.data);
        }
    });

    return mutation;
};

export const useUpdateBranch = (props) => {
    const { branch_id } = props;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updateBranch) => {
            console.log("Update Cabang--", updateBranch)
            const response = await api.put(`/branch/${branch_id}`, updateBranch);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Sukses memperbarui data cabang");
            console.log("Success Update branch");
            console.log(data);
            queryClient.invalidateQueries('branch-all');
            return data;
        },
        onError: (error) => {
            toast.warning("Error Update Cabang");
            console.log("Error Update branch");
            console.log(error);
        },
    });
    return mutation;
};

export const useDeleteBranch = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (branch_id) => {
            const response = await api.delete(`/branch/${branch_id}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Sukses menghapus data cabang");
            console.log("success");
            queryClient.invalidateQueries('branch-all');
            return data;
        },
        onError: (error) => {
            toast.error("Tidak bisa hapus data Cabang");
            console.log(error);
        },
    });
    return mutation;
};