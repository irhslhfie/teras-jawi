"use client";

import { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "../components/auth-layout";
import Image from "next/image";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { useLogin } from "@/hooks/auth/useLogin";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { mutate, isError } = useLogin();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      return toast.warning(
        "Silahkan isi username dan password anda dengan benar!"
      );
    }

    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          setBackdropOpen(true);
          if (data.user.role === "customer") {
            router.push("/");
          } else {
            router.push("/dashboard");
          }
        },
      }
    );
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/images/web/icon-192.png"
              alt="Teras Jawi Home"
              width={32}
              height={32}
            />
          </div>
          <span className="font-semibold">Teras Jawi Home</span>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Senang bertemu denganmu kembali!
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              Lupa password?
            </Link>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#0066FF",
                "&:hover": {
                  backgroundColor: "#0052CC",
                },
                textTransform: "none",
                py: 1.5,
              }}
            >
              LOGIN
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Belum punya akun?</span>{" "}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-500"
          >
            Buat akun sekarang
          </Link>
        </div>
      </div>

      {/* Backdrop untuk menampilkan loading */}
      <Backdrop
        open={backdropOpen}
        onClick={() => setBackdropOpen(false)}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Fade in={backdropOpen}>
          <CircularProgress color="inherit" />
        </Fade>
      </Backdrop>
    </AuthLayout>
  );
}
