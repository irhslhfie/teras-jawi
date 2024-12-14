'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Layout from '@/components/layout';
import { useCreateAdmin, useGetUserById, useUpdateUser } from '@/hooks/admin/useAdmin';
import { useRouter, useParams } from "next/navigation";
import AuthWrapper from '@/helpers/AuthWrapper';
import { useGetBranchById, useUpdateBranch } from '@/hooks/branch/useBranches';

const UpdateBranch = () => {
    const router = useRouter();
    const param = useParams();
    const { branch_id } = param;
    const [formData, setFormData] = useState({
        branch_name: '',
        address: ''
    });
    const { data: dataCabang, isLoading, error, isSuccess: dataCabangSukses } = useGetBranchById({
        branch_id: branch_id
    });

    useEffect(() => {
        if (dataCabang) {
            setFormData({
                branch_name: dataCabang?.branch_name,
                address: dataCabang?.address
            })
        } else {
            console.log(error + "Data Cabang error")
        }
    }, [dataCabangSukses])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const updateBranch = useUpdateBranch({
        branch_id: branch_id
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Cek Data Input---', formData);

        try {
            await updateBranch.mutateAsync({
                branch_name: formData?.branch_name,
                address: formData?.address
            })
            router.back();
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    console.log(JSON.stringify(formData));

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <Box sx={{ maxWidth: '100%', mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 5 }}>
                        Update Data Cabang Tama Game
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nama Cabang"
                            name="branch_name"
                            value={formData.branch_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <TextField
                            label="Alamat"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <div className='flex justify-between mt-5'>
                            <Button variant="contained" color="primary" type="submit" size="medium">
                                Update Data Cabang
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

export default UpdateBranch;
