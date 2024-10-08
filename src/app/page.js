"use client";

import Layout from "@/components/layout";
import CompTable from "@/components/Table";
import AuthWrapper from "@/helpers/AuthWrapper";
import Typography from '@mui/material/Typography'

export default function Home() {
  return (
    <AuthWrapper allowedRoles={["admin"]}>
      <Layout>
        <Typography sx={{ marginBottom: 2 }}>
          Data Table Tama Game
        </Typography>
        {/* <CompTable /> */}
      </Layout>
    </AuthWrapper>
  )
}
