"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
// import { useGetBranchAll } from "@/hooks/branch/useBranches";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TableBranches from "./components/TableBranches";

export default function Branches() {
  const router = useRouter();
  const {
    data: dataCabang,
    isLoading,
    isSuccess,
    error,
    refetch: refetchCabang,
  } = useGetBranchAll();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AuthWrapper allowedRoles={["owner"]}>
      <Layout>
        <div className="w-full">
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/branches/tambah-cabang")}
            >
              Tambah Cabang
            </Button>
          </Box>
          <TableBranches
            data={dataCabang}
            tableTitle={"Tabel Data Cabang Rental Tama Game"}
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
