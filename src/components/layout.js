"use client";
import SidebarMobile from '@/components/SidebarMobile';
import { menuItems } from '@/utils/constant';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import CompBreadcrumbs from './Breadcumbs';
import { toast } from "sonner";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    width: `100%`,
    zIndex: theme.zIndex.drawer + 1,
}));

export default function Layout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAvatar = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const idPopover = open ? 'simple-popover' : undefined;

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        if (!localStorage.getItem("token") && !localStorage.getItem("role")) {
            router.push("/auth/signin");
        }
        localStorage.clear();
        router.push("/auth/signin");
        toast.success('Log Out Berhasil');
    }

    // Function to check if the path is active
    const isActive = (path) => pathname === path;

    return (
        <Box
            sx={{
                display: 'flex',
                backgroundColor: '#f5f6fa',
                p: 3,
                minHeight: '100vh',
            }}
        >
            <CssBaseline />

            {/* AppBar */}
            <AppBar component="nav" position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar
                    sx={{ backgroundColor: 'inherit', minWidth: '100vw' }}
                >
                    <MenuOpenIcon
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
                    />
                    <Avatar
                        alt="Tama Game"
                        src="/images/web/icon-192.png"
                        sx={{ width: 45, height: 45, mr: 1 }}
                    />
                    <Typography
                        component="div"
                        sx={{ flexGrow: 1, display: 'block', fontSize: '1.25rem', fontWeight: 800 }}
                    >
                        <span style={{ color: '#1565c0' }}>Tama</span>
                        <span style={{ color: 'black' }}>Game</span>
                    </Typography>

                    <Tooltip>
                        <IconButton
                            sx={{ p: 0 }}
                            onClick={handleAvatarClick}
                        >
                            <Avatar alt="Travis Howard" src="/ame.jpg" />
                        </IconButton>
                        <Popover
                            id={idPopover}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleCloseAvatar}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            sx={{ mt: 1 }}
                            PaperProps={{
                                sx: {
                                    borderRadius: '10px',  // Apply borderRadius to the Paper
                                },
                            }}
                        >
                            <Box sx={{ p: 1 }}>  {/* Added padding here */}
                                <Button variant="text" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </Box>
                        </Popover>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Persistent Drawer (under AppBar, on the left of Main content) */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginTop: '64px',
                    },
                    display: {
                        xs: 'none',
                        md: 'block'
                    },
                    backgroundColor: '#f5f6fa',
                    // backgroundColor: 'lightblue',
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    {menuItems?.map((item, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            sx={{
                                marginBottom: 1,
                                '&:last-child': {
                                    marginBottom: 1,
                                },
                                px: 1
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    backgroundColor: isActive(item.path) ? '#edf4fb' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: isActive(item.path) ? '#e3eefa' : '#f5f5f5',
                                    },
                                    borderRadius: '8px',
                                }}
                                onClick={() => router.push(item.path)}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive(item.path) ? '#1565c0' : 'gray',
                                        minWidth: '50px',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        color: isActive(item.path) ? '#1565c0' : 'black',
                                    }}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: '14px',
                                            fontWeight: isActive(item.path) ? 'bold' : 'semi-bold',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Sidebar Drawer for Mobile */}
            <SidebarMobile mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: 0,
                    margin: 0,
                    overflow: 'hidden'
                }}
            >
                <Toolbar />
                {/* <CompBreadcrumbs /> */}
                {children}
            </Box>
        </Box>
    );
}
