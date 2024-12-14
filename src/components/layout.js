"use client";
import { useState, useEffect } from 'react';
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
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import CompBreadcrumbs from './Breadcumbs';
import { toast } from "sonner";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAtom } from "jotai";
import { menuItemAtom } from '@/helpers/atoms';

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

const renderMenuItem = (item, depth = 0) => {
    const filteredSubItems = item.subItems?.filter((subItem) =>
        subItem.roles?.includes(userRole)
    );

    return (
        <div key={item.text}>
            {item.roles?.includes(userRole) && (
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            if (filteredSubItems) handleSubMenuToggle(item.text);
                            else router.push(item.path);
                        }}
                    >
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            )}

            {/* Render SubMenu */}
            {filteredSubItems && openSubMenu[item.text] && (
                <List component="div" disablePadding>
                    {filteredSubItems.map((subItem) => (
                        <ListItem key={subItem.text} disablePadding>
                            <ListItemButton onClick={() => router.push(subItem.path)}>
                                <ListItemText primary={subItem.text} sx={{ pl: 4 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default function Layout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userFullname, setUserFullname] = useState('-');
    const [userRole, setUserRole] = useState('-');
    const [openSubMenu, setOpenSubMenu] = useAtom(menuItemAtom);

    useEffect(() => {
        const fullname = localStorage.getItem("fullname");
        const role = localStorage.getItem("role");

        if (fullname) {
            setUserFullname(JSON.parse(fullname));
        }

        if (role) {
            setUserRole(JSON.parse(role));
        }
    }, []);

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
        toast.info(`Log Out Berhasil, Selamat tinggal 🥹`);
    }

    const isActive = (path) => pathname === path;

    const handleSubMenuToggle = (text) => {
        setOpenSubMenu((prevState) => ({
            ...prevState,
            [text]: !prevState[text],
        }));
    };

    const renderMenuItem = (item, depth = 0) => (
        <div key={item.text}>
            <ListItem
                disablePadding
                sx={{
                    marginBottom: depth === 0 ? 1 : 0,
                    '&:last-child': {
                        marginBottom: depth === 0 ? 1 : 0,
                    },
                    px: depth === 0 ? 1 : 0
                }}
            >
                <ListItemButton
                    sx={{
                        backgroundColor: isActive(item.path) ? '#e6f3ff' : 'inherit',
                        '&:hover': {
                            backgroundColor: isActive(item.path) ? '#e6f3ff' : '#f0f9ff',
                        },
                        borderRadius: '8px',
                        pl: 2 + depth * 2,
                    }}
                    onClick={() => {
                        if (item.subItems) {
                            handleSubMenuToggle(item.text);
                        } else {
                            router.push(item.path);
                            setOpenSubMenu({});
                        }
                    }}
                >
                    {item.icon && (
                        <ListItemIcon
                            sx={{
                                color: isActive(item.path) ? '#0096FF' : '#666666',
                                minWidth: '40px',
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primary={item.text}
                        sx={{
                            color: isActive(item.path) ? '#0096FF' : '#666666',
                        }}
                        primaryTypographyProps={{
                            sx: {
                                fontSize: '14px',
                                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                            }
                        }}
                    />
                    {item.subItems && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#0096FF',
                                transform: openSubMenu[item.text] ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.2s',
                                marginLeft: '8px'
                            }}
                        >
                            ▼
                        </Typography>
                    )}
                </ListItemButton>
            </ListItem>
            {item.subItems && openSubMenu[item.text] && (
                <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                        <ListItem
                            key={subItem.text}
                            disablePadding
                            sx={{
                                pl: depth * 2,
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    backgroundColor: isActive(subItem.path) ? '#e6f3ff' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: isActive(subItem.path) ? '#e6f3ff' : '#f0f9ff',
                                    },
                                    pl: 4 + depth * 2,
                                    py: 1,
                                }}
                                onClick={() => router.push(subItem.path)}
                            >
                                {subItem.icon && (
                                    <ListItemIcon
                                        sx={{
                                            color: isActive(subItem.path) ? '#0096FF' : '#666666',
                                            minWidth: '40px',
                                        }}
                                    >
                                        {subItem.icon}
                                    </ListItemIcon>
                                )}
                                <ListItemText
                                    primary={subItem.text}
                                    sx={{
                                        color: isActive(subItem.path) ? '#0096FF' : '#666666',
                                        pl: 4
                                    }}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: '14px',
                                            fontWeight: isActive(subItem.path) ? 'bold' : 'normal',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#f5f6fa', p: 3, minHeight: '100vh' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar component="nav" position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar sx={{ backgroundColor: 'inherit', minWidth: '100vw', justifyContent: 'space-between' }}>
                    <MenuOpenIcon
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt="Tama Game"
                            src="/images/web/icon-192.png"
                            sx={{ width: 45, height: 45, mr: 1 }}
                        />
                        <Typography component="div" sx={{ fontSize: '1.25rem', fontWeight: 800 }}>
                            <span style={{ color: '#1565c0' }}>Tama</span>
                            <span style={{ color: 'black' }}>Game</span>
                        </Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 3 }}>
                        {/* <Badge color="secondary" variant="dot">
                            <NotificationsIcon />
                        </Badge> */}
                        <Box onClick={handleAvatarClick} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', cursor: 'pointer' }}>
                            <IconButton sx={{ p: 0, mr: 1.5, ml: 3 }}>
                                <Avatar alt="Travis Howard" src="/ame.jpg" />
                            </IconButton>
                            <Box>
                                <p className='text-[#404040] text-sm font-bold capitalize'>{userFullname}</p>
                                <p className='text-[#565656] text-xs font-semibold capitalize'>{userRole === 'admin' ? 'Admin' : 'Pemilik'}</p>
                            </Box>
                        </Box>
                        <Popover
                            id={idPopover}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleCloseAvatar}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            sx={{ mt: 1, ml: 5 }}
                            PaperProps={{
                                sx: {
                                    borderRadius: '10px',
                                },
                            }}
                        >
                            <Box sx={{ p: 1 }}>
                                <Button variant="text" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </Box>
                        </Popover>
                    </Box>
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
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    {menuItems
                        .filter((item) => item.roles?.includes(userRole)) // Filter menu berdasarkan role
                        .map((item) => renderMenuItem(item))}
                </List>
            </Drawer>

            {/* Sidebar Drawer for Mobile */}
            <SidebarMobile
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                handleLogout={handleLogout}
                userFullname={userFullname}
                userRole={userRole}
                userAvatar={'/ame.jpg'}
            />

            {/* Main Content */}
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
                <CompBreadcrumbs menuItems={menuItems} />
                <div className='mt-10'>
                    {children}
                </div>
            </Box>
        </Box>
    );
}