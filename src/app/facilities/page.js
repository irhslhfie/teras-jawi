"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetFacilitiesAll } from "@/hooks/facilities/useFacilities"; // Renamed to useFacilities
import TableFacilities from "./components/TableFacilities";

export default function Facilities() {
  const router = useRouter();
  const {
    data: dataFacilities,
    isLoading,
    isSuccess,
    error,
    refetch: refetchFacilities, // Renamed to refetchFacilities
  } = useGetFacilitiesAll();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <div className="w-full">
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/facilities/tambah-facilities")} // Changed path to facilities
            >
              Tambah Fasilitas
            </Button>
          </Box>
          <TableFacilities // Renamed component to TableFacilities
            data={dataFacilities}
            tableTitle={"Tabel Data Fasilitas"} // Changed title to Fasilitas
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
