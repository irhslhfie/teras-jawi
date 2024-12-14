'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Layout from '@/components/layout';
import { useCreateAdmin, useGetUserById, useUpdateUser } from '@/hooks/admin/useAdmin';
import { useRouter, useParams } from "next/navigation";
import AuthWrapper from '@/helpers/AuthWrapper';

const UpdateUser = () => {
    const router = useRouter();
    const param = useParams();
    const { user_id } = param;
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        phone_number: '',
        role: '',
        branch_id: ''
    });
    const [errors, setErrors] = useState({});
    const { data: dataUser, isLoading, error, isSuccess: dataUserSukses } = useGetUserById({
        user_id: user_id
    });

    // Fungsi Validasi
    const validateForm = () => {
        const newErrors = {};
        const { full_name, email, phone_number } = formData;

        if (!full_name) newErrors.full_name = 'Nama lengkap wajib diisi.';
        if (!email) newErrors.email = 'Email wajib diisi.';
        if (!phone_number) newErrors.phone_number = 'Nomor telepon wajib diisi.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (dataUser) {
            setFormData({
                username: dataUser?.username,
                full_name: dataUser?.full_name,
                email: dataUser?.email,
                phone_number: dataUser?.phone_number,
                role: dataUser?.role,
                branch_id: dataUser?.branch_id
            });
        } else {
            console.log(error + "Data User error")
        }
    }, [dataUserSukses, dataUser]);

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

    const updateUser = useUpdateUser({
        user_id: user_id
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await updateUser.mutateAsync({
                full_name: formData?.full_name,
                email: formData?.email,
                phone_number: formData?.phone_number,
            })
            router.back();
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                        Update Data User
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {Object.entries({
                                username: 'Username',
                                full_name: 'Full Name',
                                email: 'Email',
                                phone_number: 'Phone Number',
                                role: 'Role'
                            }).map(([key, label]) => (
                                <TextField
                                    key={key}
                                    fullWidth
                                    label={label}
                                    type={key.includes('password') || key.includes('confirmPassword') ? 'password' : 'text'}
                                    value={formData[key] === 'owner' ? 'Pemilik' : formData[key] === 'admin' ? 'Admin' : formData[key]}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                    disabled={key.includes('username') || key.includes('role') ? true : false}
                                />
                            ))}
                        </div>

                        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                            Update User
                        </Button>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default UpdateUser;
