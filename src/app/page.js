"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#1976d2",
});

const StyledButton = styled(Button)({
  color: "white",
  marginLeft: "10px",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
});

export default function LandingPage() {
  const router = useRouter();
  const { user, logout } = useLogin();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/signin");
  };

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Teras Jawi Home
          </Typography>
          <StyledButton onClick={() => router.push("/")}>Beranda</StyledButton>
          <StyledButton onClick={() => router.push("/listings")}>
            Properti
          </StyledButton>
          <StyledButton onClick={() => router.push("/about")}>
            Tentang Kami
          </StyledButton>
          <StyledButton onClick={() => router.push("/contact")}>
            Kontak
          </StyledButton>
          {localStorage.getItem("token") ? (
            <>
              <StyledButton onClick={() => router.push("/profile")}>
                {localStorage.getItem("fullname")}
              </StyledButton>
              <StyledButton
                onClick={handleLogout}
                variant="contained"
                sx={{ backgroundColor: "red", color: "white" }}
              >
                Keluar
              </StyledButton>
            </>
          ) : (
            <StyledButton
              onClick={() => router.push("/auth/signin")}
              variant="contained"
              sx={{ backgroundColor: "green", color: "white" }}
            >
              Masuk
            </StyledButton>
          )}
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Selamat Datang di Teras Jawi Home
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Temukan rumah impian Anda di komunitas perumahan kami yang indah.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="/placeholder.svg?height=200&width=300"
                alt="Properti Tipe 50"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Tipe 50
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hunian nyaman dan efisien yang cocok untuk keluarga kecil atau
                  individu.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="/placeholder.svg?height=200&width=300"
                alt="Properti Tipe 60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Tipe 60
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rumah luas yang dirancang untuk keluarga yang sedang
                  berkembang dengan fasilitas modern.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="/placeholder.svg?height=200&width=300"
                alt="Properti Tipe 80"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Tipe 80
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Properti mewah dan luas untuk Anda yang menginginkan ruang
                  lebih dan kenyamanan ekstra.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h4" align="center" gutterBottom sx={{ mt: 6 }}>
          Mengapa Memilih Kami?
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Kami menyediakan layanan terbaik, properti berkualitas tinggi, dan
          komunitas yang ramah untuk memberikan pengalaman hidup yang luar biasa
          bagi Anda dan keluarga.
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lokasi Strategis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Properti kami berada di lokasi yang mudah dijangkau dan dekat
                  dengan fasilitas umum.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Desain Modern
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Setiap properti dirancang dengan gaya modern yang mengikuti
                  tren masa kini.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Harga Terjangkau
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kami menawarkan properti dengan harga yang kompetitif tanpa
                  mengurangi kualitas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
