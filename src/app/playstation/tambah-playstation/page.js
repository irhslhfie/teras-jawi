'use client';
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import Layout from '@/components/layout';
import { useCreateAdmin } from '@/hooks/admin/useAdmin';
import { useRouter } from "next/navigation";
import AuthWrapper from '@/helpers/AuthWrapper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGetBranchAll } from '@/hooks/branch/useBranches';
import { useCreatePlaystation } from '@/hooks/playstation/usePlaystation';

const AddPlaystation = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        branch_id: '',
        ps_type: '',
        ps_number: ''
    });
    const { data: dataCabang } = useGetBranchAll();

    const handleChange = (e) => {
        console.log('TES abang ==> ', e.target)
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const createPS = useCreatePlaystation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Cek Data Input---', formData);

        try {
            await createPS.mutateAsync({
                branch_id: formData?.branch_id,
                ps_type: formData?.ps_type,
                ps_number: formData?.ps_number
            })
            router.back();
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    return (
        <AuthWrapper allowedRoles={["admin"]}>
            <Layout>
                <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom>
                        Tambah Data Playstation
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Nama Cabang</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData?.branch_id}
                                name="branch_id"
                                label="Nama Cabang"
                                onChange={handleChange}
                            >
                                {dataCabang?.map((cabang) => (
                                    <MenuItem key={cabang?.branch_id} value={cabang?.branch_id}>{cabang?.branch_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">Jenis PlayStation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData?.ps_type}
                                name="ps_type"
                                label="Jenis PlayStation"
                                onChange={handleChange}
                            >
                                <MenuItem value={'PS3'}>PS3</MenuItem>
                                <MenuItem value={'PS4'}>PS4</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Nomor PS"
                            name="ps_number"
                            value={formData.ps_number}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                            Tambah PlayStation
                        </Button>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default AddPlaystation;
