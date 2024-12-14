"use client";

import Layout from "@/components/layout";
import AuthWrapper from "@/helpers/AuthWrapper";
import { useGetPlaystationAll } from "@/hooks/playstation/usePlaystation";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import TableBookings from "./components/TableBookings";
import MultipleSelectChip from "@/components/SelectInput";
import { useGetBookingAll } from "@/hooks/booking/useBooking";

export default function Bookings() {
    const router = useRouter();

    const { data: dataBooking, isLoading, isSuccess, error, refetch: refetchBooking } = useGetBookingAll();

    // useEffect(() => {
    //     refetchBooking();
    // }, [searchQueryPS, searchQuery]);


    // const handleSearch = (e) => {
    //     setSearchQuery(e.target.value);
    // };

    return (
        <AuthWrapper allowedRoles={["admin", "owner"]}>
            <Layout>
                <div className="w-full">
                    <TableBookings
                        data={dataBooking}
                        tableTitle={'Tabel Data Pemesanan'}
                        isLoading={isLoading}
                        isError={error} />
                </div>
            </Layout>
        </AuthWrapper >
    );
}
