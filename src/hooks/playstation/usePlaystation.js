import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetPlaystationAll = (props) => {
    const { ps_type, branch_name } = props;
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["playstation-all"],
        queryFn: async () => {
            let queryParams = '';

            if (ps_type) {
                queryParams += `?ps_type=${ps_type}`;
            }

            if (branch_name) {
                queryParams += queryParams ? `&branch_name=${branch_name}` : `?branch_name=${branch_name}`;
            }

            const response = await api.get(`/playstation${queryParams}`);
            const data = response.data;
            console.log('cek data playstation----', data)
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data playstation Sukses ----', data);
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

export const useGetPlaystationById = (props) => {
    const { ps_id } = props;
    const { data, isSuccess, isLoading, error } = useQuery({
        queryKey: [`Playstation-By-Id-${ps_id}`],
        queryFn: async () => {
            console.log(`/playstation/${ps_id}`, '----okk')
            const response = await api.get(`/playstation/${ps_id}`);
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


export const useCreatePlaystation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newPlaystation) => {
            console.log("NEW playstation--", newPlaystation)
            const response = await api.post('/playstation', newPlaystation);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Data playstation berhasil ditambahkan');
            queryClient.invalidateQueries('playstation-all');
            console.log('Post Data Playstation Sukses ----', data);
        },
        onError: (error) => {
            toast.error('Terjadi kesalahan saat menambahkan data playstation');
            console.log('Error Post Data');
            console.log(error.response.data);
        }
    });

    return mutation;
};

export const useUpdatePlaystation = (props) => {
    const { ps_id } = props;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updatePlaystation) => {
            console.log("Update PS--", updatePlaystation)
            const response = await api.put(`/playstation/${ps_id}`, updatePlaystation);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Success Update Playstation");
            console.log("Success Update Playstation");
            console.log(data);
            queryClient.invalidateQueries('playstation-all');
            return data;
        },
        onError: (error) => {
            toast.warning("Error Update playstation");
            console.log("Error Update playstation");
            console.log(error);
        },
    });
    return mutation;
};

export const useDeletePlaystation = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (ps_id) => {
            const response = await api.delete(`/playstation/${ps_id}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Success Delete PlayStation");
            console.log("success");
            queryClient.invalidateQueries('playstation-all');
            return data;
        },
        onError: (error) => {
            toast.error("Tidak bisa hapus data PlayStation");
            console.log(error);
        },
    });
    return mutation;
};