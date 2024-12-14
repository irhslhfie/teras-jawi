import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import { usePathname } from 'next/navigation';

export default function CompBreadcrumbs({ menuItems }) {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);

    const dashboardItem = menuItems.find(item => item.path === '/');

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {dashboardItem && (
                pathname === '/' ? (
                    <Typography
                        key="dashboard"
                        sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        component="span"
                    >
                        <ListItemIcon sx={{ mr: 1, minWidth: 'auto', color: "inherit" }}>
                            {dashboardItem.icon}
                        </ListItemIcon>
                        {dashboardItem.text}
                    </Typography>
                ) : (
                    <Link
                        key="dashboard"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        href={dashboardItem.path}
                    >
                        <ListItemIcon sx={{ mr: 1, minWidth: 'auto' }}>
                            {dashboardItem.icon}
                        </ListItemIcon>
                        {dashboardItem.text}
                    </Link>
                )
            )}

            {pathSegments.map((segment, index) => {
                const matchedItem = menuItems.find(item => item.path && item.path.includes(segment)); // Pastikan path ada
                const isLast = index === pathSegments.length - 1;

                if (!matchedItem) {
                    // Jika tidak ada matchedItem, gunakan segment sebagai fallback
                    return isLast ? (
                        <Typography
                            key={index}
                            sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                            component="span"
                        >
                            {segment.replace('-', ' ')} {/* Format segment untuk lebih user-friendly */}
                        </Typography>
                    ) : (
                        <Link
                            key={index}
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center' }}
                            color="inherit"
                            href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                        >
                            {segment.replace('-', ' ')} {/* Format segment */}
                        </Link>
                    );
                }

                return isLast ? (
                    <Typography
                        key={index}
                        sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}
                        component="span"
                    >
                        {matchedItem.icon && (
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: 'inherit' }}>
                                {matchedItem.icon}
                            </ListItemIcon>
                        )}
                        {matchedItem.text}
                    </Typography>
                ) : (
                    <Link
                        key={index}
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                        color="inherit"
                        href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                    >
                        {matchedItem.icon && (
                            <ListItemIcon sx={{ mr: 1, minWidth: 'auto' }}>
                                {matchedItem.icon}
                            </ListItemIcon>
                        )}
                        {matchedItem.text}
                    </Link>
                );
            })}

        </Breadcrumbs>
    );
}
