"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography as MuiTypography,
} from "@mui/material";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useRouter } from "next/navigation";
import { useCreateBrochure } from "@/hooks/brochures/useBrochures";
import { useGetUsersAll } from "@/hooks/admin/useAdmin"; // Importing useGetUsersAll directly

export default function UploadBrochure() {
  const router = useRouter();
  const createBrochure = useCreateBrochure();

  // Fetch marketing users using useGetUsersAll directly
  const { data: marketingUsers, isLoading: isLoadingUsers } = useGetUsersAll({
    role: "marketing",
  });

  const [formData, setFormData] = useState({
    brochure_title: "",
    brochure_desc: "",
    user_id: "",
    file: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBrochure.mutateAsync(formData);
      router.push("/brochuresadmin");
    } catch (error) {
      console.error("Error uploading brochure:", error);
    }
  };

  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Upload Brosur
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Judul Brosur"
              name="brochure_title"
              value={formData.brochure_title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Deskripsi Brosur"
              name="brochure_desc"
              value={formData.brochure_desc}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="user-select-label">User Marketing</InputLabel>
              <Select
                labelId="user-select-label"
                label="User Marketing"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                margin="normal"
                required
              >
                {isLoadingUsers ? (
                  <MenuItem disabled>Loading users...</MenuItem>
                ) : (
                  marketingUsers?.map((user) => (
                    <MenuItem key={user.user_id} value={user.user_id}>
                      {user.username}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Custom file upload button */}
            <Stack spacing={2} mt={2}>
              <label htmlFor="file-upload">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  component="span"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: "10px 20px",
                    backgroundColor: "#1976d2", // primary color
                  }}
                >
                  Choose File
                </Button>
              </label>

              {/* Show file name if a file is selected */}
              {formData.file && (
                <MuiTypography variant="body2" color="textSecondary">
                  {formData.file.name}
                </MuiTypography>
              )}
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Upload Brosur
              </Button>
              <Button variant="outlined" onClick={() => router.back()}>
                Batal
              </Button>
            </Box>
          </form>
        </Box>
      </Layout>
    </AuthWrapper>
  );
}
