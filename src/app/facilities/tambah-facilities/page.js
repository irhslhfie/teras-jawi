"use client";
import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useCreateFacility } from "@/hooks/facilities/useFacilities";

const AddFacility = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_id: "",
    facility_name: "",
    quantity: "",
  });
  const { data: dataTypes } = useGetTypesAll();

  const FACILITIES_OPTIONS = [
    "Bathroom",
    "Kitchen",
    "Living Room",
    "Bedroom",
    "Garage",
    "Garden",
    "Balcony",
    "Storage Room",
    "Laundry Room",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createFacility = useCreateFacility();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await createFacility.mutateAsync({
        facility_name: formData?.facility_name,
        type_id: formData?.type_id,
        quantity: formData?.quantity,
      });
      router.back();
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
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
            Tambah Data Fasilitas
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <InputLabel id="facility-name-label">Fasilitas</InputLabel>
              <Select
                labelId="facility-name-label"
                id="facility-name"
                value={formData?.facility_name}
                name="facility_name"
                label="Fasilitas"
                onChange={handleChange}
              >
                {FACILITIES_OPTIONS.map((facility) => (
                  <MenuItem key={facility} value={facility}>
                    {facility}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Jumlah"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              type="number"
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
            <div className="flex justify-between mt-5">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="medium"
              >
                Tambah Fasilitas
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

export default AddFacility;
