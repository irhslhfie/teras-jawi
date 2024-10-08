"use client";

import Layout from "@/components/layout";
import CompTable from "@/components/Table";
import Typography from '@mui/material/Typography'

export default function Home() {
  return (
    <Layout>
      <Typography sx={{ marginBottom: 2 }}>
        Data Table Tama Game
      </Typography>
      <CompTable />
    </Layout>
  )
}
