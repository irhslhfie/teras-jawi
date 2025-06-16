"use client";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/helpers";
import { Box, CircularProgress, Typography } from "@mui/material";

// --- DATA KAVLING BARU BERDASARKAN TIPE ---
// Setiap kavling sekarang memiliki 'type_name' untuk pengelompokan.
const kavlingLayout = [
  // Kolom 1 (paling kiri)
  { id: "Rumah 18", x: 140, y: 100, type_name: "Tipe 50" },
  { id: "Rumah 19", x: 140, y: 160, type_name: "Tipe 50" },
  { id: "Rumah 20", x: 140, y: 220, type_name: "Tipe 50" },
  { id: "Rumah 21", x: 140, y: 280, type_name: "Tipe 50" },
  { id: "Rumah 22", x: 140, y: 340, type_name: "Tipe 60" },
  { id: "Rumah 24", x: 140, y: 400, type_name: "Tipe 60" },
  { id: "Rumah 25", x: 140, y: 460, type_name: "Tipe 60" },
  // Kolom 2
  { id: "Rumah 17", x: 240, y: 100, type_name: "Tipe 50" },
  { id: "Rumah 16", x: 240, y: 160, type_name: "Tipe 50" },
  { id: "Rumah 15", x: 240, y: 220, type_name: "Tipe 50" },
  { id: "Rumah 14", x: 240, y: 280, type_name: "Tipe 50" },
  { id: "Rumah 23", x: 240, y: 340, type_name: "Tipe 60" },
  // Kolom 3
  { id: "Rumah 10", x: 340, y: 100, type_name: "Tipe 80" },
  { id: "Rumah 11", x: 340, y: 160, type_name: "Tipe 80" },
  { id: "Rumah 12", x: 340, y: 220, type_name: "Tipe 80" },
  { id: "Rumah 13", x: 340, y: 280, type_name: "Tipe 80" },
  // Kolom 4
  { id: "Rumah 9", x: 440, y: 100, type_name: "Tipe 80" },
  { id: "Rumah 8", x: 440, y: 160, type_name: "Tipe 80" },
  { id: "Rumah 7", x: 440, y: 220, type_name: "Tipe 60" },
  { id: "Rumah 6", x: 440, y: 280, type_name: "Tipe 60" },
  { id: "Rumah 5", x: 440, y: 340, type_name: "Tipe 60" },
  // Kolom 5
  { id: "Rumah 1", x: 600, y: 100, type_name: "Tipe 50" },
  { id: "Rumah 2", x: 600, y: 160, type_name: "Tipe 50" },
  { id: "Rumah 3", x: 600, y: 220, type_name: "Tipe 50" },
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

  // Mengelompokkan properti yang 'Tersedia' berdasarkan tipenya
  const availablePropertiesByType = useMemo(() => {
    if (!properties) return {};
    return properties.reduce((acc, property) => {
      if (property.status === "Tersedia") {
        (acc[property.type_name] = acc[property.type_name] || []).push(
          property
        );
      }
      return acc;
    }, {});
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
        {/* ... Latar belakang, jalan, pohon, dan legenda tetap sama ... */}

        {/* Render Kavling */}
        {kavlingLayout.map(({ id, x, y, type_name }) => {
          const kavlingWidth = 80;
          const kavlingHeight = 50;

          const availableUnits = availablePropertiesByType[type_name] || [];
          const isClickable = availableUnits.length > 0;

          let fillColor = "#bdbdbd"; // Warna default (abu-abu) jika tidak ada unit tersedia
          if (isClickable) {
            if (type_name.includes("50")) fillColor = "#ff9800"; // Tipe 50
            if (type_name.includes("60")) fillColor = "#2196f3"; // Tipe 60
            if (type_name.includes("80")) fillColor = "#ffeb3b"; // Tipe 80
          }

          const tooltip = isClickable
            ? `Lihat Properti ${type_name} (${availableUnits.length} unit tersedia)`
            : `Semua unit ${type_name} sudah terjual`;

          return (
            <g
              key={id}
              className="lot-g"
              onClick={() =>
                isClickable && onPropertyClick(type_name, availableUnits)
              }
              style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
            >
              <title>{tooltip}</title>
              <rect
                x={x}
                y={y}
                width={kavlingWidth}
                height={kavlingHeight}
                fill={fillColor}
                stroke={"black"}
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
        {/* ... Kompas & Legenda ... */}
      </svg>
    </Box>
  );
};

export default PropertyMap;
