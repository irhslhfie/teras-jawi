"use client";

import React from "react";
import { Button, Box, Typography } from "@mui/material";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import TableBrochures from "./components/TableBrochures";
import { useRouter } from "next/navigation";
import {
  useGetBrochuresAll,
  useUpdateBrochureStatus,
} from "@/hooks/brochures/useBrochures";

export default function BrochuresAdmin() {
  const router = useRouter();
  const { data: brochures, isLoading, isError } = useGetBrochuresAll();
  const updateBrochureStatus = useUpdateBrochureStatus();

  const handleStatusChange = (brochureId, newStatus) => {
    updateBrochureStatus.mutate(
      { brochure_id: brochureId, status: newStatus },
      {
        onSuccess: () => {
          console.log(`Brochure ${brochureId} updated to status: ${newStatus}`);
        },
      }
    );
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => router.push("/brochuresadmin/tambah-brochures")}
            sx={{ ml: "auto" }} // Menggeser tombol ke paling kanan
          >
            Upload Brosur
          </Button>
        </Box>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading brochures</p>}
        {brochures && (
          <TableBrochures
            tableTitle={"Tabel Data Brosur dan Flyer"}
            brochures={brochures}
            onStatusChange={handleStatusChange}
          />
        )}
      </Layout>
    </AuthWrapper>
  );
}
