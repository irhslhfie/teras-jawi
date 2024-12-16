"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetPlaystationAll } from "@/hooks/playstation/usePlaystation";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import TablePlaystations from "./components/TablePlaystations";
import MultipleSelectChip from "@/components/SelectInput";
import { useGetBranchAll } from "@/hooks/branch/useBranches";

export default function Playstation() {
    const router = useRouter();
    const [searchQueryPS, setsearchQueryPS] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [dataPSType, setDataPSType] = useState(['PS3', 'PS4', 'PS5']);
    const [branchId, setBranchId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const { data: dataBranch, isLoading: loadingBranch } = useGetBranchAll();
    const { data: dataPlaystation, isLoading, isSuccess, error, refetch: refetchPlaystation } = useGetPlaystationAll({
        ps_type: searchQueryPS,
        branch_name: searchQuery,
        branch_id: branchId
    });

    useEffect(() => {
        const branchUser = localStorage.getItem("branch_user");
        const roleUser = localStorage.getItem("role");

        if (branchUser) {
            setBranchId(JSON.parse(branchUser));
        }
        if (roleUser) {
            setUserRole(JSON.parse(roleUser));
        }
    }, []);

    useEffect(() => {
        refetchPlaystation();
    }, [searchQueryPS, searchQuery]);

    console.log('Cek data Branch User : ', branchId)

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const branchIds = useMemo(() => {
        if (!dataBranch) return [];
        return dataBranch.map(branch => branch.branch_name);
    }, [dataBranch]);

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <div className="w-full">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
                        <div className="flex space-x-2">
                            <MultipleSelectChip
                                title={"Cari Jenis PS"}
                                names={dataPSType}
                                personName={searchQueryPS}
                                setPersonName={setsearchQueryPS}
                            />
                            {!loadingBranch && dataBranch && userRole === 'owner' && (
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
                    </Box>

                    <TablePlaystations
                        data={dataPlaystation}
                        tableTitle={'Tabel Data PlayStations'}
                        isLoading={isLoading}
                        isError={error} />
                </div>
            </Layout>
        </AuthWrapper >
    );
}
