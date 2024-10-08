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
        // password: '',
        email: '',
        phone_number: ''
    });
    const { data: dataUser, isLoading, error, isSuccess: dataUserSukses } = useGetUserById({
        user_id: user_id
    });

    useEffect(() => {
        if (dataUserSukses) {
            setFormData({
                username: dataUser?.username,
                email: dataUser?.email,
                phone_number: dataUser?.phone_number
            })
        } else {
            console.log(error + "Data User error")
        }
    }, [dataUserSukses])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const updateUser = useUpdateUser({
        user_id: user_id
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Cek Data Input---', formData);

        try {
            await updateUser.mutateAsync({
                // username: formData?.username,
                // password: formData?.password,
                email: formData?.email,
                phone_number: formData?.phone_number,
                // contact_number: String(formData?.contact_number),
            })
            router.back();
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    console.log(JSON.stringify(formData))

    return (
        <AuthWrapper allowedRoles={["admin"]}>
            <Layout>
                <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom>
                        Update Data User
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            // onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            disabled
                        />
                        <TextField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Nomor Telepon"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                            Update User
                        </Button>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default UpdateUser;
