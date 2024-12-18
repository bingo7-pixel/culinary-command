import { Home, ShoppingBag, History, Users, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: ShoppingBag, label: "Active Orders", href: "/orders" },
  { icon: History, label: "Order History", href: "/history" },
  { icon: Users, label: "User Management", href: "/users" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-dashboard-card text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="text-xl font-bold">Restaurant</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-dashboard-background"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-dashboard-background hover:text-dashboard-accent2 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className="ml-4">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}