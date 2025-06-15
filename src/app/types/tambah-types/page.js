"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Layout from "@/components/layout";
import { useCreateAdmin } from "@/hooks/admin/useAdmin";
import { useRouter } from "next/navigation";
import { useCreateTypes } from "@/hooks/types/useTypes";
import AuthWrapper from "@/helpers/AuthWrapper";
// import { useCreateBranche } from '@/hooks/branch/useBranches';

const AddTypes = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createType = useCreateTypes();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await createType.mutateAsync({
        type_name: formData?.type_name,
      });
      router.back();
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  console.log(JSON.stringify(formData));

  return (
    <AuthWrapper allowedRoles={["admin"]}>
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
            Tambah Data Tipe Perumahan
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nama Tipe"
              name="type_name"
              value={formData.type_name}
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
                Tambah Tipe
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

export default AddTypes;
