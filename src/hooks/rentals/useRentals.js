import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetRentalAll = (props) => {
    // const { ps_type, status } = props;
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["rental-all"],
        queryFn: async () => {
            const response = await api.get(`/rentals`);
            const data = response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data rental Sukses ----', data);
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

export const useGetRentalActive = (props) => {
    // const { ps_type, status } = props;
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["rental-all-active"],
        queryFn: async () => {
            const response = await api.get(`/rentals/active`);
            const data = response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data rental Sukses ----', data);
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

export const useGetRentalDone = (startDate = null, branchId = null) => {
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["rental-all-done", startDate, branchId],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append("start_date", startDate);
            if (branchId) params.append("branch_id", branchId);

            console.log(`/rentals/done?${params.toString()}`);
            const response = await api.get(`/rentals/done?${params.toString()}`);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Get Data rental Sukses ----', data);
        },
        onError: (error) => {
            toast.error(error.response?.data?.response?.message || 'Error fetching rental data');
            console.log('Error Get Data', error);
        },
    });

    const result = data?.data || [];
    return { data: result, isSuccess, isLoading, error, refetch };
};

export const useDoneRental = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ rental_id, ps_id }) => {
            console.log(rental_id, '---', ps_id)
            const response = await api.put(`/rentals/done`, { rental_id, ps_id });
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Success Done Rental", data);
            queryClient.invalidateQueries('rental-all-active');
        },
        onError: (error) => {
            console.error("Error Done Rental", error);
        },
    });

    return mutation;
};

export const useCreateRental = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newPenyewaan) => {
            console.log("NEW penyewaan--", newPenyewaan)
            const response = await api.post('/rentals', newPenyewaan);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Data Penyewaan Berhasil Ditambahkan');
            queryClient.invalidateQueries('rental-all-active');
            console.log('Post Data Penyewaan Sukses');
        },
        onError: (error) => {
            toast.error('Terjadi kesalahan saat menambahkan data penyewaan');
            console.log('Error Post Data');
            console.log(error.response.data);
        }
    });

    return mutation;
};

// export const useGetRentalById = (props) => {
//     const { rental_id } = props;
//     const { data, isSuccess, isLoading, error } = useQuery({
//         queryKey: [`Rental-By-Id-${rental_id}`],
//         queryFn: async () => {
//             console.log(`/rentals/${rental_id}`, '----okk')
//             const response = await api.get(`/rentals/${rental_id}`);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             console.log(data);
//         },
//         onError: (error) => {
//             console.log(error);
//         },
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//         refetchOnMount: true,
//     });

//     const result = data?.data;
//     return { data: result, isSuccess, isLoading, error };
// };


// export const useCreateRental = () => {
//     const queryClient = useQueryClient();

//     const mutation = useMutation({
//         mutationFn: async (newRental) => {
//             console.log("NEW rental--", newRental)
//             const response = await api.post('/rentals', newRental);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             toast.success('Data penyewaan berhasil ditambahkan');
//             queryClient.invalidateQueries('rental-all');
//             console.log('Post Data Rental Sukses ----', data);
//         },
//         onError: (error) => {
//             toast.error('Terjadi kesalahan saat menambahkan data rental');
//             console.log('Error Post Data');
//             console.log(error.response.data);
//         }
//     });

//     return mutation;
// };

// export const useUpdatePlaystation = (props) => {
//     const { ps_id } = props;
//     const queryClient = useQueryClient();
//     const mutation = useMutation({
//         mutationFn: async (updatePlaystation) => {
//             console.log("Update PS--", updatePlaystation)
//             const response = await api.put(`/playstation/${ps_id}`, updatePlaystation);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             toast.success("Success Update Playstation");
//             console.log("Success Update Playstation");
//             console.log(data);
//             queryClient.invalidateQueries('playstation-all');
//             return data;
//         },
//         onError: (error) => {
//             toast.warning("Error Update playstation");
//             console.log("Error Update playstation");
//             console.log(error);
//         },
//     });
//     return mutation;
// };

// export const useDeleteRental = () => {
//     const queryClient = useQueryClient();
//     const mutation = useMutation({
//         mutationFn: async (rental_id) => {
//             const response = await api.delete(`/rentals/${rental_id}`);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             toast.success("Success Delete Data Penyewaan");
//             console.log("success");
//             queryClient.invalidateQueries('rental-all');
//             return data;
//         },
//         onError: (error) => {
//             toast.error("Tidak bisa hapus data Penyewaan");
//             console.log(error);
//         },
//     });
//     return mutation;
// };