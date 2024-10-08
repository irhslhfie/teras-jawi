import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetUsersAll = (props) => {
    const { name, role } = props;
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["user-all"],
        queryFn: async () => {
            let queryParams = '';

            if (name) {
                queryParams += `?name=${name}`;
            }

            if (role) {
                queryParams += queryParams ? `&role=${role}` : `?role=${role}`;
            }

            const response = await api.get(`/users${queryParams}`);
            const data = response.data;
            console.log('cek data user----', data)
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data user Sukses ----', data);
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

    const result = data;
    return { data: result, isSuccess, isLoading, error, refetch };
};

export const useGetUserById = (props) => {
    const { user_id } = props;
    const { data, isSuccess, isLoading, error } = useQuery({
        queryKey: [`User-By-Id-${user_id}`],
        queryFn: async () => {
            console.log(`/users/${user_id}`, '----okk')
            const response = await api.get(`/users/${user_id}`);
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

    const result = data;
    return { data: result, isSuccess, isLoading, error };
};


export const useCreateAdmin = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newUser) => {
            console.log("NEW user--", newUser)
            const response = await api.post('/users', newUser);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Data user berhasil ditambahkan');
            queryClient.invalidateQueries('user-all');
            console.log('Post Data User Sukses ----', data);
        },
        onError: (error) => {
            if (error.response.data == 'Username sudah terdaftar') {
                toast.error('Username sudah terdaftar');
            } else {
                toast.error('Terjadi kesalahan saat menambahkan data admin');
            }
            console.log('Error Post Data');
            console.log(error.response.data);
        }
    });

    return mutation;
};

export const useUpdateUser = (props) => {
    const { user_id } = props;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (updateUser) => {
            console.log("Update user--", updateUser)
            const response = await api.put(`/users/${user_id}`, updateUser);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Success Update user");
            console.log("Success Update user");
            console.log(data);
            queryClient.invalidateQueries('user-all');
            return data;
        },
        onError: (error) => {
            toast.warning("Error Update user");
            console.log("Error Update user");
            console.log(error);
        },
    });
    return mutation;
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (user_id) => {
            const response = await api.delete(`/users/${user_id}`);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Success Delete User");
            console.log("success");
            queryClient.invalidateQueries('user-all');
            return data;
        },
        onError: (error) => {
            toast.error("Tidak bisa hapus data User");
            console.log(error);
        },
    });
    return mutation;
};