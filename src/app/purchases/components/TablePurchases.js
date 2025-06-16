"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Modal,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GradientCircularProgress from "@/components/Progress";
import {
  useConfirmPurchase,
  useCancelPurchase,
} from "@/hooks/purchases/usePurchases";
import Image from "next/image";

const headCells = [
  { id: "full_name", label: "Nama Pembeli" },
  { id: "property_name", label: "Properti" },
  { id: "payment_method", label: "Metode Bayar" },
  { id: "total_price", label: "Harga" },
  { id: "action", label: "Aksi" },
];

// Komponen Modal yang akan menampilkan detail
const DetailModal = ({ purchase, apiBaseUrl, onClose }) => {
  if (!purchase) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", md: 800 },
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Detail Pengajuan Pembelian
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography>
            <strong>Nama:</strong> {purchase.full_name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {purchase.email}
          </Typography>
          <Typography>
            <strong>Telepon:</strong> {purchase.phone_number}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>
            <strong>Properti:</strong> {purchase.property_name} (
            {purchase.type_name})
          </Typography>
          <Typography>
            <strong>Metode Bayar:</strong> {purchase.payment_method}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Dokumen Pendukung
      </Typography>
      <Grid container spacing={1} sx={{ textAlign: "center" }}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight="bold">
            KTP
          </Typography>
          {purchase.image_ktp ? (
            <Image
              src={`${apiBaseUrl}${purchase.image_ktp}`}
              alt="KTP"
              width={200}
              height={120}
              style={{ objectFit: "contain", border: "1px solid #ddd" }}
              unoptimized
            />
          ) : (
            <Typography color="text.secondary">(Belum diupload)</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight="bold">
            Kartu Keluarga
          </Typography>
          {purchase.image_kk ? (
            <Image
              src={`${apiBaseUrl}${purchase.image_kk}`}
              alt="KK"
              width={200}
              height={120}
              style={{ objectFit: "contain", border: "1px solid #ddd" }}
              unoptimized
            />
          ) : (
            <Typography color="text.secondary">(Belum diupload)</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight="bold">
            NPWP
          </Typography>
          {purchase.image_npwp ? (
            <Image
              src={`${apiBaseUrl}${purchase.image_npwp}`}
              alt="NPWP"
              width={200}
              height={120}
              style={{ objectFit: "contain", border: "1px solid #ddd" }}
              unoptimized
            />
          ) : (
            <Typography color="text.secondary">(Belum diupload)</Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button onClick={onClose} variant="outlined">
          Tutup
        </Button>
      </Box>
    </Box>
  );
};

export default function TablePurchases({
  data,
  tableTitle,
  isLoading,
  isError,
  error,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const confirmPurchase = useConfirmPurchase();
  const cancelPurchase = useCancelPurchase();

  const handleOpenModal = (purchase) => {
    setSelectedPurchase(purchase);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirm = (purchaseId, event) => {
    event.stopPropagation();
    confirmPurchase.mutate(purchaseId);
  };

  const handleCancel = (purchaseId, event) => {
    event.stopPropagation();
    cancelPurchase.mutate(purchaseId);
  };

  const visibleRows = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, data]);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI.replace("/api/v1", "");

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          minHeight: "40vh",
          borderRadius: "1rem",
          p: 2,
        }}
      >
        <Typography variant="h6" id="tableTitle" sx={{ p: 2 }}>
          {tableTitle}
        </Typography>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <GradientCircularProgress />
          </Box>
        )}
        {isError && (
          <Typography color="error" sx={{ p: 2 }}>
            Error: {error?.message}
          </Typography>
        )}
        {!isLoading && !isError && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id} sx={{ fontWeight: "bold" }}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row) => (
                    <TableRow
                      hover
                      key={row.purchases_id}
                      onClick={() => handleOpenModal(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{row.full_name}</TableCell>
                      <TableCell>{row.property_name}</TableCell>
                      <TableCell>{row.payment_method || "N/A"}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(row.total_price)}
                      </TableCell>
                      <TableCell>
                        <Typography color={"warning.main"} fontWeight={"bold"}>
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          title="Konfirmasi"
                          color="success"
                          onClick={(e) => handleConfirm(row.purchases_id, e)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          title="Batalkan"
                          color="error"
                          onClick={(e) => handleCancel(row.purchases_id, e)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <DetailModal
          purchase={selectedPurchase}
          apiBaseUrl={apiBaseUrl}
          onClose={handleCloseModal}
        />
      </Modal>
    </Box>
  );
}
