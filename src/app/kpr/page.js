"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetKprList } from "@/hooks/kpr/useKpr";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";

export default function KprListPage() {
  const router = useRouter();
  const { data: kprList, isLoading, isError, error } = useGetKprList();

  const handleRowClick = (kprId) => {
    router.push(`/kpr/${kprId}`);
  };

  return (
    <AuthWrapper allowedRoles={["admin", "owner", "marketing"]}>
      <Layout>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          Tracking Kredit (KPR)
        </Typography>
        <Paper sx={{ p: 2, borderRadius: "1rem" }}>
          {isLoading && <CircularProgress />}
          {isError && (
            <Alert severity="error">
              Gagal memuat data KPR: {error?.message || "Terjadi kesalahan"}
            </Alert>
          )}
          {!isLoading && !isError && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Nama Nasabah
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Properti</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Pinjaman
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Progres Cicilan
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kprList && kprList.length > 0 ? (
                    kprList.map((kpr) => (
                      <TableRow
                        key={kpr.kpr_id}
                        hover
                        onClick={() => handleRowClick(kpr.kpr_id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{kpr.full_name}</TableCell>
                        <TableCell>{kpr.property_name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(kpr.total_loan)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box sx={{ width: "100%", mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (kpr.paid_installments /
                                    kpr.total_installments) *
                                  100
                                }
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {`${kpr.paid_installments}/${kpr.total_installments}`}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Belum ada data KPR yang aktif.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Layout>
    </AuthWrapper>
  );
}
