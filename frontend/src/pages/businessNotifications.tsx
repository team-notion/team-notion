import { BellRing, Car, CircleCheck, CreditCard, Info, SquarePen, SquareX, Trash2 } from "lucide-react";
import { Notification, useNotification } from "@/components/lib/notificationContext";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import NotificationCards from "@/components/notificationCards";
import { useState } from "react";


const getNotificationIcon = (notification: Notification) => {
  const message = notification.message.toLowerCase();

  if (message.includes("reservation") || message.includes("booking")) {
    if (message.includes("confirmed")) {
      return <CircleCheck className="text-[#10B981]" />;
    }
    if (message.includes("cancelled")) {
      return <SquareX className="text-[#FE130A]" />;
    }
    if (message.includes("updated") || message.includes("modified")) {
      return <SquarePen className="text-[#F97316]" />;
    }
    if (message.includes("reminder")) {
      return <BellRing className="text-[#F6FF00]" />;
    }
  }


  if (message.includes("payment") || message.includes("deposit") || message.includes("paid")) {
    if (message.includes("confirmed")) {
      return <CreditCard className="text-[#001EB4]" />;
    }
    if (message.includes("cancelled")) {
      return <SquareX className="text-[#FE130A]" />;
    }
    if (message.includes("updated") || message.includes("modified")) {
      return <SquarePen className="text-[#F97316]" />;
    }
    if (message.includes("reminder")) {
      return <BellRing className="text-[#F6FF00]" />;
    }
  }


  if (message.includes("vehicle") || message.includes("car")) {
    return <Car className="w-5 h-5 text-indigo-600" />;
  }


  switch (notification.type) {
    case "success":
    case "reservation":
      return <CircleCheck className="w-5 h-5 text-[#001EB4]" />;
    case "error":
    case "cancelled":
      return <SquareX className="w-5 h-5 text-[#FE130A]" />;
    case "payment":
      return <CreditCard className="w-5 h-5 text-[#001EB4]" />;
    case "updated":
      return <SquarePen className="w-5 h-5 text-[#F97316]" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};


const getNotificationBgColor = (notification: Notification) => {
  if (!notification.isRead) {
    switch (notification.type) {
      case "success":
      case "reservation":
        return "bg-blue-50 hover:bg-blue-100";
      case "error":
      case "cancelled":
        return "bg-red-50 hover:bg-red-100";
      case "payment":
        return "bg-blue-50 hover:bg-blue-100";
      case "updated":
        return "bg-purple-50 hover:bg-purple-100";
      default:
        return "bg-gray-50 hover:bg-gray-100";
    }
  }
  return "bg-white hover:bg-gray-50";
};



const getAdditionalText = (title: string): string => {
  const titleMap: Record<string, string> = {
    "Reservation Confirmed":
      "We locked in your booking details - all that's left is to pick up and drive.\nThank you for choosing us for your journey.\nNeed to make changes or view your reservation? You can manage update or reschedule reservations in the bookings tab",
    "Payment Confirmed":
      "Your car is now fully reserved — get ready to hit the road! 🚗",
    "Reservation Cancelled":
      "We're sorry to see this one go — but you can always book again anytime.",
    "Reservation Updated": "Review the new details in the reservations tab.",
    "Payment Reminder":
      "Complete your payment soon to secure your car before your hold expires.\nDon't miss out — confirm now and drive with confidence! 🚗",
    "Payment Failed":
      "There was an issue processing your payment. Please try again or use a different payment method.",
    "Reservation Reminder":
      "Your reservation is coming up soon! Get ready for your trip.",
  };

  return titleMap[title] || "";
};


const BusinessNotifications = () => {
  const { notifications, markNotificationAsRead /* deleteNotification */ } = useNotification();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    setSelectedNotification(notification);
    setIsNotificationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNotificationModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="space-y-6 px-0 lg:px-4">
      <div className="gap-3 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl lg:text-2xl font-semibold text-black leading-9">
            Notifications
          </h1>
          {notifications.length > 0 && (
            <p className="text-sm text-gray-500">
              {notifications.filter((n) => !n.isRead).length} unread
            </p>
          )}
        </div>

        {notifications.length === 0 ? (
          <Item className="p-8 text-center text-muted-foreground">
            <ItemContent>
              <ItemDescription>No notifications yet</ItemDescription>
            </ItemContent>
          </Item>
        ) : (
          <div className="space-y-2 overflow-y-auto">
            {notifications.map((notification) => (
              <Item
                key={notification.id}
                className={`flex flex-col md:flex-row cursor-pointer bg-red-600 items-start md:items-center gap-4 lg:gap-8 p-2 transition-colors ${
                  !notification.isRead ? "bg-accent/10" : ""
                } ${getNotificationBgColor(notification)}`}
                variant={"outline"}
                onClick={() => handleNotificationClick(notification)}
              >
                <p className="text-xs text-muted-foreground font-medium">
                  {new Date(notification.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
                <ItemContent className="flex-1 lg:ml-3 space-y-1">
                  <div className="flex gap-2 items-center">
                    <div className="text-lg">
                      {getNotificationIcon(notification)}
                    </div>
                    <ItemTitle>{notification.title}</ItemTitle>
                  </div>
                  <ItemDescription>{notification.message}</ItemDescription>
                </ItemContent>

                {/* <div >
                        <h3 className="font-semibold"></h3>
                        <p className="text-sm text-muted-foreground">
                      
                        </p>
                      </div> */}
                {/* <ItemActions>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                        deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </ItemActions> */}
              </Item>
            ))}
          </div>
        )}

        <NotificationCards isOpen={isNotificationModalOpen} onClose={handleCloseModal} title={selectedNotification?.title || ""} notificationIcon={ selectedNotification ? getNotificationIcon(selectedNotification) : undefined } description={selectedNotification?.message} additionalText={getAdditionalText(selectedNotification?.title || "")} />
      </div>
    </div>
  );
};

export default BusinessNotifications;
