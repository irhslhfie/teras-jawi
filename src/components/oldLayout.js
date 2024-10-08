"use client";
import * as React from 'react';
import SidebarMobile from '@/components/SidebarMobile';
import AdbIcon from '@mui/icons-material/Adb';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `0px`,  // Default margin when drawer is closed
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: `${drawerWidth}px`,  // Adjust when drawer is open
        }),
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    width: `100%`,
    zIndex: theme.zIndex.drawer + 1,  // Keep AppBar above Drawer
}));

export default function Layout({ children }) {
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);  // Mobile drawer state
    const [open, setOpen] = React.useState(false);  // Persistent drawer state
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));  // Detect mobile view

    // Automatically close the persistent drawer when in mobile view
    React.useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [isMobile]);

    const handleDrawerOpen = () => {
        setOpen((prevState) => !prevState);
    };

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar component="nav" position="fixed" open={open} color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                <Toolbar
                    sx={{ backgroundColor: 'inherit', minWidth: '100vw', mx: { xs: -0.75, sm: -1.5 } }}
                >
                    <MenuOpenIcon
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}
                    />
                    <MenuOpenIcon
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
                    />
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: 'block' }}
                    >
                        Tama Game
                    </Typography>
                    <Tooltip title="Open settings">
                        <IconButton sx={{ p: 0 }}>
                            <Avatar alt="Travis Howard" src="/ame.jpg" />
                        </IconButton>
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
                        marginTop: '64px',  // Ensure Drawer is positioned below AppBar
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                {/* Conditionally render ListItemText based on drawer open state */}
                                {open && <ListItemText primary={text} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Sidebar Drawer for Mobile */}
            <SidebarMobile mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

            <Main open={open}>
                <Box component="main" sx={{ p: 3, mt: 8 }}>
                    {children}
                </Box>
            </Main>
        </Box>
    );
}
