"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TableProperty from "./components/TableProperty";
import MultipleSelectChip from "@/components/SelectInput";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useGetPropertyAll } from "@/hooks/property/useProperty";

export default function Property() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeId, setTypeId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const { data: dataTypes, isLoading: loadingTypes } = useGetTypesAll();
  const {
    data: dataProperty,
    isLoading,
    isSuccess,
    error,
    refetch: refetchProperty,
  } = useGetPropertyAll({
    type_name: searchQuery,
    type_id: typeId,
  });

  useEffect(() => {
    const roleUser = localStorage.getItem("role");

    if (roleUser) {
      setUserRole(JSON.parse(roleUser));
    }
  }, []);

  //   useEffect(() => {
  //     refetchProperty();
  //   }, [searchQueryPS, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const typeIds = useMemo(() => {
    if (!dataTypes) return [];
    return dataTypes.map((types) => types.type_name);
  }, [dataTypes]);

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
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
            <div className="flex space-x-2">
              {!loadingTypes && dataTypes && (
                <MultipleSelectChip
                  title={"Pilih Tipe"}
                  names={typeIds}
                  personName={searchQuery}
                  setPersonName={setSearchQuery}
                />
              )}
            </div>

            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/property/tambah-property")}
              sx={{
                padding: "8px 16px",
                fontSize: "0.875rem",
                height: "40px",
              }}
            >
              Tambah
            </Button>
          </Box>

          <TableProperty
            data={dataProperty}
            tableTitle={"Tabel Data Property"}
            isLoading={isLoading}
            isError={error}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
