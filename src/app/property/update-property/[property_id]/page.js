"use client";
import Layout from "@/components/layout";
import GradientCircularProgress from "@/components/Progress";
import AuthWrapper from "@/helpers/AuthWrapper";
import {
  useGetPropertyById,
  useUpdateProperty,
  useAddPropertyImages,
  useDeletePropertyImage,
} from "@/hooks/property/useProperty";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";

const UpdateProperty = () => {
  const router = useRouter();
  const { property_id } = useParams();

  const [formData, setFormData] = useState({
    type_id: "",
    property_name: "",
    price: "",
    sq_meter: "",
    description: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const { data: dataProperty, isLoading } = useGetPropertyById({ property_id });
  const { data: dataTypes, isLoading: typesLoading } = useGetTypesAll();
  const updatePropertyMutation = useUpdateProperty({ property_id });
  const addImagesMutation = useAddPropertyImages();
  const deleteImageMutation = useDeletePropertyImage();

  useEffect(() => {
    if (dataProperty) {
      console.log("DATA DARI API:", dataProperty); // Untuk debugging
      setFormData({
        type_id: dataProperty.type_id || "",
        property_name: dataProperty.property_name || "",
        price: dataProperty.price || "",
        sq_meter: dataProperty.sq_meter || "",
        description: dataProperty.description || "",
      });
      setExistingImages(dataProperty.images || []);
    }
  }, [dataProperty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(filesArray);
      setNewPreviews(filesArray.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleUpdateText = async () => {
    await updatePropertyMutation.mutateAsync(formData);
  };

  const handleAddImages = async () => {
    if (newImages.length === 0) {
      return toast.info("Pilih gambar baru terlebih dahulu.");
    }
    await addImagesMutation.mutateAsync({ property_id, images: newImages });
    setNewImages([]);
    setNewPreviews([]);
  };

  const handleDeleteImage = async (image_id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus gambar ini?")) {
      await deleteImageMutation.mutateAsync(image_id);
    }
  };

  if (isLoading || typesLoading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <GradientCircularProgress />
        </Box>
      </Layout>
    );
  }

  // Membangun URL dasar dari environment variable
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI.replace("/api/v1", "");

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
          <Typography variant="h5" gutterBottom>
            Update Data Properti
          </Typography>

          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informasi Properti
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nama Rumah"
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipe</InputLabel>
                  <Select
                    name="type_id"
                    label="Tipe"
                    value={formData.type_id}
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Harga"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Luas (m²)"
                  name="sq_meter"
                  value={formData.sq_meter}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Deskripsi"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleUpdateText}
                  variant="contained"
                  disabled={updatePropertyMutation.isLoading}
                >
                  Simpan Perubahan Teks
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Gambar Saat Ini
            </Typography>
            <Grid container spacing={2}>
              {existingImages.length > 0 ? (
                existingImages
                  .filter((img) => img && img.image_path)
                  .map((img) => {
                    const imageUrl = `${apiBaseUrl}${img.image_path}`;
                    console.log("Mencoba render URL:", imageUrl); // Untuk debugging
                    return (
                      <Grid item key={img.image_id}>
                        <Box position="relative">
                          <Image
                            src={imageUrl}
                            alt="Gambar Properti"
                            width={150}
                            height={150}
                            style={{ objectFit: "cover", borderRadius: "8px" }}
                            unoptimized
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(255,255,255,0.7)",
                            }}
                            onClick={() => handleDeleteImage(img.image_id)}
                            disabled={deleteImageMutation.isLoading}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Box>
                      </Grid>
                    );
                  })
              ) : (
                <Typography sx={{ ml: 2 }}>Tidak ada gambar.</Typography>
              )}
            </Grid>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tambah Gambar Baru
            </Typography>
            <Button variant="outlined" component="label" fullWidth>
              Pilih Gambar (Bisa Pilih Banyak)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {newPreviews.length > 0 && (
              <Box mt={2}>
                <Grid container spacing={2}>
                  {newPreviews.map((src, index) => (
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
              </Box>
            )}
            <Button
              onClick={handleAddImages}
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              disabled={addImagesMutation.isLoading || newImages.length === 0}
            >
              Unggah Gambar Baru
            </Button>
          </Paper>

          <Button
            variant="outlined"
            sx={{ mt: 4 }}
            onClick={() => router.back()}
          >
            Kembali
          </Button>
        </Box>
      </Layout>
    </AuthWrapper>
  );
};

export default UpdateProperty;
