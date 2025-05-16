import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { UploadProvider } from "@/lib/contexts/UploadContext";
import { cookies } from "next/headers";
import LogoutButton from "./components/logout-button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Verificar a autenticação com base no cookie em vez de auth.currentUser
  const authSession = cookies().get("auth-session");
  
  if (!authSession?.value) {
    redirect("/login?redirect=/dashboard");
  }
  
  // Obter informações do usuário (simplificado)
  // Se você precisar das informações reais do usuário, terá que implementar
  // uma forma de obter essas informações com base no ID do cookie
  const userEmail = "usuário autenticado"; // placeholder
  
  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: "Dashboard" },
    { href: "/dashboard/nodes", icon: <FileText className="mr-2 h-4 w-4" />, label: "Portfolio Items" },
    { href: "/dashboard/settings", icon: <Settings className="mr-2 h-4 w-4" />, label: "Settings" },
  ];
  
  return (
    <UploadProvider>
      <div className="flex min-h-screen flex-col">
        {/* Header para desktop e mobile */}
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col space-y-4 py-4">
                    <div className="px-3 py-2">
                      <h2 className="mb-2 text-lg font-semibold">Navigation</h2>
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <SheetClose asChild key={item.href}>
                            <Link href={item.href}>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start"
                                size="sm"
                              >
                                {item.icon}
                                {item.label}
                              </Button>
                            </Link>
                          </SheetClose>
                        ))}
                        <LogoutButton className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Logo */}
              <Link href="/dashboard" className="font-bold text-xl">
                Portfolio CMS
              </Link>
            </div>
            
            {/* User menu - simplificado */}
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {userEmail}
              </span>
              <LogoutButton className="hidden md:flex" />
            </div>
          </div>
        </header>
        
        {/* Layout principal */}
        <div className="flex-1 flex">
          {/* Sidebar para desktop */}
          <aside className="hidden md:flex w-64 flex-col border-r bg-background">
            <nav className="flex-1 py-8 px-4 space-y-1">
              {navItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    size="sm"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>
          
          {/* Conteúdo principal */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </UploadProvider>
  );
} 