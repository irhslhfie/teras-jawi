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
import PropertyCard from "@/components/PropertyCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useLocalStorage";

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
  const { isAuthenticated, fullname, userId, role: userRole } = useAuth();
  const { logout } = useLogout();

  const [filters, setFilters] = useState({ type_id: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyToPurchase, setPropertyToPurchase] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Fetch data
  const { data: dataTypes } = useGetTypesAll();
  const {
    data: properties = [],
    isLoading,
    isError,
  } = useGetPropertyAll({
    type_id: filters.type_id,
    property_name: searchQuery,
  });

  // Get user profile if logged in
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // Purchase mutation
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

  // Filter options for SearchAndFilter component
  const filterOptions = useMemo(() => ({
    type_id: {
      label: "Tipe Properti",
      items: dataTypes?.map(type => ({
        value: type.type_id,
        label: type.type_name
      })) || []
    }
  }), [dataTypes]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ type_id: "" });
  };

  const handleOpenPurchaseFlow = (property) => {
    if (!isAuthenticated) {
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
    const isAdminOrOwner = ["admin", "owner", "marketing"].includes(userRole);
    
    if (isAuthenticated) {
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

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI?.replace("/api/v1", "") || "";

  if (isLoading) {
    return <LoadingSpinner message="Memuat properti..." />;
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

        {/* Search and Filter */}
        <SearchAndFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
          onClearFilters={handleClearFilters}
          placeholder="Cari nama properti..."
        />

        {/* Property Grid */}
        {isError && (
          <Typography color="error" align="center">
            Gagal memuat data properti.
          </Typography>
        )}
        
        {!isError && (
          <Grid container spacing={4}>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Grid item key={property.property_id} xs={12} sm={6} md={4}>
                  <PropertyCard
                    property={property}
                    onPurchase={handleOpenPurchaseFlow}
                    apiBaseUrl={apiBaseUrl}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6">
                    Tidak ada properti yang cocok dengan pencarian Anda.
                  </Typography>
                  <Button 
                    onClick={handleClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Reset Filter
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {/* Payment Modal */}
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