"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Layout from "@/components/layout";
import { useCreateAdmin } from "@/hooks/admin/useAdmin";
import { useRouter } from "next/navigation";
// import AuthWrapper from '@/helpers/AuthWrapper';
// import { useCreateBranche } from '@/hooks/branch/useBranches';

const AddBranch = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createBranch = useCreateBranche();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await createBranch.mutateAsync({
        branch_name: formData?.branch_name,
        address: formData?.address,
      });
      router.back();
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  console.log(JSON.stringify(formData));

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
      <Layout>
        <Box
          sx={{
            maxWidth: "100%",
            mx: "auto",
            mt: 5,
            backgroundColor: "#ffffff",
            py: 3,
            px: 4,
            borderRadius: "12px",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 5 }}>
            Tambah Data Cabang Tama Game
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nama Cabang"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Alamat"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <div className="flex justify-between mt-5">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="medium"
              >
                Tambah Cabang
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  router.back();
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </Box>
      </Layout>
    </AuthWrapper>
  );
};

export default AddBranch;
