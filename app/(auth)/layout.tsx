"use client";

import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={120} 
              height={40} 
              className="h-10 w-auto"
              priority
            />
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Gerencie seu Portfólio</h2>
            <p className="text-xl">
              Uma plataforma completa para criar e gerenciar seu portfólio profissional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 