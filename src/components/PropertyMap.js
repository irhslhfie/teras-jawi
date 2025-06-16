"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";
import { Box, CircularProgress, Typography } from "@mui/material";

// --- DATA KAVLING BERDASARKAN DENAH ASLI ANDA ---
// 'id' di sini sekarang SAMA PERSIS dengan 'property_name' di database Anda.
const kavlingLayout = [
  // Kolom 1 (paling kiri)
  { id: "Rumah 18", x: 140, y: 100 },
  { id: "Rumah 19", x: 140, y: 160 },
  { id: "Rumah 20", x: 140, y: 220 },
  { id: "Rumah 21", x: 140, y: 280 },
  { id: "Rumah 22", x: 140, y: 340 },
  { id: "Rumah 24", x: 140, y: 400 },
  { id: "Rumah 25", x: 140, y: 460 },
  // Kolom 2
  { id: "Rumah 17", x: 240, y: 100 },
  { id: "Rumah 16", x: 240, y: 160 },
  { id: "Rumah 15", x: 240, y: 220 },
  { id: "Rumah 14", x: 240, y: 280 },
  { id: "Rumah 23", x: 240, y: 340 },
  // Kolom 3
  { id: "Rumah 10", x: 340, y: 100 },
  { id: "Rumah 11", x: 340, y: 160 },
  { id: "Rumah 12", x: 340, y: 220 },
  { id: "Rumah 13", x: 340, y: 280 },
  // Kolom 4
  { id: "Rumah 9", x: 440, y: 100 },
  { id: "Rumah 8", x: 440, y: 160 },
  { id: "Rumah 7", x: 440, y: 220 },
  { id: "Rumah 6", x: 440, y: 280 },
  { id: "Rumah 5", x: 440, y: 340 },
  // Kolom 5
  { id: "Rumah 1", x: 600, y: 100 },
  { id: "Rumah 2", x: 600, y: 160 },
  { id: "Rumah 3", x: 600, y: 220 },
];

const PropertyMap = ({ onPropertyClick }) => {
  const {
    data: properties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await api.get("/property");
      return response.data.data;
    },
  });

  const propertyMap = useMemo(() => {
    if (!properties) return new Map();
    return new Map(properties.map((p) => [p.property_name, p]));
  }, [properties]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="500px"
      >
        <CircularProgress /> <Typography ml={2}>Memuat Denah...</Typography>
      </Box>
    );
  }

  if (error)
    return <Typography color="error">Gagal memuat denah properti.</Typography>;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1100px",
        mx: "auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        p: { xs: 1, md: 2 },
        bgcolor: "#f5f5f5",
      }}
    >
      <style>{`.lot-g:hover > rect { filter: brightness(1.15); transform: scale(1.02); }`}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 950 650"
        style={{ width: "100%", height: "auto" }}
      >
        {/* Latar Belakang & Jalan */}
        <rect width="100%" height="100%" fill="#1a512e" />
        <path
          d="M 120 80 L 700 80 L 700 550 L 580 550 L 580 400 L 420 400 L 420 80 Z"
          fill="#616161"
        />

        {/* Dekorasi Pohon */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={`tree-l-${i}`}
            cx="100"
            cy={125 + i * 60}
            r="10"
            fill="#003300"
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <circle
            key={`tree-r-${i}`}
            cx="560"
            cy={125 + i * 60}
            r="10"
            fill="#003300"
          />
        ))}
        <circle cx="720" cy="125" r="10" fill="#003300" />
        <circle cx="720" cy="185" r="10" fill="#003300" />

        {/* Render Kavling */}
        {kavlingLayout.map(({ id, x, y }) => {
          const property = propertyMap.get(id); // Mencocokkan berdasarkan nama
          const kavlingWidth = 80;
          const kavlingHeight = 50;

          let fillColor = "#bdbdbd";
          let strokeColor = "#757575";
          let isClickable = false;
          let tooltip = `Kavling ${id} (Data tidak ditemukan)`;

          if (property) {
            isClickable = property.status !== "Terjual";
            tooltip = `${property.property_name} (${property.type_name}) - ${property.status}`;
            if (property.type_name.includes("50")) fillColor = "#ff9800";
            if (property.type_name.includes("60")) fillColor = "#2196f3";
            if (property.type_name.includes("80")) fillColor = "#ffeb3b";
            strokeColor = property.status === "Terjual" ? "red" : "black";
          }

          return (
            <g
              key={id}
              className="lot-g"
              onClick={() => isClickable && onPropertyClick(property)}
              style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
            >
              <title>{tooltip}</title>
              <rect
                x={x}
                y={y}
                width={kavlingWidth}
                height={kavlingHeight}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="2"
                rx="4"
                style={{
                  opacity: isClickable ? 1 : 0.6,
                  transition: "filter 0.2s, transform 0.2s",
                }}
              />
              <text
                x={x + kavlingWidth / 2}
                y={y + kavlingHeight / 2 + 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000"
              >
                {id}
              </text>
            </g>
          );
        })}

        {/* Kompas & Legenda */}
        <path
          d="M 780 300 L 800 320 L 780 340 L 760 320 Z"
          fill="white"
          stroke="black"
        />
        <text x="776" y="295" fontWeight="bold">
          U
        </text>
        <text x="805" y="325" fontWeight="bold">
          T
        </text>
        <text x="776" y="355" fontWeight="bold">
          S
        </text>
        <text x="750" y="325" fontWeight="bold">
          B
        </text>
        <rect
          x="750"
          y="50"
          width="180"
          height="155"
          fill="rgba(255,255,255,0.9)"
          rx="5"
        />
        <text x="760" y="70" fontWeight="bold" fontSize="16">
          Keterangan Warna
        </text>
        <rect x="760" y="90" width="20" height="20" fill="#ffeb3b" rx="4" />
        <text x="785" y="105">
          Tipe 80
        </text>
        <rect x="760" y="120" width="20" height="20" fill="#2196f3" rx="4" />
        <text x="785" y="135">
          Tipe 60
        </text>
        <rect x="760" y="150" width="20" height="20" fill="#ff9800" rx="4" />
        <text x="785" y="165">
          Tipe 50
        </text>
        <rect
          x="760"
          y="180"
          width="20"
          height="20"
          fill="none"
          stroke="red"
          strokeWidth="3"
          rx="4"
        />
        <text x="785" y="195">
          Terjual
        </text>
      </svg>
    </Box>
  );
};

export default PropertyMap;
