"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TableProperty from "./components/TableProperty";
import SearchAndFilter from "@/components/SearchAndFilter";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useGetPropertyAll } from "@/hooks/property/useProperty";

export default function Property() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ type_id: "" });

  const { data: dataTypes, isLoading: loadingTypes } = useGetTypesAll();
  const {
    data: dataProperty,
    isLoading,
    isSuccess,
    error,
    refetch: refetchProperty,
  } = useGetPropertyAll({
    property_name: searchQuery,
    type_id: filters.type_id,
  });

  // Filter options for SearchAndFilter component
  const filterOptions = useMemo(() => ({
    type_id: {
      label: "Tipe Properti",
      items: dataTypes?.map(type => ({
        value: type.type_id,
        label: type.type_name
      })) || []
    }
  }), [dataTypes]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ type_id: "" });
  };

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
      <Layout>
        <div className="w-full">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchAndFilter
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                onClearFilters={handleClearFilters}
                placeholder="Cari nama properti..."
              />
            </Box>

            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/property/tambah-property")}
              sx={{
                minWidth: "160px",
                height: "56px",
                mt: 3, // Align with search bar
              }}
            >
              Tambah Properti
            </Button>
          </Box>

          <TableProperty
            data={dataProperty || []}
            tableTitle={"Tabel Data Property"}
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}