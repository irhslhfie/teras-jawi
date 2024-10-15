import PlayStationIcon from '@mui/icons-material/SportsEsports';
import BookingIcon from '@mui/icons-material/CalendarToday';
import RentalIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DomainAddIcon from '@mui/icons-material/DomainAdd';

export const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'PlayStation Management', icon: <PlayStationIcon />, path: '/playstation' },
    { text: 'Cabang', icon: <DomainAddIcon />, path: '/branches' },
    // { text: 'Booking Management', icon: <BookingIcon />, path: '/booking-management' },
    // { text: 'Rental Transactions', icon: <RentalIcon />, path: '/rental-transactions' },
    // { text: 'Payment Management', icon: <PaymentIcon />, path: '/payment-management' },
    { text: 'Users Management', icon: <ManageAccountsIcon />, path: '/users' },
];
