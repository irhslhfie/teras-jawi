"use client";

import React, { useState } from "react";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import Box from "@mui/material/Box";
import { useGetPurchaseHistory } from "@/hooks/purchases/usePurchases";
import TablePurchases from "../components/TablePurchases";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function PurchaseHistory() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [propertyType, setPropertyType] = useState("");

  const {
    data: dataPurchases,
    isLoading,
    isSuccess,
    error,
    refetch,
  } = useGetPurchaseHistory(startDate, endDate, propertyType);

  const handleFilter = () => {
    refetch();
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase History Report", 14, 15);

    const tableColumn = [
      "Username",
      "Email",
      "Property Type",
      "Property Name",
      "Total Price",
      "Status",
      "Date",
    ];
    const tableRows = dataPurchases.map((purchase) => [
      purchase.username,
      purchase.email,
      purchase.type_name,
      purchase.property_name,
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(purchase.total_price),
      purchase.status,
      new Date(purchase.created_at).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("purchase_history.pdf");
  };

  return (
    <AuthWrapper allowedRoles={["admin", "owner", "marketing"]}>
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
            <h1>Histori Pembelian</h1>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, px: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              label="Property Type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />
            <Button variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button variant="contained" onClick={handleGeneratePDF}>
              Generate PDF
            </Button>
          </Box>

          <TablePurchases
            data={dataPurchases}
            tableTitle={"Tabel Histori Pembelian"}
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
