'use client';

import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import Link from 'next/link';
import { toast } from 'sonner';
import AuthLayout from '../components/auth-layout';
import Image from 'next/image';
import { useForgotPassword } from '@/hooks/auth/useLogin';

export default function ForgotPassword() {
    const [username, setUsername] = useState('');
    const { mutate } = useForgotPassword();

    const handleSend = (e) => {
        e.preventDefault();
        mutate(username);
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
                        Masukkan username dan kami akan mengirimkan instruksi ke E-Mail kamu.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSend} className="space-y-6">
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        Kirim Instruksi Reset
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

