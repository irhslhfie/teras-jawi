"use client";

import React, { useState } from "react";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import Box from "@mui/material/Box";
import { useGetPurchaseHistory } from "@/hooks/purchases/usePurchases";
import TablePurchases from "../components/TablePurchases"; // Tabel yang sama digunakan
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
    isError,
    error,
    refetch,
  } = useGetPurchaseHistory(
    startDate ? startDate.format("YYYY-MM-DD") : null,
    endDate ? endDate.format("YYYY-MM-DD") : null,
    propertyType
  );

  const handleFilter = () => {
    refetch();
  };

  const handleGeneratePDF = () => {
    if (!dataPurchases || dataPurchases.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Laporan Histori Pembelian", 14, 15);

    const tableColumn = [
      "Nama Pembeli",
      "Properti",
      "Tipe",
      "Metode Bayar",
      "Harga",
      "Status",
      "Tanggal",
    ];
    const tableRows = dataPurchases.map((purchase) => [
      purchase.full_name,
      purchase.property_name,
      purchase.type_name,
      purchase.payment_method,
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(purchase.total_price),
      purchase.status,
      new Date(purchase.created_at).toLocaleDateString("id-ID"),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("histori_pembelian.pdf");
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

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2, px: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal Mulai"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="Tanggal Akhir"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              label="Tipe Properti"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            />
            <Button variant="contained" onClick={handleFilter}>
              Filter
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGeneratePDF}
            >
              Generate PDF
            </Button>
          </Box>

          <TablePurchases
            data={dataPurchases || []}
            tableTitle={"Tabel Histori Pembelian"}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isHistory={true} // <-- TAMBAHKAN PROP INI
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
