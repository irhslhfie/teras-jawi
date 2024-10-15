"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetUsersAll } from "@/hooks/admin/useAdmin";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import TablePlaystations from "./components/TablePlaystations";
import { useGetPlaystationAll } from "@/hooks/playstation/usePlaystation";

export default function Playstation() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: dataPlaystation, isLoading, isSuccess, error, refetch: refetchUsers } = useGetPlaystationAll({
        ps_type: searchQuery,
        status: searchQuery
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (dataPlaystation) {
            console.log('Cek data playstation ===> ', dataPlaystation)
        } else {
            console.log('YAAHAHAHAH ERRRORRR LUUUU')
        }
    }, [dataPlaystation])


    return (
        <AuthWrapper allowedRoles={["admin"]}>
            <Layout>
                <div className="w-full">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            onClick={() => router.push('/playstation/tambah-playstation')}
                        >Tambah</Button>
                    </Box>
                    {dataPlaystation && (
                        <TablePlaystations data={dataPlaystation} tableTitle={'Tabel Data PlayStations'} />
                    )}
                </div>
            </Layout>
        </AuthWrapper>
    )
}
