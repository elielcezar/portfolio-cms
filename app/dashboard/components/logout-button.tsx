"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      // Limpar o cookie
      document.cookie = "auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Fazer logout no Firebase (opcional se você estiver usando Firebase)
      await auth.signOut();
      
      // Redirecionar para login
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      className={className}
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
} 