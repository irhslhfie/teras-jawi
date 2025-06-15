"use client";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Layout from "@/components/layout";
import { useParams, useRouter } from "next/navigation";
import AuthWrapper from "@/helpers/AuthWrapper";
import GradientCircularProgress from "@/components/Progress";
import {
  useGetFacilityById,
  useUpdateFacility,
} from "@/hooks/facilities/useFacilities";
import { useGetTypesAll } from "@/hooks/types/useTypes";

const UpdateFacility = () => {
  const param = useParams();
  const { facility_id } = param;
  const router = useRouter();
  const [formData, setFormData] = useState({
    type_id: "",
    facility_name: "",
    quantity: "",
  });

  const {
    data: facilityData,
    isLoading: isLoadingFacility,
    isError: isErrorFacility,
    error: errorFacility,
    isSuccess: isFacilitySuccess,
  } = useGetFacilityById({ facility_id });

  const { data: typesData, isLoading: isLoadingTypes } = useGetTypesAll();

  useEffect(() => {
    if (facilityData) {
      setFormData({
        type_id: facilityData.type_id,
        facility_name: facilityData.facility_name,
        quantity: facilityData.quantity,
      });
    }
  }, [facilityData, isFacilitySuccess]);

  const updateFacility = useUpdateFacility({ facility_id });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data yang akan diupdate:", formData);

    try {
      await updateFacility.mutateAsync({
        facility_name: formData.facility_name,
        type_id: formData.type_id,
        quantity: formData.quantity,
      });
      router.push("/facilities");
    } catch (error) {
      console.error("Terjadi error saat mengupdate fasilitas:", error);
    }
  };

  if (isLoadingFacility || isLoadingTypes) {
    return (
      <div className="w-full flex justify-center items-center mt-10">
        <GradientCircularProgress />
      </div>
    );
  }

  if (isErrorFacility) {
    return (
      <div className="w-full flex justify-center items-center mt-10">
        <Typography color="error">
          Error fetching facility data: {errorFacility.message}
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
            Update Data Fasilitas
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="facility-name-label">Fasilitas</InputLabel>
              <Select
                labelId="facility-name-label"
                id="facility-name"
                value={formData.facility_name}
                name="facility_name"
                onChange={handleChange}
              >
                {[
                  "Bathroom",
                  "Kitchen",
                  "Living Room",
                  "Bedroom",
                  "Garage",
                  "Garden",
                  "Balcony",
                  "Storage Room",
                  "Laundry Room",
                ].map((facility) => (
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="type-id-label">Tipe</InputLabel>
              <Select
                labelId="type-id-label"
                id="type-id"
                value={formData.type_id}
                name="type_id"
                onChange={handleChange}
              >
                {typesData?.length > 0 ? (
                  typesData.map((type) => (
                    <MenuItem key={type.type_id} value={type.type_id}>
                      {type.type_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Belum ada data tipe!</MenuItem>
                )}
              </Select>
            </FormControl>
            <div className="flex justify-between mt-5">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="medium"
              >
                Update Fasilitas
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => router.back()}
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

export default UpdateFacility;
