"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetPlaystationAll } from "@/hooks/playstation/usePlaystation";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import MultipleSelectChip from "@/components/SelectInput";
import { useGetBranchAll } from "@/hooks/branch/useBranches";
import { useGetRentalDone } from "@/hooks/rentals/useRentals";
import TableHistoryRentals from "./components/TableHistoryRentals";

export default function Playstation() {
    const router = useRouter();
    // const [searchQueryPS, setsearchQueryPS] = useState([])
    // const [searchQuery, setSearchQuery] = useState('');
    // const [dataPSType, setDataPSType] = useState(['PS3', 'PS4', 'PS5']);

    // const { data: dataBranch, isLoading: loadingBranch } = useGetBranchAll();
    const { data: dataRental, isLoading, isSuccess, error } = useGetRentalDone();

    // useEffect(() => {
    //     refetchPlaystation();
    // }, [searchQueryPS, searchQuery]);


    // const handleSearch = (e) => {
    //     setSearchQuery(e.target.value);
    // };

    // const branchIds = useMemo(() => {
    //     if (!dataBranch) return [];
    //     return dataBranch.map(branch => branch.branch_name);
    // }, [dataBranch]);

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <div className="w-full">
                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
                        <div className="flex space-x-2">
                            <MultipleSelectChip
                                title={"Cari Jenis PS"}
                                names={dataPSType}
                                personName={searchQueryPS}
                                setPersonName={setsearchQueryPS}
                            />
                            {!loadingBranch && dataBranch && (
                                <MultipleSelectChip
                                    title={"Pilih Cabang"}
                                    names={branchIds}
                                    personName={searchQuery}
                                    setPersonName={setSearchQuery}
                                />
                            )}
                        </div>

                        <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            onClick={() => router.push('/playstation/tambah-playstation')}
                            sx={{
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                height: '40px'
                            }}
                        >
                            Tambah
                        </Button>
                    </Box> */}

                    <TableHistoryRentals
                        data={dataRental}
                        tableTitle={'Tabel Data Histori Penyewaan'}
                        isLoading={isLoading}
                        isError={error} />
                </div>
            </Layout>
        </AuthWrapper >
    );
}
