"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Modal,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogin";
import PropertyMap from "@/components/PropertyMap";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";

// ... (keep the styled components)

export default function ListingsPage() {
  const router = useRouter();
  const { logout } = useLogout();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const isLoggedIn = !!localStorage.getItem("token");
  const fullname = localStorage.getItem("fullname");

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return null;
      const response = await api.get(`/users/${userId}`);
      return response.data;
    },
    enabled: isLoggedIn,
  });

  const handleBuyProperty = async () => {
    if (!isLoggedIn) {
      router.push("/auth/signin");
      return;
    }

    if (!userProfile?.ktp || !userProfile?.kk) {
      alert("Please complete your profile before making a purchase.");
      router.push("/profile");
      return;
    }

    try {
      const response = await api.post("/purchases", {
        user_id: localStorage.getItem("user_id"),
        property_id: selectedProperty.property_id,
        total_price: selectedProperty.price,
      });
      alert("Purchase request submitted. Please wait for admin confirmation.");
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error submitting purchase:", error);
      alert("Error submitting purchase. Please try again.");
    }
  };

  return (
    <div>
      <AppBar position="static">{/* ... (keep the AppBar content) */}</AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          List Perumahan
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Klik pada salah satu perumahan untuk melihat detail dan membeli.
        </Typography>

        <PropertyMap onPropertyClick={handlePropertyClick} />

        <Modal
          open={!!selectedProperty}
          onClose={handleCloseModal}
          aria-labelledby="property-modal-title"
          aria-describedby="property-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="property-modal-title" variant="h6" component="h2">
              {selectedProperty?.property_name}
            </Typography>
            <Typography id="property-modal-description" sx={{ mt: 2 }}>
              Type: {selectedProperty?.type_name}
              <br />
              Price: {selectedProperty?.price}
              <br />
              Size: {selectedProperty?.sq_meter} sq meters
              <br />
              Description: {selectedProperty?.description}
            </Typography>
            <Button onClick={handleBuyProperty} sx={{ mt: 2 }}>
              Buy This Property
            </Button>
            <Button onClick={handleCloseModal} sx={{ mt: 2, ml: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
      </Container>
    </div>
  );
}
