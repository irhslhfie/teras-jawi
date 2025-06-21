import PlayStationIcon from "@mui/icons-material/SportsEsports";
import BookingIcon from "@mui/icons-material/CalendarToday";
import RentalIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CountertopsIcon from "@mui/icons-material/Countertops";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import HistoryIcon from "@mui/icons-material/History";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
    roles: ["admin", "owner", "marketing"],
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
    text: "Upload Brosur dan Flyer",
    icon: <NewspaperIcon />,
    path: "/brochuresadmin",
    roles: ["admin"],
  },

  {
    text: "Brosur dan Flyer",
    icon: <NewspaperIcon />,
    path: "/brochuresmarketing",
    roles: ["marketing"],
  },

  {
    text: "Pembelian",
    icon: <ShoppingCartIcon />,
    roles: ["admin", "owner", "marketing"],
    subItems: [
      {
        text: "Verifikasi Pembelian",
        path: "/purchases",
        icon: <FactCheckIcon />,
        roles: ["admin", "owner", "marketing"],
      },
      {
        text: "Tracking KPR", // <-- MENU BARU
        path: "/kpr",
        icon: <AnalyticsIcon />,
        roles: ["marketing", "admin", "owner"],
      },
      {
        text: "Histori Laporan Pembelian",
        path: "/purchases/history",
        icon: <HistoryIcon />,
        roles: ["admin", "owner", "marketing"],
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
