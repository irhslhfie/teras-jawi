'use client';
import { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Layout from '@/components/layout';
import { useCreateAdmin } from '@/hooks/admin/useAdmin';
import { useRouter } from "next/navigation";
import AuthWrapper from '@/helpers/AuthWrapper';
import { useGetBranchAll } from '@/hooks/branch/useBranches';

const AddUser = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        email: '',
        phone_number: '',
        role: 'admin',
        branch_id: ''
    });
    const [errors, setErrors] = useState({});
    const { data: dataBranch, isLoading: loadingBranch } = useGetBranchAll();

    // Fungsi Validasi
    const validateForm = () => {
        const newErrors = {};
        const { username, password, confirmPassword, full_name, email, phone_number, role, branch_id } = formData;

        if (!username) newErrors.username = 'Username wajib diisi.';
        if (!full_name) newErrors.full_name = 'Nama lengkap wajib diisi.';
        if (!email) newErrors.email = 'Email wajib diisi.';
        if (!phone_number) newErrors.phone_number = 'Nomor telepon wajib diisi.';
        if (!password) {
            newErrors.password = 'Password wajib diisi.';
        } else if (password.length < 8 || !/[A-Z]/.test(password)) {
            newErrors.password = 'Password harus memiliki minimal 8 karakter dan mengandung setidaknya 1 huruf besar.';
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password tidak sesuai.';
        }
        if (!branch_id) newErrors.branch_id = 'Cabang wajib dipilih.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Mengembalikan true jika tidak ada error
    };

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });

        // Hapus error untuk field yang diubah
        if (errors[key]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const createAdmin = useCreateAdmin();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; // Hanya submit jika form valid

        try {
            await createAdmin.mutateAsync({
                username: formData?.username,
                password: formData?.password,
                full_name: formData?.full_name,
                email: formData?.email,
                phone_number: formData?.phone_number,
                role: 'admin',
                branch_user: formData?.branch_id // Pastikan kamu kirimkan branch_id juga jika diperlukan
            });
            router.back(); // Atau rute lain setelah sukses
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Tambah Data User Admin
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {Object.entries({
                                username: 'Username',
                                full_name: 'Full Name',
                                email: 'Email',
                                phone_number: 'Phone Number',
                                password: 'Password',
                                confirmPassword: 'Confirm Password',
                                role: 'Role'
                            }).map(([key, label]) => (
                                <TextField
                                    key={key}
                                    fullWidth
                                    label={label}
                                    type={key.includes('password') || key.includes('confirmPassword') ? 'password' : 'text'}
                                    value={formData[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                    disabled={key.includes('role') ? true : false}
                                />
                            ))}
                        </div>

                        {/* Pilih Cabang */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="branch-select-label">Pilih Cabang</InputLabel>
                            <Select
                                labelId="branch-select-label"
                                id="branch-select"
                                value={formData.branch_id}
                                name="branch_id"
                                label="Pilih Cabang"
                                onChange={(e) => handleChange('branch_id', e.target.value)}
                                error={!!errors.branch_id}
                            >
                                {dataBranch?.map((item, index) => (
                                    <MenuItem key={index} value={item.branch_id}>{item.branch_name}</MenuItem>
                                ))}
                            </Select>
                            {errors.branch_id && <Typography color="error" variant="caption">{errors.branch_id}</Typography>}
                        </FormControl>

                        <div className='flex justify-between mt-5'>
                            <Button variant="contained" color="primary" type="submit" size="medium">
                                Tambah User
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                Batal
                            </Button>
                        </div>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default AddUser;