'use client';
import Layout from '@/components/layout';
import AuthWrapper from '@/helpers/AuthWrapper';
import { useGetBranchAll } from '@/hooks/branch/useBranches';
import { useGetPlaystationById, useUpdatePlaystation } from '@/hooks/playstation/usePlaystation';
import { Box, Button, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

const UpdatePlaystation = () => {
    const router = useRouter();
    const param = useParams();
    const { ps_id } = param;
    const [formData, setFormData] = useState({
        branch_id: '',
        ps_type: '',
        ps_number: '',
        status: ''
    });
    const { data: dataPlaystation, isLoading, error, isSuccess: dataPlaystationSukses } = useGetPlaystationById({
        ps_id: ps_id
    });
    const { data: dataCabang } = useGetBranchAll();

    useEffect(() => {
        if (dataPlaystation) {
            setFormData({
                branch_id: dataPlaystation?.branch_id,
                ps_type: dataPlaystation?.ps_type,
                ps_number: dataPlaystation?.ps_number,
                status: dataPlaystation?.status
            })
        } else {
            console.log(error + "Data PlayStation error")
        }
    }, [dataPlaystationSukses])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const updatePlaystation = useUpdatePlaystation({
        ps_id: ps_id
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Cek Data Input---', formData);

        try {
            await updatePlaystation.mutateAsync({
                branch_id: formData?.branch_id,
                ps_type: formData?.ps_type,
                ps_number: formData?.ps_number,
                status: formData?.status
            })
            router.back();
        } catch (error) {
            console.error('Terjadi error: ', error);
        }
    };

    console.log(JSON.stringify(formData))

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, backgroundColor: '#ffffff', py: 3, px: 4, borderRadius: '12px' }}>
                    <Typography variant="h5" gutterBottom>
                        Update Data PlayStation
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
                            value={formData?.ps_number}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData?.status}
                                name="status"
                                label="Status"
                                onChange={handleChange}
                            >
                                <MenuItem value={'available'}>Tersedia</MenuItem>
                                <MenuItem value={'in_use'}>Sedang Digunakan</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
                            Update PlayStation
                        </Button>
                    </form>
                </Box>
            </Layout>
        </AuthWrapper>
    );
};

export default UpdatePlaystation;
