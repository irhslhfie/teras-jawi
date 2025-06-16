"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Modal,
  Box,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLogout } from "@/hooks/auth/useLogin";
import { useGetPropertyAll } from "@/hooks/property/useProperty";
import { useGetTypesAll } from "@/hooks/types/useTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";

// Komponen AppBar dan Button tetap sama
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

export default function ListingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({ type_id: "" });
  const [propertyToPurchase, setPropertyToPurchase] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const { isLoggedIn, fullname, userId, isMounted, userRole } = useAuthStatus();
  const { logout } = useLogout();

  // Mengambil data untuk filter dan properti
  const { data: dataTypes } = useGetTypesAll();
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useGetPropertyAll({
    type_id: filters.type_id,
  });

  // Mengambil profil pengguna jika sudah login
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Mutasi untuk proses pembelian
  const purchaseMutation = useMutation({
    mutationFn: (purchaseData) => api.post("/purchases", purchaseData),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Permintaan pembelian berhasil dikirim! Pantau status di halaman profil."
      );
      queryClient.invalidateQueries(["properties"]);
      setPaymentModalOpen(false);
      setPropertyToPurchase(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal mengajukan pembelian."
      );
    },
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenPurchaseFlow = (property) => {
    if (!isLoggedIn) {
      toast.error("Silakan masuk terlebih dahulu untuk melakukan pembelian.");
      return router.push("/auth/signin");
    }
    if (isLoadingProfile) return toast.info("Memeriksa data profil...");
    if (!userProfile?.image_ktp || !userProfile?.image_kk) {
      toast.warning(
        "Harap lengkapi KTP & KK di halaman profil Anda sebelum membeli."
      );
      return router.push("/profile");
    }
    setPropertyToPurchase(property);
    setPaymentModalOpen(true);
  };

  const handleFinalPurchase = () => {
    if (propertyToPurchase) {
      purchaseMutation.mutate({
        user_id: userId,
        property_id: propertyToPurchase.property_id,
        total_price: propertyToPurchase.price,
        payment_method: paymentMethod,
      });
    }
  };

  const renderAuthButtons = () => {
    if (!isMounted) return null;
    const isAdminOrOwner =
      userRole === "admin" || userRole === "owner" || userRole === "marketing";
    if (isLoggedIn) {
      return (
        <>
          <Button
            color="inherit"
            onClick={() =>
              router.push(isAdminOrOwner ? "/dashboard" : "/profile")
            }
          >
            {isAdminOrOwner ? "Dashboard" : fullname}
          </Button>
          <Button
            onClick={logout}
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
          >
            Keluar
          </Button>
        </>
      );
    } else {
      return (
        <Button
          onClick={() => router.push("/auth/signin")}
          variant="contained"
          sx={{ ml: 2 }}
        >
          Masuk
        </Button>
      );
    }
  };

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URI?.replace("/api/v1", "") || "";

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
          <Button color="inherit" onClick={() => router.push("/")}>
            Beranda
          </Button>
          <Button color="inherit" onClick={() => router.push("/listings")}>
            Properti
          </Button>
          {renderAuthButtons()}
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Daftar Properti
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Temukan properti impian yang sesuai dengan kebutuhan Anda.
        </Typography>

        {/* Filter Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 4, display: "flex", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="type-filter-label">
              Filter Berdasarkan Tipe
            </InputLabel>
            <Select
              labelId="type-filter-label"
              name="type_id"
              value={filters.type_id}
              label="Filter Berdasarkan Tipe"
              onChange={handleFilterChange}
            >
              <MenuItem value="">
                <em>Tampilkan Semua</em>
              </MenuItem>
              {dataTypes?.map((type) => (
                <MenuItem key={type.type_id} value={type.type_id}>
                  {type.type_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Property Grid Section */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Typography color="error" align="center">
            Gagal memuat data properti.
          </Typography>
        )}
        {!isLoading && !isError && (
          <Grid container spacing={4}>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Grid item key={property.property_id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        property.images?.[0]
                          ? `${apiBaseUrl}${property.images[0]}`
                          : "/images/teras_jawi.jpg"
                      }
                      alt={property.property_name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {property.property_name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {property.type_name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(property.price)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleOpenPurchaseFlow(property)}
                        disabled={property.status !== "Tersedia"}
                      >
                        {property.status === "Tersedia"
                          ? "Ajukan Pembelian"
                          : "Terjual"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Container sx={{ textAlign: "center", my: 5 }}>
                <Typography variant="h6">
                  Tidak ada properti yang cocok dengan filter Anda.
                </Typography>
              </Container>
            )}
          </Grid>
        )}

        {/* Modal untuk Pilihan Pembayaran */}
        <Modal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: 450 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pilih Metode Pembayaran
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Anda akan mengajukan pembelian untuk properti{" "}
              <strong>{propertyToPurchase?.property_name}</strong>.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <ToggleButtonGroup
              color="primary"
              value={paymentMethod}
              exclusive
              onChange={(e, val) => val && setPaymentMethod(val)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <ToggleButton value="Cash">Tunai (Cash)</ToggleButton>
              <ToggleButton value="Kredit">Kredit (KPR)</ToggleButton>
            </ToggleButtonGroup>
            <Button
              onClick={handleFinalPurchase}
              variant="contained"
              fullWidth
              disabled={purchaseMutation.isLoading}
            >
              {purchaseMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Konfirmasi & Ajukan"
              )}
            </Button>
          </Box>
        </Modal>
      </Container>
    </div>
  );
}

// Hook untuk status otentikasi
function useAuthStatus() {
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    fullname: "",
    userId: null,
    isMounted: false,
    userRole: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthData({
        isLoggedIn: true,
        fullname: JSON.parse(localStorage.getItem("fullname") || '""'),
        userId: JSON.parse(localStorage.getItem("user_id") || "null"),
        userRole: JSON.parse(localStorage.getItem("role") || '""'),
        isMounted: true,
      });
    } else {
      setAuthData((prev) => ({ ...prev, isMounted: true }));
    }
  }, []);

  return authData;
}
