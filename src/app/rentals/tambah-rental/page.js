'use client';
import Layout from '@/components/layout';
import GradientCircularProgress from '@/components/Progress';
import AuthWrapper from '@/helpers/AuthWrapper';
import { useGetConfirmBooking } from '@/hooks/booking/useBooking';
import { useCreateRental } from '@/hooks/rentals/useRentals';
import { Box, Button, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { toast } from 'sonner'

const formatRentalTime = (rentalTime) => {
    const [hours, minutes] = rentalTime.split(':').map(Number);
    return `${hours} Jam${minutes > 0 ? ` ${minutes} Menit` : ''}`;
};

const AddRental = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        user_id: '',
        full_name: '',
        ps_id: '',
        ps_type: '',
        ps_number: '',
        rental_type: '',
        rental_time: '',
        booking_id: '',
    });
    const { data: dataBooking, isLoading, isSuccess, error } = useGetConfirmBooking();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Jika perubahan berasal dari dropdown rental_id
        if (name === 'rental_id') {
            const selectedBooking = dataBooking.find((data) => data.booking_id === value);

            if (selectedBooking) {
                // Salin data yang dipilih ke formData
                setFormData({
                    ...formData,
                    user_id: selectedBooking?.user_id,
                    full_name: selectedBooking?.full_name,
                    ps_id: selectedBooking?.ps_id,
                    ps_type: selectedBooking?.ps_type,
                    ps_number: selectedBooking?.ps_number,
                    rental_type: selectedBooking?.rental_type,
                    rental_time: selectedBooking?.rental_time,
                    booking_id: selectedBooking?.booking_id,
                });
            }
        } else {
            // Jika perubahan dari input lain
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const createRental = useCreateRental();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData?.user_id === '' ||
            formData?.ps_id === '' ||
            formData?.ps_type === '' ||
            formData?.rental_type === '' ||
            formData?.rental_time === '' ||
            formData?.booking_id === ''
        ) {
            return toast.warning('Silahkan Pilih Data Pemesanan Terlebih Dahulu');
        }

        // Dapatkan waktu sekarang sebagai start_time
        const startTime = dayjs();

        // Hitung end_time (start_time + rental_time)
        const [rentalHours] = formData?.rental_time.split(':').map(Number); // Ambil jam dari rental_time
        const endTime = startTime.add(rentalHours, 'hour');

        // Fungsi untuk menghitung harga
        const calculateTotalPrice = () => {
            const { ps_type, rental_type } = formData;

            if (ps_type === 'PS4' && rental_type === 'on-site') {
                if (rentalHours === 1) return 7000;
                if (rentalHours >= 2) return 7000 + (rentalHours - 1) * 5000; // 2 jam ke atas
            }

            if (ps_type === 'PS3' && rental_type === 'on-site') {
                if (rentalHours === 1) return 5000;
                if (rentalHours === 2) return 10000;
                if (rentalHours >= 3) return 12000 + (rentalHours - 3) * 3000; // 3 jam ke atas
            }

            if (ps_type === 'PS4' && rental_type === 'take-home') {
                if (rentalHours === 12) return 50000;
                if (rentalHours === 24) return 90000;
            }

            return 0; // Jika tidak memenuhi kriteria
        };

        // Hitung total price berdasarkan logika harga
        const totalPrice = calculateTotalPrice();

        try {
            await createRental.mutateAsync({
                user_id: formData?.user_id,
                ps_id: formData?.ps_id,
                rental_type: formData?.rental_type,
                start_time: startTime.format('YYYY-MM-DD HH:mm:ss'), // Format untuk datetime
                end_time: endTime.format('YYYY-MM-DD HH:mm:ss'),
                total_price: totalPrice,
                status: 'active',
                booking_id: formData?.booking_id,
            });
            router.back(); // Kembali ke halaman sebelumnya
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    console.log(formData)

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <Box sx={{ width: '100%', mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Tambah Data Penyewaan
                    </Typography>
                    {isLoading && (
                        <div className='w-full flex justify-center items-center mt-10'>
                            <GradientCircularProgress />
                        </div>
                    )}
                    {error && (
                        <div className='w-full flex justify-center items-center mt-10'>
                            <Typography color="error">Error fetching data: {error.message}</Typography>
                        </div>
                    )}
                    {!isLoading && (
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Pilih Pemesanan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="rental_id"
                                    label="Pilih Pemesanan"
                                    onChange={handleChange}
                                >
                                    {dataBooking?.length === 0 && (
                                        <MenuItem
                                        // key={data?.booking_id}
                                        // value={data?.booking_id}
                                        >
                                            Tidak ada data Pemesanan yang tersedia.
                                        </MenuItem>
                                    )}
                                    {dataBooking?.length > 0 && dataBooking?.map((data) => (
                                        <MenuItem
                                            key={data?.booking_id}
                                            value={data?.booking_id}
                                        >
                                            {data?.branch_name} - PS No.{data?.ps_number} - {data?.full_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Nama Pemesan"
                                name="full_name"
                                value={formData?.full_name}
                                // onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                disabled
                            />
                            <TextField
                                label="Nomor PS"
                                name="ps_number"
                                value={formData?.ps_number}
                                // onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                disabled
                            />
                            <TextField
                                label="Tipe Penyewaan"
                                name="ps_number"
                                value={formData?.rental_type === 'on-site' ? 'Sewa Ditempat' : 'Sewa Dibawa Pulang'}
                                // onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                disabled
                            />
                            <TextField
                                label="Waktu Sewa"
                                name="rental_time"
                                value={formatRentalTime(formData?.rental_time)}
                                // onChange={handleChange}
                                fullWidth
                                required
                                margin="normal"
                                disabled
                            />
                            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                                Tambah Penyewaan
                            </Button>
                        </form>
                    )}
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default AddRental;
