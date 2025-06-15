"use client";

import React from "react";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import Box from "@mui/material/Box";
import { useGetPendingPurchases } from "@/hooks/purchases/usePurchases";
import TablePurchases from "./components/TablePurchases";

export default function PurchaseVerification() {
  const {
    data: dataPurchases,
    isLoading,
    isError,
    error,
  } = useGetPendingPurchases();

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <div className="w-full">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              px: 2,
            }}
          >
            <h1>Verifikasi Pembelian</h1>
          </Box>

          <TablePurchases
            data={dataPurchases || []}
            tableTitle={"Tabel Verifikasi Pembelian"}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
