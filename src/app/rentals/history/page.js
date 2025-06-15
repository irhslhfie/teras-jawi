"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
// import { useGetBranchAll } from "@/hooks/branch/useBranches";
import { useGetRentalDone } from "@/hooks/rentals/useRentals";
import { Box, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import TableHistoryRentals from "./components/TableHistoryRentals";

// Import jsPDF
import MultipleSelectChipBranch from "@/components/SelectInputCabang";
import jsPDF from "jspdf";
import "jspdf-autotable";

const theme = createTheme();

export default function PlaystationHistory() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [startDate, setStartDate] = useState(null);

  const { data: dataBranch, isLoading: loadingBranch } = useGetBranchAll();
  const {
    data: dataRental,
    isLoading,
    error,
  } = useGetRentalDone(
    startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
    selectedBranch
  );

  const branchOptions = useMemo(() => {
    if (!dataBranch) return [];
    return dataBranch.map((branch) => ({
      value: branch.branch_id,
      label: branch.branch_name,
    }));
  }, [dataBranch]);

  // Fungsi untuk mencetak PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    const filteredDate = startDate
      ? dayjs(startDate).format("DD-MM-YYYY")
      : "Semua";
    const branchName =
      branchOptions.find((b) => b.value === selectedBranch)?.label || "Semua";

    // Judul PDF
    doc.text("Histori Penyewaan Playstation", 14, 10);
    doc.text(`Tanggal: ${filteredDate}`, 14, 18);
    doc.text(`Cabang: ${branchName}`, 14, 26);

    // Kolom yang akan ditampilkan
    const tableColumn = [
      "ID",
      "Nama Lengkap",
      "Cabang",
      "Tipe PS",
      "Nomor PS",
      "Tipe Sewa",
      "Total Harga",
      "Status",
    ];

    // Data yang diformat dan diterjemahkan
    const tableRows = dataRental.map((rental) => [
      rental.rental_id,
      rental.full_name,
      rental.branch_name,
      rental.ps_type,
      rental.ps_number,
      rental.rental_type === "on-site"
        ? "Ditempat"
        : rental.rental_type === "take-home"
          ? "Dibawa Pulang"
          : rental.rental_type,
      rental.total_price.toLocaleString(), // Format angka ribuan
      rental.status === "completed" ? "Selesai" : rental.status,
    ]);

    // Tambahkan tabel menggunakan autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      styles: { fontSize: 8 }, // Ukuran font
      columnStyles: {
        0: { cellWidth: 10 }, // ID
        1: { cellWidth: 35 }, // Nama Lengkap
        2: { cellWidth: 25 }, // Cabang
        3: { cellWidth: 15 }, // Tipe PS
        4: { cellWidth: 15 }, // Nomor PS
        5: { cellWidth: 25 }, // Tipe Sewa
        6: { cellWidth: 20 }, // Total Harga
        7: { cellWidth: 20 }, // Status
      },
      margin: { top: 32 },
    });

    // Simpan PDF
    doc.save("histori_penyewaan.pdf");
  };

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
      <Layout>
        <ThemeProvider theme={theme}>
          <div className="w-full">
            {/* Filter Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                px: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <div className="flex space-x-2 items-center">
                <MultipleSelectChipBranch
                  title="Pilih Cabang"
                  names={branchOptions}
                  personName={selectedBranch ? [selectedBranch] : []}
                  setPersonName={(selected) =>
                    setSelectedBranch(selected[0] || "")
                  }
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box>
                    <DatePicker
                      label="Pilih Tanggal"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </Box>
                </LocalizationProvider>
              </div>

              {/* Tombol Cetak */}
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrintPDF}
              >
                Cetak PDF
              </Button>
            </Box>

            {/* Table Section */}
            <TableHistoryRentals
              data={dataRental}
              tableTitle={"Tabel Data Histori Penyewaan"}
              isLoading={isLoading}
              isError={error}
            />
          </div>
        </ThemeProvider>
      </Layout>
    </AuthWrapper>
  );
}
