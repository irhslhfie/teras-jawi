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
} from "@mui/material";
import { useState } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useCreateProperty } from "@/hooks/property/useProperty";

const AddProperty = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_id: "",
    property_name: "",
    price: "",
    sq_meter: "",
    description: "",
  });
  const { data: dataTypes } = useGetTypesAll();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createProperty = useCreateProperty();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await createProperty.mutateAsync({
        property_name: formData?.property_name,
        type_id: formData?.type_id,
        price: formData?.price,
        sq_meter: formData?.sq_meter,
        description: formData?.description,
      });
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
          <Typography variant="h5" gutterBottom sx={{ mb: 5 }}>
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tipe</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData?.type_id}
                name="type_id"
                label="Tipe"
                onChange={handleChange}
              >
                {dataTypes?.length <= 0 && (
                  <MenuItem value="">Belum ada data!</MenuItem>
                )}
                {dataTypes?.length > 0 &&
                  dataTypes?.map((type) => (
                    <MenuItem key={type?.type_id} value={type?.type_id}>
                      {type?.type_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Harga"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Luas/M"
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
              margin="normal"
            />
            <div className="flex justify-between mt-5">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="medium"
              >
                Tambah Properti
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

export default AddProperty;
