import PlayStationIcon from '@mui/icons-material/SportsEsports';
import BookingIcon from '@mui/icons-material/CalendarToday';
import RentalIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import HistoryIcon from '@mui/icons-material/History';

export const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['admin', 'owner'] },
    { text: 'PlayStation', icon: <PlayStationIcon />, path: '/playstation', roles: ['admin', 'owner'] },
    { text: 'Cabang', icon: <DomainAddIcon />, path: '/branches', roles: ['owner'] },
    { text: 'Pemesanan', icon: <BookingIcon />, path: '/bookings', roles: ['admin'] },
    {
        text: 'Penyewaan',
        icon: <RentalIcon />,
        roles: ['admin', 'owner'],
        subItems: [
            { text: 'Data Penyewaan', path: '/rentals', roles: ['admin', 'owner'] },
            { text: 'Histori Penyewaan', path: '/rentals/history', roles: ['admin', 'owner'] }
        ]
    },
    { text: 'Users', icon: <ManageAccountsIcon />, path: '/users', roles: ['owner'] },
];


