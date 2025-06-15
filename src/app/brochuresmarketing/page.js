"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetBrochuresByUser } from "@/hooks/brochures/useBrochures";

export default function BrochuresMarketing() {
  const [userId, setUserId] = useState(null);
  const [selectedBrochure, setSelectedBrochure] = useState(null);
  const {
    data: brochures,
    isLoading,
    isError,
    error,
  } = useGetBrochuresByUser(userId);

  const handleOpenModal = (brochure) => {
    setSelectedBrochure(brochure);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      try {
        setUserId(JSON.parse(storedUserId)); // Pastikan parse aman
      } catch (e) {
        console.error("Error parsing user_id:", e);
        setUserId(null); // Fallback ke null jika parsing gagal
      }
    }
  }, []);

  console.log(userId, "---", brochures);

  const handleCloseModal = () => {
    setSelectedBrochure(null);
  };

  return (
    <AuthWrapper allowedRoles={["marketing"]}>
      <Layout>
        <Typography variant="h4" gutterBottom>
          Brosur dan Flyer
        </Typography>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
          >
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Typography variant="h6" color="error" align="center">
            Error loading brochures: {error.message}
          </Typography>
        )}
        {brochures && brochures.length > 0 ? (
          <Grid container spacing={3}>
            {brochures.map((brochure) => (
              <Grid item xs={12} sm={6} md={4} key={brochure.brochure_id}>
                <Card onClick={() => handleOpenModal(brochure)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={brochure.image_url || "/placeholder.svg"}
                    alt={brochure.brochure_title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {brochure.brochure_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {brochure.brochure_desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center">
            No brochures available.
          </Typography>
        )}
        <Modal
          open={!!selectedBrochure}
          onClose={handleCloseModal}
          aria-labelledby="brochure-modal-title"
          aria-describedby="brochure-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedBrochure && (
              <>
                <img
                  src={selectedBrochure.image_url || "/placeholder.svg"}
                  alt={selectedBrochure.brochure_title}
                  style={{ width: "100%" }}
                />
                <Typography
                  id="brochure-modal-title"
                  variant="h6"
                  component="h2"
                  mt={2}
                >
                  {selectedBrochure.brochure_title}
                </Typography>
                <Typography id="brochure-modal-description" sx={{ mt: 2 }}>
                  {selectedBrochure.brochure_desc}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button variant="contained" onClick={() => window.print()}>
                    Cetak
                  </Button>
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Batal
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Layout>
    </AuthWrapper>
  );
}
