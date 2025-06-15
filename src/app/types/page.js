"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TableTypes from "./components/TableTypes";
import { useGetTypesAll } from "@/hooks/types/useTypes";

export default function Types() {
  const router = useRouter();
  const {
    data: dataTypes,
    isLoading,
    isSuccess,
    error,
    refetch: refetchCabang,
  } = useGetTypesAll();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <div className="w-full">
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/types/tambah-types")}
            >
              Tambah Tipe
            </Button>
          </Box>
          <TableTypes
            data={dataTypes}
            tableTitle={"Tabel Data Tipe"}
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
