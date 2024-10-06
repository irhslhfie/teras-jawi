"use client";
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import React from 'react';

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: '',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
];

function DashboardContent({ children }) {
    return (
        <AppProvider navigation={NAVIGATION}>
            <DashboardLayout>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h4">Dashboard</Typography>
                    {children}
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
}

export default DashboardContent;
