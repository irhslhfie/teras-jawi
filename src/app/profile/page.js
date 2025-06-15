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
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogin";
import { api } from "@/helpers";
import { toast } from "sonner";
import PurchaseStatus from "@/components/PurchaseStatus";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#1976d2",
});

const StyledButton = styled(Button)({
  color: "white",
  marginLeft: "10px",
});

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useLogout();
  const [profile, setProfile] = useState({});
  const [ktp, setKtp] = useState(null);
  const [kk, setKk] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        if (!token || !userId) {
          throw new Error("No token or user ID found");
        }
        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${JSON.parse(token)}` },
        });
        setProfile(response.data);
        if (response.data.ktp) setKtp({ name: "KTP (uploaded)" });
        if (response.data.kk) setKk({ name: "KK (uploaded)" });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile. Please log in again.");
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "ktp") {
        setKtp(file);
      } else if (type === "kk") {
        setKk(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", profile.full_name);
    formData.append("email", profile.email);
    formData.append("phone_number", profile.phone_number);
    if (ktp) formData.append("ktp", ktp);
    if (kk) formData.append("kk", kk);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      await api.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      toast.success("Profile updated successfully");
      // Refresh profile data
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Teras Jawi Home
          </Typography>
          <StyledButton onClick={() => router.push("/")}>Home</StyledButton>
          <StyledButton onClick={() => router.push("/listings")}>
            Listings
          </StyledButton>
          <StyledButton onClick={() => router.push("/about")}>
            About
          </StyledButton>
          <StyledButton onClick={() => router.push("/contact")}>
            Contact
          </StyledButton>
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            margin="normal"
            name="full_name"
            label="Full Name"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            name="phone_number"
            label="Phone Number"
            value={profile.phone_number || ""}
            onChange={(e) =>
              setProfile({ ...profile, phone_number: e.target.value })
            }
          />
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="ktp-file"
              type="file"
              onChange={(e) => handleFileChange(e, "ktp")}
            />
            <label htmlFor="ktp-file">
              <Button variant="contained" component="span">
                {ktp ? "Change KTP" : "Upload KTP"}
              </Button>
            </label>
            {ktp && <Typography sx={{ ml: 2 }}>{ktp.name}</Typography>}
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="kk-file"
              type="file"
              onChange={(e) => handleFileChange(e, "kk")}
            />
            <label htmlFor="kk-file">
              <Button variant="contained" component="span">
                {kk ? "Change KK" : "Upload KK"}
              </Button>
            </label>
            {kk && <Typography sx={{ ml: 2 }}>{kk.name}</Typography>}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </Box>

        <PurchaseStatus userId={localStorage.getItem("user_id")} />
      </Container>
    </div>
  );
}
