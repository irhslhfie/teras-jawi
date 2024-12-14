import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

export const useGetBookingAll = () => {
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["booking-all"],
        queryFn: async () => {
            const response = await api.get(`/booking`);
            const data = response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data Booking Sukses');
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

export const useGetConfirmBooking = () => {
    const { data, isSuccess, isLoading, error, refetch } = useQuery({
        queryKey: ["booking-confirmed"],
        queryFn: async () => {
            const response = await api.get(`/booking/confirm`);
            const data = response.data;
            return data;
        },
        onSuccess: (data) => {
            console.log('Get Data Booking Confirmed Sukses');
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

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ booking_id }) => {
            const response = await api.put(`/booking/cancel`, { booking_id });
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Success Cancel Booking", data);
            queryClient.invalidateQueries('booking-all');
        },
        onError: (error) => {
            console.error("Error Cancel Booking", error);
        },
    });

    return mutation;
};

export const useConfirmBooking = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ booking_id }) => {
            const response = await api.put(`/booking/confirm`, { booking_id });
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Success Confirm Booking", data);
            queryClient.invalidateQueries('booking-all');
        },
        onError: (error) => {
            console.error("Error Confirm Booking", error);
        },
    });

    return mutation;
};

// export const useGetPlaystationById = (props) => {
//     const { ps_id } = props;
//     const { data, isSuccess, isLoading, error } = useQuery({
//         queryKey: [`Playstation-By-Id-${ps_id}`],
//         queryFn: async () => {
//             console.log(`/playstation/${ps_id}`, '----okk')
//             const response = await api.get(`/playstation/${ps_id}`);
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


// export const useCreatePlaystation = () => {
//     const queryClient = useQueryClient();

//     const mutation = useMutation({
//         mutationFn: async (newPlaystation) => {
//             console.log("NEW playstation--", newPlaystation)
//             const response = await api.post('/playstation', newPlaystation);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             toast.success('Data playstation berhasil ditambahkan');
//             queryClient.invalidateQueries('playstation-all');
//             console.log('Post Data Playstation Sukses ----', data);
//         },
//         onError: (error) => {
//             toast.error('Terjadi kesalahan saat menambahkan data playstation');
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

// export const useDeletePlaystation = () => {
//     const queryClient = useQueryClient();
//     const mutation = useMutation({
//         mutationFn: async (ps_id) => {
//             const response = await api.delete(`/playstation/${ps_id}`);
//             return response.data;
//         },
//         onSuccess: (data) => {
//             toast.success("Success Delete PlayStation");
//             console.log("success");
//             queryClient.invalidateQueries('playstation-all');
//             return data;
//         },
//         onError: (error) => {
//             toast.error("Tidak bisa hapus data PlayStation");
//             console.log(error);
//         },
//     });
//     return mutation;
// };