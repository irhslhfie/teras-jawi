"use client";

import Layout from "@/components/layout";
import CompTable from "@/components/Table";
import { useGetUsersAll } from "@/hooks/admin/useAdmin";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation'
import AuthWrapper from "@/helpers/AuthWrapper";

const myData = [
    { id: 1, name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4.3 },
    // ... data lainnya
];

export default function Users() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: dataUsers, isLoading, isSuccess, error, refetch: refetchUsers } = useGetUsersAll({
        name: searchQuery,
        role: searchQuery
    });

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (dataUsers) {
            console.log('Cek data users ===> ', dataUsers)
        } else {
            console.log('YAAHAHAHAH ERRRORRR LUUUU')
        }
    }, [dataUsers])


    return (
        <AuthWrapper allowedRoles={["admin"]}>
            <Layout>
                <div className="w-full">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            onClick={() => router.push('/users/tambah-user')}
                        >Tambah User</Button>
                    </Box>
                    {dataUsers && (
                        <CompTable data={dataUsers} tableTitle={'Tabel Data Users'} />
                    )}
                </div>
            </Layout>
        </AuthWrapper>
    )
}
