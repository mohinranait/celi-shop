"use client";

import { useState } from "react";
import {
  Bell,
  Package,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  User,
  Check,
  X,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Notification {
  id: string;
  type: "order" | "message" | "alert" | "system" | "promotion";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    description: "Order #12345 from John Doe - $89.99",
    timestamp: "2 minutes ago",
    isRead: false,
    avatar: "/default.png?height=32&width=32",
  },
  {
    id: "2",
    type: "message",
    title: "Customer Message",
    description: "Sarah asked about product availability",
    timestamp: "15 minutes ago",
    isRead: false,
    avatar: "/default.png?height=32&width=32",
  },
  {
    id: "3",
    type: "alert",
    title: "Low Stock Alert",
    description: "Wireless Headphones - Only 3 items left",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    description: "New features available in your dashboard",
    timestamp: "2 hours ago",
    isRead: false,
  },
  {
    id: "5",
    type: "promotion",
    title: "Sales Report Ready",
    description: "Your weekly sales report is now available",
    timestamp: "3 hours ago",
    isRead: true,
  },
  {
    id: "6",
    type: "order",
    title: "Order Shipped",
    description: "Order #12340 has been shipped to customer",
    timestamp: "5 hours ago",
    isRead: true,
    avatar: "/default.png?height=32&width=32",
  },
  {
    id: "7",
    type: "message",
    title: "Product Review",
    description: "New 5-star review on Smart Watch",
    timestamp: "1 day ago",
    isRead: true,
    avatar: "/default.png?height=32&width=32",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <Package className="h-4 w-4 text-blue-600" />;
    case "message":
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "system":
      return <Settings className="h-4 w-4 text-purple-600" />;
    case "promotion":
      return <TrendingUp className="h-4 w-4 text-orange-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

const getNotificationBgColor = (type: string, isRead: boolean) => {
  if (isRead) {
    return "bg-gray-50";
  }

  switch (type) {
    case "order":
      return "bg-blue-50";
    case "message":
      return "bg-green-50";
    case "alert":
      return "bg-yellow-50";
    case "system":
      return "bg-purple-50";
    case "promotion":
      return "bg-orange-50";
    default:
      return "bg-gray-50";
  }
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 bg-transparent  text-black relative"
        >
          <Bell className="size-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-1 bg-primary text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex bg-background items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7 px-2"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-gray-400 text-sm">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 bg-foreground transition-colors ${getNotificationBgColor(
                    notification.type,
                    notification.isRead
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={notification.avatar || "/default.png"}
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white border flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${notification.isRead
                                ? "text-gray-700"
                                : "text-gray-900"
                              }`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-sm mt-1 ${notification.isRead
                                ? "text-gray-500"
                                : "text-gray-600"
                              }`}
                          >
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 text-gray-400 hover:text-gray-600"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm">
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}