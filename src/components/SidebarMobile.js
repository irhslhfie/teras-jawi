import { menuItems } from '@/utils/constant';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const SidebarMobile = ({ mobileOpen, handleDrawerToggle, userFullname, userRole, userAvatar, handleLogout }) => {
    const router = useRouter();

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
                MUI
            </Typography>
            {/* <Divider /> */}

            {/* Menu List */}
            <Box sx={{ flexGrow: 1 }}>
                <List>
                    {menuItems?.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => router.push(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Divider />

            {/* Avatar, User Name, and Logout Button at the bottom */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={userFullname} src={userAvatar} sx={{ width: 50, height: 50, mr: 2 }} />
                    <Box>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', textTransform: 'capitalize' }}>
                            {userFullname}
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', textTransform: 'capitalize', color: '#565656' }}>
                            {userRole}
                        </Typography>
                    </Box>
                </Box>
                <Button variant="contained" color="primary" fullWidth onClick={handleLogout}>
                    Log Out
                </Button>
            </Box>
        </Box>
    );

    return (
        <nav>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
        </nav>
    );
};

export default SidebarMobile;
