"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/auth/useLogin";
import Image from "next/image";

export default function LandingNavbar() {
  const router = useRouter();
  const { logout } = useLogout();
  const [isMounted, setIsMounted] = useState(false);
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    fullname: "",
    userRole: null,
  });

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setAuthInfo({
        isLoggedIn: true,
        fullname: JSON.parse(localStorage.getItem("fullname") || '""'),
        userRole: JSON.parse(localStorage.getItem("role") || "null"),
      });
    }
  }, []);

  const renderAuthButtons = () => {
    if (!isMounted) return null;

    const isAdminOrOwner = ["admin", "owner", "marketing"].includes(
      authInfo.userRole
    );

    if (authInfo.isLoggedIn) {
      return (
        <>
          <a
            className="btn btn-outline-primary me-2"
            href={isAdminOrOwner ? "/dashboard" : "/profile"}
          >
            {isAdminOrOwner ? "Dashboard" : authInfo.fullname}
          </a>
          <button onClick={logout} className="btn btn-danger">
            Keluar
          </button>
        </>
      );
    } else {
      return (
        <a href="/auth/signin" className="btn btn-primary">
          Masuk / Daftar
        </a>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/">
          <Image
            src="/images/web/icon-192.png"
            alt="Teras Jawi Logo"
            width={40}
            height={40}
            className="me-2"
          />
          Teras Jawi
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Beranda
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/listings">
                Properti
              </a>
            </li>
            <li className="nav-item ms-lg-3">{renderAuthButtons()}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
