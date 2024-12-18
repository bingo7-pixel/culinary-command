import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "order_update" | "system_alert" | "overdue";
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock data - replace with real API calls
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "overdue",
    message: "Order #12345 is overdue by 15 minutes",
    timestamp: "5 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "order_update",
    message: "Order #456 has been completed",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "system_alert",
    message: "Low inventory alert: Chicken Wings",
    timestamp: "15 mins ago",
    read: true,
  },
];

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "overdue":
        return "text-red-500";
      case "system_alert":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-dashboard-card rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-4 text-gray-400">
                <BellOff className="h-8 w-8 mb-2" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-gray-800/50 transition-colors",
                      !notification.read && "bg-gray-800/30"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-sm mb-1",
                            getNotificationColor(notification.type)
                          )}
                        >
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400">
                          {notification.timestamp}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        <span className="sr-only">Dismiss</span>
                        <span aria-hidden="true">&times;</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};