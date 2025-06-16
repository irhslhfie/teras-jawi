"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Modal,
  Box,
  CircularProgress,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLogout } from "@/hooks/auth/useLogin";
import PropertyMap from "@/components/PropertyMap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/helpers";
import { toast } from "sonner";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const StyledAppBar = styled(AppBar)({
  /* ... */
});
const StyledButton = styled(Button)({
  /* ... */
});

export default function ListingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { isLoggedIn, fullname, userId } = useAuthStatus(); // Custom hook sederhana untuk auth status

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const purchaseMutation = useMutation({
    mutationFn: (purchaseData) => api.post("/purchases", purchaseData),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Permintaan pembelian berhasil dikirim! Silakan pantau status di halaman profil Anda."
      );
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setPaymentModalOpen(false);
      setSelectedProperty(null);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Gagal mengajukan pembelian.";
      toast.error(errorMessage);
    },
  });

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
  };
  const handleCloseDetailModal = () => setSelectedProperty(null);

  const handleOpenPaymentModal = () => {
    if (!isLoggedIn) {
      toast.error("Silakan masuk terlebih dahulu untuk melakukan pembelian.");
      return router.push("/auth/signin");
    }
    if (isLoadingProfile) return toast.info("Memeriksa profil...");
    if (!userProfile?.image_ktp || !userProfile?.image_kk) {
      toast.warning(
        "Harap lengkapi profil Anda (KTP & KK) sebelum melakukan pembelian."
      );
      return router.push("/profile");
    }
    setPaymentModalOpen(true);
  };

  const handleFinalPurchase = () => {
    if (selectedProperty) {
      purchaseMutation.mutate({
        user_id: userId,
        property_id: selectedProperty.property_id,
        total_price: selectedProperty.price,
        payment_method: paymentMethod,
      });
    }
  };

  const handleImageNavigation = (direction) => {
    /* ... */
  };
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URI
    ? process.env.NEXT_PUBLIC_API_URI.replace("/api/v1", "")
    : "";

  return (
    <div>
      <StyledAppBar position="static">{/* ... Navbar ... */}</StyledAppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Denah Interaktif Perumahan
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Arahkan kursor untuk melihat info, dan klik unit yang tersedia untuk
          detail.
        </Typography>
        <PropertyMap onPropertyClick={handlePropertyClick} />

        {/* Modal Detail Properti */}
        <Modal open={!!selectedProperty} onClose={handleCloseDetailModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", md: 500 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              outline: "none",
            }}
          >
            {selectedProperty && (
              <>
                {/* ... Slider gambar ... */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {selectedProperty.property_name}
                </Typography>
                {/* ... Detail teks ... */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    onClick={handleOpenPaymentModal}
                    variant="contained"
                    color="primary"
                  >
                    Ajukan Pembelian
                  </Button>
                  <Button onClick={handleCloseDetailModal} variant="outlined">
                    Tutup
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Modal Baru untuk Pilihan Pembayaran */}
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
              <strong>{selectedProperty?.property_name}</strong>.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <ToggleButtonGroup
              color="primary"
              value={paymentMethod}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setPaymentMethod(newValue);
              }}
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

// Hook sederhana untuk membersihkan kode
function useAuthStatus() {
  const [isMounted, setIsMounted] = useState(false);
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    fullname: "",
    userId: null,
  });

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    const storedFullname = localStorage.getItem("fullname");
    const storedUserId = localStorage.getItem("user_id");

    if (token) {
      setAuthData({
        isLoggedIn: true,
        fullname: storedFullname ? JSON.parse(storedFullname) : "",
        userId: storedUserId ? JSON.parse(storedUserId) : null,
      });
    }
  }, []);

  return { ...authData, isMounted };
}
