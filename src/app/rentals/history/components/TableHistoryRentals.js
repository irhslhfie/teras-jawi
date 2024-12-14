import GradientCircularProgress from '@/components/Progress';
import { useDeletePlaystation } from '@/hooks/playstation/usePlaystation';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from 'react';
import { toast } from "sonner";
import dayjs from "dayjs";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReusableModal from '@/components/Modal';
import { useDoneRental } from '@/hooks/rentals/useRentals';

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
        disablePadding: true,
        label: 'Nomor PS',
    },
    {
        id: 'branch_name',
        numeric: false,
        disablePadding: true,
        label: 'Nama Cabang',
    },
    {
        id: 'rental_type',
        numeric: false,
        disablePadding: true,
        label: 'Tipe Penyewaan',
    },
    {
        id: 'total_price',
        numeric: false,
        disablePadding: true,
        label: 'Harga',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
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

function EnhancedTableToolbar(props) {
    const { numSelected, title, itemSelected } = props;

    const deleteUser = useDeletePlaystation();
    const handleDelete = () => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus PlayStation ini?');
        if (confirmDelete) {
            console.log('Data yg dihapus ==> ', itemSelected)
            itemSelected.forEach(rental_id => {
                deleteUser.mutate(rental_id);
            });
        } else {
            toast.info('Penghapusan dibatalkan');
        }
    };

    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}
            {/* {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )} */}
        </Toolbar>
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

export default function TableHistoryRentals({ data, tableTitle, isLoading, isError }) {
    const router = useRouter();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleOpenModal = (data) => {
        setModalData(data); // Simpan data ke state
        setIsModalOpen(true); // Buka modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Tutup modal
        setModalData(null); // Reset data modal saat ditutup
    };

    const doneRental = useDoneRental();

    const handleDone = async (rentalId) => {
        try {
            await doneRental.mutateAsync({ rental_id: rentalId });
            toast.success("Data penyewaan berhasil diselesaikan");
        } catch (error) {
            toast.error("Gagal menyelesaikan data penyewaan");
        }
    };


    // if (isLoading) {
    //     return <GradientCircularProgress />;
    // }

    // if (isError) {
    //     return <Typography color="error">Error fetching data: {isError.message}</Typography>;
    // }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.rental_id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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
                <EnhancedTableToolbar numSelected={selected.length} title={tableTitle} itemSelected={selected} />
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
                                size={dense ? 'small' : 'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {visibleRows.map((row, index) => {
                                        const isItemSelected = selected.includes(row.rental_id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => handleOpenModal(row)}
                                                role="checkbox"
                                                // aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.rental_id}
                                                // selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        onClick={(event) => {
                                                            event.stopPropagation(); // Mencegah propagasi event ke elemen parent
                                                            handleClick(event, row.rental_id);
                                                        }}
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="left"
                                                >
                                                    {row.full_name || '-'}
                                                </TableCell>
                                                <TableCell align="left">{row.ps_number || '-'}</TableCell>
                                                <TableCell align="left">{row.branch_name || '-'}</TableCell>
                                                <TableCell align="left">{row.rental_type === 'on-site' ? 'Sewa Ditempat' : 'Sewa Dibawa Pulang' || '-'}</TableCell>
                                                <TableCell align="left">
                                                    {row.total_price
                                                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.total_price)
                                                        : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (dense ? 33 : 53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage={"Jumlah Tampilan Data"}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
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