"use client";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import { useState } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useCreateProperty } from "@/hooks/property/useProperty";
import Image from "next/image";

const AddProperty = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_id: "",
    property_name: "",
    price: "",
    sq_meter: "",
    description: "",
    images: [], // State untuk menampung array file gambar
  });
  const [previews, setPreviews] = useState([]); // State untuk URL pratinjau

  const { data: dataTypes } = useGetTypesAll();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({ ...formData, images: filesArray });

      // Buat URL pratinjau untuk setiap file
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  const createProperty = useCreateProperty();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProperty.mutateAsync(formData);
      router.back();
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  return (
    <AuthWrapper allowedRoles={["admin", "owner"]}>
      <Layout>
        <Box
          sx={{
            width: "100%",
            mx: "auto",
            mt: 5,
            backgroundColor: "#ffffff",
            py: 3,
            px: 4,
            borderRadius: "12px",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Tambah Data Properti
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nama Rumah"
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-select-label">Tipe</InputLabel>
              <Select
                labelId="type-select-label"
                value={formData.type_id}
                name="type_id"
                label="Tipe"
                onChange={handleChange}
                required
              >
                {dataTypes?.map((type) => (
                  <MenuItem key={type.type_id} value={type.type_id}>
                    {type.type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Harga"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Luas (m²)"
              name="sq_meter"
              value={formData.sq_meter}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
              margin="normal"
            />

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Gambar Properti (Bisa Pilih Banyak)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {/* Pratinjau Gambar */}
            {previews.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pratinjau Gambar:
                </Typography>
                <Grid container spacing={2}>
                  {previews.map((src, index) => (
                    <Grid item key={index}>
                      <Image
                        src={src}
                        alt={`preview-${index}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={createProperty.isLoading}
              >
                Tambah Properti
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </Box>
          </form>
        </Box>
      </Layout>
    </AuthWrapper>
  );
};

export default AddProperty;
