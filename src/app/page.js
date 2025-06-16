"use client";

import React, { useState, useEffect } from "react";
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
  Box,
  CardActionArea,
  Icon,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLogout } from "@/hooks/auth/useLogin";

// Import Ikon dari Material-UI
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";

// --- Styled Components ---
const StyledAppBar = styled(AppBar)(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
  backdropFilter: isScrolled ? "blur(10px)" : "none",
  boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
  color: "#171717",
  transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
}));

const HeroSection = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  color: "#ffffff",
  textAlign: "center",
  padding: "2rem",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url('/images/teras_jawi.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.5)",
    zIndex: -1,
  },
});

const Section = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
}));

// --- Data untuk Konten Dinamis ---
const propertyTypes = [
  {
    type: "Tipe 50",
    description:
      "Hunian nyaman dan efisien, ideal untuk keluarga kecil atau pasangan muda.",
    image: "/images/web/property_type_50.jpg",
  },
  {
    type: "Tipe 60",
    description:
      "Rumah luas dengan desain modern, cocok untuk keluarga yang sedang berkembang.",
    image: "/images/web/property_type_60.jpg",
  },
  {
    type: "Tipe 80",
    description:
      "Properti mewah dan premium dengan ruang lebih untuk kenyamanan maksimal.",
    image: "/images/web/property_type_80.jpg",
  },
];

const keyFeatures = [
  {
    icon: <LocationCityIcon fontSize="large" color="primary" />,
    title: "Lokasi Strategis",
    description:
      "Akses mudah ke pusat kota, fasilitas pendidikan, dan pusat perbelanjaan terkemuka.",
  },
  {
    icon: <HomeWorkIcon fontSize="large" color="primary" />,
    title: "Desain Modern & Berkualitas",
    description:
      "Setiap unit dibangun dengan material premium dan desain arsitektur modern yang elegan.",
  },
  {
    icon: <PeopleIcon fontSize="large" color="primary" />,
    title: "Komunitas Harmonis",
    description:
      "Lingkungan yang aman, nyaman, dan didukung oleh komunitas yang ramah dan solid.",
  },
];

// --- Komponen Utama Landing Page ---
export default function LandingPage() {
  const router = useRouter();
  const { logout } = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem("token");
    const storedFullname = localStorage.getItem("fullname");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      if (storedFullname) setFullname(JSON.parse(storedFullname));
      if (storedRole) setUserRole(JSON.parse(storedRole));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderAuthButtons = () => {
    if (!isMounted) return null;

    if (isLoggedIn) {
      const isAdminOrOwner =
        userRole === "admin" ||
        userRole === "owner" ||
        userRole === "marketing";
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

  return (
    <div>
      <StyledAppBar position="fixed" isScrolled={isScrolled}>
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

      <main>
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="md">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Temukan Rumah Impian Anda
            </Typography>
            <Typography
              variant="h5"
              component="p"
              color="rgba(255, 255, 255, 0.9)"
              paragraph
            >
              Wujudkan hunian ideal bersama keluarga di Teras Jawi, perumahan
              dengan desain modern dan lokasi strategis.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mr: 2, px: 4, py: 1.5 }}
                onClick={() => router.push("/listings")}
              >
                Lihat Properti
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Hubungi Kami
              </Button>
            </Box>
          </Container>
        </HeroSection>

        {/* Property Types Section */}
        <Section sx={{ backgroundColor: "#ffffff" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 5 }}
            >
              Tipe Properti Unggulan
            </Typography>
            <Grid container spacing={4}>
              {propertyTypes.map((property) => (
                <Grid item xs={12} md={4} key={property.type}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea onClick={() => router.push("/listings")}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={property.image || "/placeholder.svg"}
                        alt={`Properti ${property.type}`}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Typography gutterBottom variant="h5" component="div">
                          {property.type}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {property.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Key Features Section */}
        <Section sx={{ backgroundColor: "#f7f9fc" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              component="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 6 }}
            >
              Keunggulan Perumahan Teras Jawi
            </Typography>
            <Grid container spacing={5}>
              {keyFeatures.map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Icon sx={{ fontSize: 60, mb: 2 }}>{feature.icon}</Icon>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Featured Properties Section (New) */}
        <Section sx={{ backgroundColor: "#1C2536", color: "white", py: 12 }}>
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Properti Unggulan
                </Typography>
                <Typography variant="subtitle1" paragraph sx={{ opacity: 0.8 }}>
                  Semua yang Anda butuhkan untuk mengetahui tentang rumah impian
                  Anda ada di sini! Telusuri berbagai pilihan properti terbaik
                  yang kami tawarkan di Pekalongan dan sekitarnya.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => router.push("/listings")}
                  >
                    Lihat Daftar Properti
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                <Box sx={{ maxWidth: 400, mx: "auto" }}>
                  <Image
                    src="/images/web/featured_properties.png" // Pastikan gambar ini ada
                    alt="Featured Properties"
                    width={400}
                    height={300}
                    style={{ borderRadius: 8 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ bgcolor: "#121822", color: "white", py: 6 }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Typography variant="h6" gutterBottom>
                Teras Jawi
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Menyediakan hunian berkualitas dengan desain modern di lokasi
                terbaik untuk masa depan Anda dan keluarga.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Navigasi
              </Typography>
              <Button
                color="inherit"
                component="a"
                href="/"
                sx={{ display: "block", p: 0, justifyContent: "flex-start" }}
              >
                Beranda
              </Button>
              <Button
                color="inherit"
                component="a"
                href="/listings"
                sx={{ display: "block", p: 0, justifyContent: "flex-start" }}
              >
                Properti
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Kontak Kami
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Jl. Perumahan Teras Jawi No. 1<br />
                Pekalongan, Jawa Tengah, Indonesia
                <br />
                Email: kontak@terasjawi.com
                <br />
                Telepon: (021) 123-4567
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              textAlign: "center",
              mt: 5,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              pt: 3,
            }}
          >
            <Typography variant="body2" color="rgba(255,255,255,0.5)">
              © {new Date().getFullYear()} Teras Jawi. Semua Hak Cipta
              Dilindungi.
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
