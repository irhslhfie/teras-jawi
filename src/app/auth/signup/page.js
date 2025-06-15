"use client";

import { useState } from "react";
import { TextField, Button } from "@mui/material";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "../components/auth-layout";
import Image from "next/image";
import { useRegister } from "@/hooks/auth/useLogin";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    email: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
  const register = useRegister();

  // Fungsi Validasi
  const validateForm = () => {
    const newErrors = {};
    const {
      username,
      password,
      confirmPassword,
      full_name,
      email,
      phone_number,
    } = formData;

    if (!username) newErrors.username = "Username wajib diisi.";
    if (!full_name) newErrors.full_name = "Nama lengkap wajib diisi.";
    if (!email) newErrors.email = "Email wajib diisi.";
    if (!phone_number) newErrors.phone_number = "Nomor telepon wajib diisi.";
    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 8 || !/[A-Z]/.test(password)) {
      newErrors.password =
        "Password harus memiliki minimal 8 karakter dan mengandung setidaknya 1 huruf besar.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sesuai.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Mengembalikan true jika tidak ada error
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });

    // Hapus error untuk field yang diubah
    if (errors[key]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register.mutateAsync({
        username: formData?.username,
        password: formData?.password,
        full_name: formData?.full_name,
        email: formData?.email,
        phone_number: formData?.phone_number,
        role: "customer",
      });
    } catch (error) {
      console.error("Terjadi error: ", error);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/images/web/icon-192.png"
              alt="Teras Jawi"
              width={32}
              height={32}
            />
          </div>
          <span className="font-semibold">Teras Jawi</span>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {Object.entries({
              username: "Username",
              full_name: "Full Name",
              email: "Email",
              phone_number: "Phone Number",
              password: "Password",
              confirmPassword: "Confirm Password",
            }).map(([key, label]) => (
              <TextField
                key={key}
                fullWidth
                label={label}
                type={key.includes("password") ? "password" : "text"}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                error={!!errors[key]} // Set error state
                helperText={errors[key]} // Display error message
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F3F4F6",
                  },
                }}
              />
            ))}
          </div>

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
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
