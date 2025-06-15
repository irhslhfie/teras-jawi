"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <AuthWrapper allowedRoles={["admin", "owner", "marketing"]}>
      <Layout>
        <Typography sx={{ marginBottom: 2, color: "black" }}>
          Data Table Tama Game
        </Typography>
      </Layout>
    </AuthWrapper>
  );
}
