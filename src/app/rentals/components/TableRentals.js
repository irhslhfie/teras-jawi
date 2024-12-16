import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Box, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, TableSortLabel,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GradientCircularProgress from '@/components/Progress';
import ReusableModal from '@/components/Modal';
import { useDoneRental } from '@/hooks/rentals/useRentals';
import dayjs from "dayjs";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: 'full_name',
        numeric: false,
        disablePadding: true,
        label: 'Nama Penyewa',
    },
    {
        id: 'ps_number',
        numeric: false,
        disablePadding: false,
        label: 'Nomor PS',
    },
    {
        id: 'branch_name',
        numeric: false,
        disablePadding: false,
        label: 'Nama Cabang',
    },
    {
        id: 'rental_type',
        numeric: false,
        disablePadding: false,
        label: 'Tipe Penyewaan',
    },
    {
        id: 'total_price',
        numeric: true,
        disablePadding: false,
        label: 'Harga',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.id === 'full_name' ? 'normal' : headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const ModalDetail = ({ data }) => {
    return (
        <div>
            <ul style={{ margin: 0 }}>
                <li><strong>Nama Penyewa:</strong> {data?.full_name || '-'}</li>
                <li><strong>E-Mail:</strong> {data?.email || '-'}</li>
                <li><strong>No HP:</strong> {data?.phone_number || '-'}</li>
                <li><strong>Jenis PS:</strong> {data?.ps_type || '-'}</li>
                <li><strong>Nomor PS:</strong> {data?.ps_number || '-'}</li>
                <li><strong>Nama Cabang:</strong> {data?.branch_name || '-'}</li>
                <li><strong>Tipe Penyewaan:</strong> {data?.rental_type === 'on-site' ? 'Sewa Ditempat' : 'Sewa Dibawa Pulang' || '-'}</li>
                <li><strong>Start Waktu Sewa:</strong> {data?.start_time ? dayjs(data?.start_time).format('DD-MM-YYYY HH:mm:ss') : '-'}</li>
                <li><strong>Akhir Waktu Sewa:</strong> {data?.end_time ? dayjs(data?.end_time).format('DD-MM-YYYY HH:mm:ss') : '-'}</li>
                <li><strong>Total Harga:</strong> {data?.total_price
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data?.total_price)
                    : '-'}</li>
                <li><strong>Status:</strong> {data?.status === 'active' ? 'Aktif' : 'Selesai' || '-'}</li>
            </ul>
        </div>
    )
}

export default function TableRentals({ data, tableTitle, isLoading, isError, rolePengguna }) {
    const router = useRouter();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleOpenModal = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    const doneRental = useDoneRental();

    const handleDone = async (rentalId, event) => {
        event.stopPropagation();
        try {
            await doneRental.mutateAsync({ rental_id: rentalId });
            toast.success("Data penyewaan berhasil diselesaikan");
        } catch (error) {
            toast.error("Gagal menyelesaikan data penyewaan");
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo(
        () =>
            [...data]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, data],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, minHeight: '40vh', borderRadius: '1rem', px: 2, py: 2 }}>
                <Typography
                    sx={{ flex: '1 1 100%', mb: 2, ml: 2 }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {tableTitle}
                </Typography>
                {isLoading && (
                    <div className='w-full flex justify-center items-center mt-10'>
                        <GradientCircularProgress />
                    </div>
                )}
                {isError && (
                    <div className='w-full flex justify-center items-center mt-10'>
                        <Typography color="error">Error fetching data: {isError.message}</Typography>
                    </div>
                )}
                {!isLoading && data.length === 0 && (
                    <div className='w-full flex justify-center items-center mt-10'>
                        <Typography variant="h6" color="#1565c0">
                            Tidak ada data Penyewaan yang sedang Aktif.
                        </Typography>
                    </div>
                )}
                {!isLoading && data.length > 0 && (
                    <>
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size='medium'
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {visibleRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => handleOpenModal(row)}
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.rental_id}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell component="th" scope="row" padding="normal">
                                                    {row.full_name || '-'}
                                                </TableCell>
                                                <TableCell align="left">{row.ps_number || '-'}</TableCell>
                                                <TableCell align="left">{row.branch_name || '-'}</TableCell>
                                                <TableCell align="left">{row.rental_type === 'on-site' ? 'Sewa Ditempat' : 'Sewa Dibawa Pulang' || '-'}</TableCell>
                                                <TableCell align="right">
                                                    {row.total_price
                                                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_price)
                                                        : '-'}
                                                </TableCell>
                                                <TableCell align="left">{row.status === 'active' ? 'Aktif' : 'Selesai' || '-'}</TableCell>
                                                <TableCell align="left">
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        onClick={(event) => handleDone(row.rental_id, event)}
                                                        disabled={rolePengguna === 'admin' ? false : true}
                                                        startIcon={<CheckCircleIcon />}
                                                    >
                                                        Selesai
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage={"Jumlah Tampilan Data"}
                        />
                        <ReusableModal
                            open={isModalOpen}
                            onClose={handleCloseModal}
                            title="Detail Penyewaan"
                            content={<ModalDetail data={modalData} />}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}