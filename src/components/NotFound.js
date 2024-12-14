"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    const whatsappNumber = "6289526349534";
    const message = "Halo Anam";

    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    return (
        <>
            <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-white flex flex-col justify-center px-6 py-24 sm:py-12 lg:px-16">
                    <div className="text-left">
                        <p className="text-base font-semibold text-indigo-600">404</p>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Page not found
                        </h1>
                        <p className="mt-6 text-base leading-7 text-gray-600">
                            Sorry, we couldn&#39;t find the page you&#39;re looking for.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button
                                onClick={() => router.replace('/')}
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                            >
                                Back to home
                            </button>
                            <a href={whatsappLink} className="text-sm font-semibold text-gray-900">
                                Contact support <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right side (Image Section) */}
                <div className="hidden lg:block bg-cover bg-center" style={{ backgroundImage: `url('/ame.jpg')` }}>
                    {/* The image will cover the right half of the page */}
                </div>
            </main>
        </>
    );
}
