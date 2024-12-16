"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import MultipleSelectChip from "@/components/SelectInput";
import { useGetRentalActive, useGetRentalAll } from "@/hooks/rentals/useRentals";
import TableRentals from "./components/TableRentals";

export default function Rentals() {
    const router = useRouter();
    const [searchQueryPS, setsearchQueryPS] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [dataPSType, setDataPSType] = useState(['PS3', 'PS4', 'PS5']);
    const [rolePengguna, setRolePengguna] = useState('');

    const { data: dataRental, isLoading, isSuccess, error, refetch: refetchRental } = useGetRentalActive();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role) {
            setRolePengguna(JSON.parse(role));
        }
    }, []);


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <div className="w-full">
                    {rolePengguna === 'admin' && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, px: 2 }}>
                            {/* <MultipleSelectChip
                            title={"Cari Jenis PS"}
                            names={dataPSType}
                            personName={searchQueryPS}
                            setPersonName={setsearchQueryPS}
                        /> */}

                            <Button
                                variant="contained"
                                endIcon={<AddIcon />}
                                onClick={() => router.push('/rentals/tambah-rental')}
                                sx={{
                                    padding: '8px 16px',
                                    fontSize: '0.875rem',
                                    height: '40px'
                                }}
                            >
                                Tambah
                            </Button>
                        </Box>
                    )}

                    <TableRentals
                        data={dataRental}
                        tableTitle={'Tabel Data Penyewaan'}
                        isLoading={isLoading}
                        isError={error}
                        rolePengguna={rolePengguna}
                    />
                </div>
            </Layout>
        </AuthWrapper >
    );
}
