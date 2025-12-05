import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { deleteData, getData, patchData } from "./apiMethods";
import CONFIG from "../utils/config";
import { apiEndpoints } from "./apiEndpoints";
import { useAuth } from "./authContext";
import { LOCAL_STORAGE_KEYS } from "../utils/localStorageKeys";

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | 'reservation' | 'cancelled' | 'updated' | 'payment' | 'reminder';
  isRead: boolean;
  createdAt: string;
  timeStamp?: number;
  user?: string | number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  // deleteNotification: (id: string) => Promise<void>;
  clearNotification: () => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProfviderProps {
  children: ReactNode;
  pollingInterval?: number;
}

export function NotificationProvider({ children, pollingInterval = 60000 }: NotificationProfviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const getToken = useCallback(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN); }, []);

  // Map API status to notification type
  const mapStatusToType = (status: string): Notification['type'] => {
    const statusMap: Record<string, Notification['type']> = {
      'success': 'success',
      'error': 'error',
      'reservation': 'reservation',
      'cancelled': 'cancelled',
      'updated': 'updated',
      'payment': 'payment',
    };
    return statusMap[status] || 'info';
  };

  const getNotificationTitle = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('reservation') || lowerMessage.includes('booking')) {
      if (lowerMessage.includes('confirmed')) return 'Reservation Confirmed';
      if (lowerMessage.includes('cancelled')) return 'Reservation Cancelled';
      if (lowerMessage.includes('updated') || lowerMessage.includes('modified')) return 'Reservation Updated';
      if (lowerMessage.includes('reminder')) return 'Reservation Reminder';
      return 'Reservation Notification';
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('deposit') || lowerMessage.includes('paid')) {
      if (lowerMessage.includes('confirmed')) return 'Payment Confirmed';
      if (lowerMessage.includes('cancelled')) return 'Payment Cancelled';
      if (lowerMessage.includes('failed')) return 'Payment Failed';
      if (lowerMessage.includes('reminder')) return 'Payment Reminder';
      return 'Payment Notification';
    }

    if (lowerMessage.includes('vehicle') || lowerMessage.includes('car')) {
      return 'Vehicle Update';
    }

    // Default titles based on message content
    if (lowerMessage.includes('success') || lowerMessage.includes('completed')) return 'Success';
    if (lowerMessage.includes('error') || lowerMessage.includes('failed')) return 'Error';
    if (lowerMessage.includes('warning') || lowerMessage.includes('attention')) return 'Warning';

    return 'Notification';
  };

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const token = getToken();
      
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_NOTIFICATIONS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (resp.status === 200) {
        const data = await resp.data;

        const transformedNotifications: Notification[] = (data.results || []).map((notif: any) => ({
          id: notif.id,
          title: getNotificationTitle(notif.message),
          message: notif.message,
          type: mapStatusToType(notif.status),
          isRead: notif.read,
          createdAt: notif.created_at,
          timeStamp: new Date(notif.created_at).getTime(),
          user: notif.user,
        }))

        setNotifications(transformedNotifications);
      }
    }
    catch (err) {
      console.error("Error fetching notifications:", err);
    }
    finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getToken]);


  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const notificationToUpdate = notifications.find(notif => notif.id === id);
    
      if (!notificationToUpdate || notificationToUpdate.isRead) {
        return;
      }

      const token = getToken();
      const resp = await patchData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_NOTIFICATIONS}`.replace(':id', id), { read: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (resp.status === 200) {
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
      }
    }
    catch (err) {
      console.error("Error marking notification as read:", err);

      fetchNotifications();
    }
  }, [isAuthenticated, notifications, fetchNotifications]);


  // const deleteNotification = useCallback(async (id: string) => {
  //   try {
  //     const token = getToken();

  //     const resp = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.UPDATE_NOTIFICATIONS}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     });

  //     if (resp.status === 204 || resp.status === 200) {
  //       setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  //     }
  //   }
  //   catch (err) {
  //     console.error("Error deleting notification:", err);
  //   }
  // }, [getToken, fetchNotifications]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, pollingInterval, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, addNotification, markNotificationAsRead, /* deleteNotification, */ clearNotification: clearNotifications, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
}


export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}