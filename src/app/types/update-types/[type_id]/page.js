"use client";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import Layout from "@/components/layout";
import { useParams, useRouter } from "next/navigation";
import {
  useGetTypesById,
  useUpdateType,
  useUpdateTypes,
} from "@/hooks/types/useTypes"; // hook untuk update type
import AuthWrapper from "@/helpers/AuthWrapper";
import GradientCircularProgress from "@/components/Progress";

const UpdateType = () => {
  const param = useParams();
  const { type_id } = param;
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_name: "",
    // Tambahkan field lainnya sesuai dengan type yang ingin diupdate
  });

  const {
    data: typeData,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetTypesById({ type_id }); // Ambil data type berdasarkan ID

  useEffect(() => {
    if (typeData) {
      setFormData({
        type_name: typeData.type_name,
      });
    }
  }, [typeData, isSuccess]);
  console.log(typeData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateType = useUpdateTypes({ type_id });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data yang akan diupdate:", formData);

    try {
      await updateType.mutateAsync({
        type_id: type_id, // Kirimkan type_id untuk mengidentifikasi data yang diupdate
        type_name: formData.type_name,
      });
      router.push("/types"); // Redirect setelah update
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center mt-10">
        <GradientCircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center mt-10">
        <Typography color="error">
          Error fetching type data: {error.message}
        </Typography>
      </div>
    );
  }

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
            Update Data Tipe
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
                Update Tipe
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

export default UpdateType;
