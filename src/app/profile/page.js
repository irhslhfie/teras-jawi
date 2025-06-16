"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  CircularProgress,
  Paper,
  Alert,
  Grid,
  Icon,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogin";
import { api } from "@/helpers";
import { toast } from "sonner";
import PurchaseStatus from "@/components/PurchaseStatus";
import Image from "next/image";

// Import Ikon
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // <-- Centang Hijau
import CancelIcon from "@mui/icons-material/Cancel"; // <-- Silang Merah

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#ffffff",
  color: "#171717",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const StyledButton = styled(Button)({
  color: "#171717",
  marginLeft: "10px",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useLogout();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk menampung file baru yang akan diupload
  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);
  const [npwpFile, setNpwpFile] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userIdString = localStorage.getItem("user_id");
      if (!userIdString) throw new Error("Sesi tidak ditemukan.");

      const userId = JSON.parse(userIdString);
      const response = await api.get(`/users/${userId}`);

      if (!response.data) throw new Error("Profil pengguna tidak ditemukan.");

      setProfile(response.data);
    } catch (error) {
      toast.error(
        error.message || "Gagal memuat profil. Silakan login kembali."
      );
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 15 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Harap unggah JPG atau PNG.");
      return;
    }
    if (file.size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimal 15 MB.");
      return;
    }

    if (type === "ktp") setKtpFile(file);
    if (type === "kk") setKkFile(file);
    if (type === "npwp") setNpwpFile(file);

    toast.info(`File ${file.name} siap untuk diunggah.`);
  };

  const handleUpdateProfileText = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user_id"));
      await api.put(`/users/${userId}`, {
        full_name: profile.full_name,
        email: profile.email,
        phone_number: profile.phone_number,
        username: profile.username,
        role: profile.role,
      });
      toast.success("Data teks profil berhasil diperbarui");
    } catch (error) {
      const errorMessage =
        error.response?.data?.data ||
        error.response?.data ||
        "Gagal memperbarui data teks.";
      toast.error(errorMessage);
    }
  };

  const handleUploadImages = async () => {
    const formData = new FormData();
    let hasFiles = false;

    if (ktpFile instanceof File) {
      formData.append("image_ktp", ktpFile);
      hasFiles = true;
    }
    if (kkFile instanceof File) {
      formData.append("image_kk", kkFile);
      hasFiles = true;
    }
    if (npwpFile instanceof File) {
      formData.append("image_npwp", npwpFile);
      hasFiles = true;
    }

    if (!hasFiles) {
      toast.info("Tidak ada gambar baru untuk diunggah.");
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem("user_id"));
      await api.put(`/users/upload-docs/${userId}`, formData);
      toast.success("Gambar berhasil diunggah! Memuat ulang data...");
      setKtpFile(null);
      setKkFile(null);
      setNpwpFile(null);
      fetchProfile();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengunggah gambar.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/images/web/icon-192.png"
              alt="Teras Jawi Logo"
              width={40}
              height={40}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ ml: 1, fontWeight: "bold" }}
            >
              Teras Jawi
            </Typography>
          </Box>
          <StyledButton onClick={() => router.push("/")}>Beranda</StyledButton>
          <StyledButton onClick={() => router.push("/listings")}>
            Properti
          </StyledButton>
          <StyledButton onClick={logout} variant="contained" color="error">
            Keluar
          </StyledButton>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Profil Saya
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          {profile ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Informasi Personal</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nama Lengkap"
                  name="full_name"
                  value={profile.full_name || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nomor Telepon"
                  name="phone_number"
                  value={profile.phone_number || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone_number: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleUpdateProfileText}
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                >
                  Simpan Perubahan Data
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="error">
              Tidak dapat memuat data profil. Silakan coba lagi nanti.
            </Alert>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">Dokumen Pendukung</Typography>
            </Grid>

            {/* KTP Section */}
            <Grid item xs={10}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                {ktpFile instanceof File ? ktpFile.name : "Upload KTP"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileChange(e, "ktp")}
                />
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              {profile?.image_ktp || ktpFile ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Grid>

            {/* KK Section */}
            <Grid item xs={10}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                {kkFile instanceof File ? kkFile.name : "Upload KK"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileChange(e, "kk")}
                />
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              {profile?.image_kk || kkFile ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Grid>

            {/* NPWP Section */}
            <Grid item xs={10}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
              >
                {npwpFile instanceof File ? npwpFile.name : "Upload NPWP"}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png"
                  onChange={(e) => handleFileChange(e, "npwp")}
                />
              </Button>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              {profile?.image_npwp || npwpFile ? (
                <CheckCircleIcon color="success" />
              ) : (
                <CancelIcon color="error" />
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                onClick={handleUploadImages}
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CloudUploadIcon />}
              >
                Unggah Dokumen yang Dipilih
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <PurchaseStatus userId={profile?.user_id} />
      </Container>
    </div>
  );
}
