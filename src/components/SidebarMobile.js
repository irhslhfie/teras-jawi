import { useState } from 'react';
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
    const [openSubMenu, setOpenSubMenu] = useState({});

    const handleSubMenuToggle = (text) => {
        setOpenSubMenu((prevState) => ({
            ...prevState,
            [text]: !prevState[text],
        }));
    };

    const isActive = (path) => {
        return router.pathname === path;
    };

    const renderMenuItem = (item, depth = 0) => (
        <div key={item.text}>
            <ListItem disablePadding>
                <ListItemButton
                    sx={{
                        textAlign: 'left',
                        pl: 2 + depth * 2,
                        backgroundColor: isActive(item.path) ? '#e6f3ff' : 'inherit',
                        '&:hover': {
                            backgroundColor: isActive(item.path) ? '#e6f3ff' : '#f0f9ff',
                        },
                    }}
                    onClick={() => {
                        if (item.subItems) {
                            handleSubMenuToggle(item.text);
                        } else {
                            router.push(item.path);
                            handleDrawerToggle();
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
                                onClick={() => {
                                    router.push(subItem.path);
                                    handleDrawerToggle();
                                }}
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

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ my: 2, textAlign: 'center' }}>
                MUI
            </Typography>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List>
                    {menuItems.map((item) => renderMenuItem(item))}
                </List>
            </Box>
            <Divider />

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
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
        </nav>
    );
};

export default SidebarMobile;

