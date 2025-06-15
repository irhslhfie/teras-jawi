import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";
import { Typography, Button, Box } from "@mui/material";

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

  if (isLoading) return <Typography>Loading purchase status...</Typography>;
  if (error)
    return <Typography color="error">Error loading purchase status</Typography>;
  if (!purchaseStatus) return null;

  return (
    <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6">Purchase Status</Typography>
      <Typography>Property: {purchaseStatus.property_name}</Typography>
      <Typography>Type: {purchaseStatus.type_name}</Typography>
      <Typography>Status: {purchaseStatus.status}</Typography>
      {purchaseStatus.status === "Pending" && (
        <Button variant="contained" color="primary" sx={{ mt: 1 }}>
          Check Progress
        </Button>
      )}
      {purchaseStatus.status === "Confirmed" && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          Check your email for the invoice to proceed with the transaction.
        </Typography>
      )}
    </Box>
  );
};

export default PurchaseStatus;
