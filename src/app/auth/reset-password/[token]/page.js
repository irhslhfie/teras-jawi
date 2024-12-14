'use client';

import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import { useParams } from "next/navigation";
import { useResetPassword } from '@/hooks/auth/useLogin';
import { Google as GoogleIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import AuthLayout from '../../components/auth-layout';

export default function ForgotPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const param = useParams();
    const { token } = param;
    const mutation = useResetPassword();

    const handleSend = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.warning('Password dan Konfirmasi Password anda tidak sama!');
        }

        if (token) {
            mutation.mutate({ token, newPassword });
        } else {
            toast.warning('Token reset password anda sudah kadaluarsa!');
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                            src="/images/web/tama_game_icon.png"
                            alt="Tama Game"
                            width={32}
                            height={32}
                        />
                    </div>
                    <span className="font-semibold">Tama Game</span>
                </div>

                {/* Heading */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Masukkan password baru.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSend} className="space-y-6">
                    <TextField
                        fullWidth
                        label="Password Baru"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#F3F4F6',
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Konfirmasi Password Baru"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#F3F4F6',
                            }
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: '#0066FF',
                            '&:hover': {
                                backgroundColor: '#0052CC',
                            },
                            textTransform: 'none',
                            py: 1.5,
                        }}
                    >
                        Buat Password Baru
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
                        Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

