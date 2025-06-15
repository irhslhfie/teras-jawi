"use client";

import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/teras_jawi.jpg" // You'll need to add this image to your public folder
          alt="BG TERAS JAWI"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 left-4 text-white text-sm">
          Created by Irhasul Hapiii
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
