"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetUsersAll } from "@/hooks/admin/useAdmin";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TableUsers from "./components/TableUsers";

export default function Users() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState("");
  const {
    data: dataUsers,
    isLoading,
    isSuccess,
    error,
    refetch: refetchUsers,
  } = useGetUsersAll({
    name: searchQuery,
    role: searchQuery,
  });
  console.log("cek data user----", dataUsers);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(JSON.parse(role));
    }
  }, []);

  return (
    <AuthWrapper allowedRoles={["owner", "admin"]}>
      <Layout>
        <div className="w-full">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
              px: 2,
            }}
          >
            {/* <Button
                                variant="contained"
                                endIcon={<AddIcon />}
                                onClick={() => router.push('/users/tambah-user')}
                                >Tambah User
                            </Button> */}
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={() => router.push("/users/tambah-user")}
            >
              Tambah User
            </Button>
          </Box>
          <TableUsers
            data={dataUsers || []}
            tableTitle={"Tabel Data Users"}
            isError={error}
            isLoading={isLoading}
            role={userRole}
          />
        </div>
      </Layout>
    </AuthWrapper>
  );
}
