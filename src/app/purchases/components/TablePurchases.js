import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GradientCircularProgress from "@/components/Progress";
import ReusableModal from "@/components/Modal";
import {
  useConfirmPurchase,
  useCancelPurchase,
} from "@/hooks/purchases/usePurchases";
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
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: "username", numeric: false, disablePadding: true, label: "Username" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "type_name",
    numeric: false,
    disablePadding: false,
    label: "Tipe Properti",
  },
  {
    id: "property_name",
    numeric: false,
    disablePadding: false,
    label: "Nama Rumah",
  },
  {
    id: "total_price",
    numeric: true,
    disablePadding: false,
    label: "Total Harga",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Aksi" },
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
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
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
        <li>
          <strong>Username:</strong> {data?.username || "-"}
        </li>
        <li>
          <strong>Email:</strong> {data?.email || "-"}
        </li>
        <li>
          <strong>Tipe Properti:</strong> {data?.type_name || "-"}
        </li>
        <li>
          <strong>Nama Rumah:</strong> {data?.property_name || "-"}
        </li>
        <li>
          <strong>Total Harga:</strong>{" "}
          {data?.total_price
            ? new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(data?.total_price)
            : "-"}
        </li>
        <li>
          <strong>Status:</strong> {data?.status || "-"}
        </li>
        <li>
          <strong>Tanggal Pembelian:</strong>{" "}
          {data?.created_at
            ? dayjs(data?.created_at).format("DD-MM-YYYY HH:mm:ss")
            : "-"}
        </li>
      </ul>
    </div>
  );
};

export default function TablePurchases({
  data,
  tableTitle,
  isLoading,
  isError,
  error,
}) {
  const router = useRouter();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("created_at");
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

  const confirmPurchase = useConfirmPurchase();
  const cancelPurchase = useCancelPurchase();

  const handleConfirm = async (purchaseId, event) => {
    event.stopPropagation();
    try {
      await confirmPurchase.mutateAsync(purchaseId);
      toast.success("Pembelian berhasil dikonfirmasi");
    } catch (error) {
      toast.error("Gagal mengkonfirmasi pembelian");
    }
  };

  const handleCancel = async (purchaseId, event) => {
    event.stopPropagation();
    try {
      await cancelPurchase.mutateAsync(purchaseId);
      toast.success("Pembelian berhasil dibatalkan");
    } catch (error) {
      toast.error("Gagal membatalkan pembelian");
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return [...data]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, data]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          minHeight: "40vh",
          borderRadius: "1rem",
          px: 2,
          py: 2,
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%", mb: 2, ml: 2 }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
        {isLoading && (
          <div className="w-full flex justify-center items-center mt-10">
            <GradientCircularProgress />
          </div>
        )}
        {isError && (
          <div className="w-full flex justify-center items-center mt-10">
            <Typography color="error">
              Error fetching data: {error?.message || "Unknown error"}
            </Typography>
          </div>
        )}
        {!isLoading &&
          !isError &&
          (!Array.isArray(data) || data.length === 0) && (
            <div className="w-full flex justify-center items-center mt-10">
              <Typography variant="h6" color="#1565c0">
                Tidak ada data Pembelian yang tersedia.
              </Typography>
            </div>
          )}
        {!isLoading && !isError && Array.isArray(data) && data.length > 0 && (
          <>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size="medium"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => (
                    <TableRow
                      hover
                      onClick={() => handleOpenModal(row)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.purchases_id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        {row.username || "-"}
                      </TableCell>
                      <TableCell align="left">{row.email || "-"}</TableCell>
                      <TableCell align="left">{row.type_name || "-"}</TableCell>
                      <TableCell align="left">
                        {row.property_name || "-"}
                      </TableCell>
                      <TableCell align="right">
                        {row.total_price
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(row.total_price)
                          : "-"}
                      </TableCell>
                      <TableCell align="left">{row.status || "-"}</TableCell>
                      <TableCell align="left">
                        {row.status === "Pending" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={(event) =>
                                handleConfirm(row.purchases_id, event)
                              }
                              startIcon={<CheckCircleIcon />}
                              sx={{ mr: 1 }}
                            >
                              Konfirmasi
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={(event) =>
                                handleCancel(row.purchases_id, event)
                              }
                              startIcon={<CancelIcon />}
                            >
                              Batalkan
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
            />
            <ReusableModal
              open={isModalOpen}
              onClose={handleCloseModal}
              title="Detail Pembelian"
              content={<ModalDetail data={modalData} />}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
