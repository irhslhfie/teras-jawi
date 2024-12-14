'use client';

import { useEffect, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import { useLogin } from '@/hooks/auth/useLogin';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import { toast } from "sonner";

const SignIn = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [backdropOpen, setBackdropOpen] = useState(false); // State untuk backdrop
    const { mutate, isError } = useLogin();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        mutate({ username, password }, {
            onSuccess: () => {
                setBackdropOpen(true);
            },
            onError: (error) => {
                setLoading(false);
            }
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card sx={{ mt: 12, boxShadow: 3, px: 2, borderRadius: 3 }}>
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ my: 1, mb: 2, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography variant="h5" color="textPrimary" gutterBottom textAlign="center">
                            Sign in
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom textAlign="center">
                            Welcome user, please sign in to continue
                        </Typography>

                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                type="text"
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                variant="contained"
                                disableElevation
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    textTransform: 'capitalize',
                                    position: 'relative',
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Backdrop untuk menampilkan loading */}
            <Backdrop
                open={backdropOpen}
                onClick={() => setBackdropOpen(false)}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Fade in={backdropOpen}>
                    <CircularProgress color="inherit" />
                </Fade>
            </Backdrop>
        </Container>
    );
};

export default SignIn;
