'use client';
import { useState } from 'react';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Layout from '@/components/layout';
import { useCreateAdmin } from '@/hooks/admin/useAdmin';
import { useRouter } from "next/navigation";
import AuthWrapper from '@/helpers/AuthWrapper';

const AddUser = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        email: '',
        phone_number: '',
        role: '', // Role ditambahkan disini
        branch_id: '' // Untuk memilih cabang
    });
    const [errors, setErrors] = useState({});

    // Fungsi Validasi
    const validateForm = () => {
        const newErrors = {};
        const { username, password, confirmPassword, full_name, email, phone_number, role } = formData;

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
        if (!role) newErrors.role = 'Role wajib dipilih.';

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
                role: formData?.role,
                branch_id: formData?.branch_id // Pastikan kamu kirimkan branch_id juga jika diperlukan
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
                        Tambah Data User
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {Object.entries({
                                username: 'Username',
                                full_name: 'Full Name',
                                email: 'Email',
                                phone_number: 'Phone Number',
                                password: 'Password',
                                confirmPassword: 'Confirm Password'
                            }).map(([key, label]) => (
                                <TextField
                                    key={key}
                                    fullWidth
                                    label={label}
                                    type={key.includes('password') || key.includes('confirmPassword') ? 'password' : 'text'}
                                    value={formData[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    error={!!errors[key]} // Set error state
                                    helperText={errors[key]} // Display error message
                                // sx={{
                                //     '& .MuiOutlinedInput-root': {
                                //         backgroundColor: '#F3F4F6',
                                //     }
                                // }}
                                />
                            ))}
                        </div>

                        {/* Pilih Role */}
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="role-select-label">Pilih Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                id="role-select"
                                value={formData.role}
                                name="role"
                                label="Pilih Role"
                                onChange={(e) => handleChange('role', e.target.value)}
                                error={!!errors.role} // Set error state
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="owner">Pemilik</MenuItem>
                            </Select>
                            {errors.role && <Typography color="error" variant="caption">{errors.role}</Typography>}
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                            Tambah User
                        </Button>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default AddUser;