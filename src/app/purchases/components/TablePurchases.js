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
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GradientCircularProgress from "@/components/Progress";
import {
  useConfirmPurchase,
  useCancelPurchase,
} from "@/hooks/purchases/usePurchases";
import Image from "next/image";

// Komponen Modal Detail (tidak berubah)
const DetailModal = React.forwardRef(
  ({ purchase, apiBaseUrl, onClose }, ref) => {
    if (!purchase) return null;
    const renderImage = (imagePath, altText) => {
      if (
        !imagePath ||
        typeof imagePath !== "string" ||
        imagePath.trim() === ""
      )
        return <Typography color="text.secondary">(Belum diunggah)</Typography>;
      if (!apiBaseUrl)
        return (
          <Typography color="error">(Konfigurasi URL API salah)</Typography>
        );
      let relativePath = imagePath.replace(/\\/g, "/");
      const uploadIndex = relativePath.indexOf("uploads/");
      if (uploadIndex > -1)
        relativePath = `/${relativePath.substring(uploadIndex)}`;
      else if (!relativePath.startsWith("/")) relativePath = `/${relativePath}`;
      const finalUrl = `${apiBaseUrl}${relativePath}`;
      try {
        new URL(finalUrl);
      } catch (error) {
        return <Typography color="error">(URL Gambar tidak valid)</Typography>;
      }
      return (
        <Image
          src={finalUrl}
          alt={altText}
          width={200}
          height={120}
          style={{ objectFit: "contain" }}
          unoptimized
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      );
    };
    return (
      <Box
        ref={ref}
        tabIndex={-1}
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
            {renderImage(purchase.image_ktp, "KTP")}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              Kartu Keluarga
            </Typography>
            {renderImage(purchase.image_kk, "KK")}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight="bold">
              NPWP
            </Typography>
            {renderImage(purchase.image_npwp, "NPWP")}
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button onClick={onClose} variant="outlined">
            Tutup
          </Button>
        </Box>
      </Box>
    );
  }
);
DetailModal.displayName = "DetailModal";

export default function TablePurchases({
  data,
  tableTitle,
  isLoading,
  isError,
  error,
  isHistory = false,
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
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI
    ? process.env.NEXT_PUBLIC_API_URI.replace("/api/v1", "")
    : "";

  const headCells = useMemo(() => {
    const base = [
      { id: "full_name", label: "Nama Pembeli" },
      { id: "property_name", label: "Properti" },
      { id: "payment_method", label: "Metode Bayar" },
      { id: "total_price", label: "Harga" },
      { id: "status", label: "Status" },
    ];
    if (!isHistory) base.push({ id: "action", label: "Aksi" });
    return base;
  }, [isHistory]);

  const getStatusChip = (status) => {
    const color =
      status === "Confirmed"
        ? "success"
        : status === "Cancelled"
          ? "error"
          : "warning";
    return <Chip label={status} color={color} size="small" />;
  };

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
                    {headCells.map((cell) => (
                      <TableCell key={cell.id} sx={{ fontWeight: "bold" }}>
                        {cell.label}
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
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                      {!isHistory && (
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
                      )}
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <DetailModal
          purchase={selectedPurchase}
          apiBaseUrl={apiBaseUrl}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </Box>
  );
}
