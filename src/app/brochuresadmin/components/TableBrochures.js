import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const headCells = [
  {
    id: "brochure_title",
    numeric: false,
    disablePadding: true,
    label: "Judul",
  },
  {
    id: "brochure_desc",
    numeric: false,
    disablePadding: false,
    label: "Deskripsi",
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Aksi" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ numSelected, title }) {
  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          {title}
        </Typography>
      )}
    </Toolbar>
  );
}

const TableBrochures = ({ brochures, onStatusChange }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("brochure_title");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const visibleRows = useMemo(
    () =>
      [...brochures]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, brochures]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: "1rem", px: 2, py: 2 }}>
        <EnhancedTableToolbar
          numSelected={0}
          title="Tabel Data Brosur dan Flyer"
        />
        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((brochure) => (
                <TableRow key={brochure.brochure_id}>
                  <TableCell>{brochure.brochure_title}</TableCell>
                  <TableCell>{brochure.brochure_desc}</TableCell>
                  <TableCell>
                    {brochure.status === "Aktif" ? (
                      <span style={{ color: "green" }}>Aktif</span>
                    ) : (
                      <span style={{ color: "red" }}>Nonaktif</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={brochure.status === "Aktif" ? "error" : "success"}
                      onClick={() =>
                        onStatusChange(
                          brochure.brochure_id,
                          brochure.status === "Aktif" ? "Nonaktif" : "Aktif"
                        )
                      }
                    >
                      {brochure.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={brochures.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TableBrochures;
