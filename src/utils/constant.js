import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CountertopsIcon from "@mui/icons-material/Countertops";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export const menuItems = [
  {
    text: "Landing Page",
    path: "/",
    roles: ["customer"],
  },
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["admin", "owner"],
  },
  {
    text: "Kelola Properti",
    icon: <HomeIcon />,
    path: "/property",
    roles: ["owner", "admin"],
  },
  {
    text: "Kelola Tipe Properti",
    icon: <HomeWorkIcon />,
    path: "/types",
    roles: ["admin"],
  },
  {
    text: "Kelola Fasilitas",
    icon: <CountertopsIcon />,
    path: "/facilities",
    roles: ["admin"],
  },
  {
    text: "Pembelian",
    icon: <PaymentIcon />,
    roles: ["admin", "owner"],
    subItems: [
      {
        text: "Verifikasi Pembelian",
        path: "/purchases",
        icon: <FactCheckIcon />,
        roles: ["admin", "owner"],
      },
      {
        text: "Histori Pembelian",
        path: "/purchases/history",
        icon: <HistoryIcon />,
        roles: ["admin", "owner"],
      },
    ],
  },
  {
    text: "Users",
    icon: <ManageAccountsIcon />,
    path: "/users",
    roles: ["owner", "admin"],
  },
];
