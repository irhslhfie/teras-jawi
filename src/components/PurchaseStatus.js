import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";
import {
  Typography,
  Button,
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  CircularProgress,
} from "@mui/material";

const steps = [
  "Menunggu Konfirmasi",
  "Telah Dikonfirmasi",
  "Transaksi Selesai",
];

const PurchaseStatus = ({ userId }) => {
  const {
    data: purchaseStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["purchaseStatus", userId],
    queryFn: async () => {
      const response = await api.get(`/purchases/status/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !purchaseStatus) {
    return (
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Anda belum memiliki transaksi pembelian aktif.
      </Typography>
    );
  }

  let activeStep = 0;
  if (purchaseStatus.status === "Confirmed") {
    activeStep = 1;
  } else if (purchaseStatus.status === "Completed") {
    // Asumsi ada status 'Completed'
    activeStep = 2;
  }

  return (
    <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Status Pembelian Anda
      </Typography>
      <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography>
          <strong>Properti:</strong> {purchaseStatus.property_name}
        </Typography>
        <Typography>
          <strong>Tipe:</strong> {purchaseStatus.type_name}
        </Typography>
        <Typography>
          <strong>Status Saat Ini:</strong>{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {purchaseStatus.status}
          </span>
        </Typography>
      </Box>

      <Box sx={{ width: "100%", my: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {purchaseStatus.status === "Pending" && (
        <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
          Permintaan pembelian Anda sedang ditinjau oleh tim kami.
        </Typography>
      )}
      {purchaseStatus.status === "Confirmed" && (
        <Typography
          color="success.main"
          sx={{ mt: 1, textAlign: "center", fontWeight: "bold" }}
        >
          Selamat! Periksa email Anda untuk faktur dan instruksi transaksi
          selanjutnya.
        </Typography>
      )}
    </Paper>
  );
};

export default PurchaseStatus;
