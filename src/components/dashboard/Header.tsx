import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/components/dashboard/ThemeProvider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentUser } from "@/data/mockDashboard";

interface HeaderProps {
  title: string;
  period?: string;
  onPeriodChange?: (v: string) => void;
}

export function Header({ title, period, onPeriodChange }: HeaderProps) {
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar leads, clientes..." className="w-64 pl-9" />
        </div>
        {onPeriodChange && (
          <Select value={period ?? "30d"} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="ghost" size="icon" aria-label="Alternar tema" aria-pressed={dark} onClick={toggleTheme}>
          {dark ? <Sun /> : <Moon />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
        </Button>
        <Avatar className="size-9">
          <AvatarFallback className="bg-accent text-sm font-semibold text-accent-foreground">
            {currentUser.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
