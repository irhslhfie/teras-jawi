"use client";
import Layout from "@/components/layout";
import GradientCircularProgress from "@/components/Progress";
import AuthWrapper from "@/helpers/AuthWrapper";
import {
  useGetPropertyById,
  useUpdateProperty,
} from "@/hooks/property/useProperty"; // Assuming useProperty is used for property API
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetTypesAll } from "@/hooks/types/useTypes";

const UpdateProperty = () => {
  const router = useRouter();
  const param = useParams();
  const { property_id } = param;

  const [formData, setFormData] = useState({
    type_id: "",
    property_name: "",
    price: "",
    sq_meter: "",
    description: "",
  });

  const {
    data: dataProperty,
    isLoading,
    error,
    isSuccess,
  } = useGetPropertyById({ property_id });
  const { data: dataTypes, isLoading: typesLoading } = useGetTypesAll(); // Assuming this fetches property types

  useEffect(() => {
    if (dataProperty) {
      console.log("Trigeeee");
      setFormData({
        property_name: dataProperty?.property_name,
        type_id: dataProperty?.type_id,
        price: dataProperty?.price,
        sq_meter: dataProperty?.sq_meter,
        description: dataProperty?.description,
      });
    }
  }, [dataProperty, isSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateProperty = useUpdateProperty({ property_id });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cek Data Input---", formData);

    try {
      await updateProperty.mutateAsync({
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

  console.log(formData, "----cekkk");

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
            Update Data Properti
          </Typography>
          {isLoading && typesLoading && (
            <div className="w-full flex justify-center items-center mt-10">
              <GradientCircularProgress />
            </div>
          )}
          {error && (
            <div className="w-full flex justify-center items-center mt-10">
              <Typography color="error">
                Error fetching data: {error.message}
              </Typography>
            </div>
          )}
          {!isLoading && !typesLoading && dataProperty && (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nama Rumah"
                name="property_name"
                value={formData?.property_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Tipe</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  value={formData?.type_id}
                  name="type_id"
                  label="Tipe"
                  onChange={handleChange}
                >
                  {dataTypes?.length <= 0 && (
                    <MenuItem value="">Belum ada data tipe!</MenuItem>
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
                value={formData?.price}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Luas (m²)"
                name="sq_meter"
                value={formData?.sq_meter}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Deskripsi"
                name="description"
                value={formData?.description}
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
                  Update Properti
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
          )}
        </Box>
      </Layout>
    </AuthWrapper>
  );
};

export default UpdateProperty;
